import { GoogleGenerativeAI } from '@google/generative-ai';
import { Classification, Alternative, Category } from '../types';
import { logger } from '../utils/logger.util';
import { sortAlternatives, normalizeConfidences } from '../utils/confidence.util';

export class GeminiService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any;

    constructor() {
        // Don't initialize here - do it lazily when first needed
    }

    private ensureInitialized() {
        if (!this.genAI) {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error('GEMINI_API_KEY environment variable is required');
            }
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-09-2025' });
        }
    }

    /**
     * Classifies a document using Gemini with optional category context
     */
    public async classifyDocument(
        documentUrl: string,
        filename: string,
        options: {
            customLabels?: string[];
            existingCategories?: Category[];
        } = {}
    ): Promise<Classification> {
        try {
            this.ensureInitialized(); // Lazy initialization
            logger.info('=== GEMINI CLASSIFICATION START ===');
            logger.info('Classifying document with Gemini', { filename, documentUrl: documentUrl.substring(0, 100) + '...' });

            const { customLabels, existingCategories } = options;
            logger.info('Options:', { customLabels, existingCategoriesCount: existingCategories?.length || 0 });

            // Fetch document content as base64
            logger.info('Fetching document as base64...');
            const documentData = await this.fetchDocumentAsBase64(documentUrl);
            logger.info('Document fetched successfully', { base64Length: documentData.length });

            const mimeType = this.getMimeTypeFromUrl(documentUrl);
            logger.info('Detected MIME type:', { mimeType });

            // Build prompt
            const prompt = this.buildClassificationPrompt(
                filename,
                customLabels,
                existingCategories
            );
            logger.info('Built prompt:', { promptLength: prompt.length, promptPreview: prompt.substring(0, 200) + '...' });

            // Call Gemini with vision
            logger.info('Calling Gemini API...');
            const result = await this.model.generateContent([
                {
                    inlineData: {
                        data: documentData,
                        mimeType
                    }
                },
                prompt
            ]);

            const response = await result.response;
            const text = response.text();
            logger.info('Gemini raw response:', { responseText: text });

            // Extract token usage from response
            const usageMetadata = response.usageMetadata;
            const tokensUsed = usageMetadata ? {
                promptTokens: usageMetadata.promptTokenCount || 0,
                completionTokens: usageMetadata.candidatesTokenCount || 0,
                totalTokens: usageMetadata.totalTokenCount || 0
            } : null;

            if (tokensUsed) {
                logger.info(`Gemini token usage: ${tokensUsed.promptTokens} prompt + ${tokensUsed.completionTokens} completion = ${tokensUsed.totalTokens} total`);
            }

            // Parse classification from response
            const classification = this.parseClassificationResponse(
                text,
                documentUrl,
                filename
            );

            // Add token usage to classification result
            (classification as any).tokensUsed = tokensUsed;

            logger.info('Gemini classification complete', {
                filename,
                label: classification.label,
                confidence: classification.confidence,
                tokensUsed: tokensUsed?.totalTokens
            });
            logger.info('=== GEMINI CLASSIFICATION END ===');

            return classification;
        } catch (error) {
            logger.error('=== GEMINI CLASSIFICATION FAILED ===');
            logger.error('Gemini classification failed', {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            });
            throw new Error(`Gemini classification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Fetches document and converts to base64
     */
    private async fetchDocumentAsBase64(url: string): Promise<string> {
        try {
            logger.info('Fetching document from URL:', { urlPreview: url.substring(0, 80) + '...' });
            const response = await fetch(url);
            logger.info('Fetch response:', { status: response.status, statusText: response.statusText });

            if (!response.ok) {
                throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            logger.info('Document buffer size:', { bytes: buffer.length });
            return buffer.toString('base64');
        } catch (error) {
            logger.error('Error fetching document for Gemini', {
                error: error instanceof Error ? error.message : String(error),
                url: url.substring(0, 80) + '...'
            });
            throw error;
        }
    }

    /**
     * Builds classification prompt based on available context
     */
    private buildClassificationPrompt(
        filename: string,
        customLabels?: string[],
        existingCategories?: Category[]
    ): string {
        let prompt = `Analyze this document (${filename}) and classify it into a document type category.

Return your response in the following JSON format:
{
  "label": "Primary category name",
  "confidence": 0.95,
  "alternatives": [
    {"label": "Alternative category 1", "confidence": 0.03},
    {"label": "Alternative category 2", "confidence": 0.02}
  ]
}

`;

        if (customLabels && customLabels.length > 0) {
            prompt += `You MUST classify into one of these predefined categories:\n${customLabels.map(l => `- ${l}`).join('\n')}\n\n`;
        } else if (existingCategories && existingCategories.length > 0) {
            const categoryList = existingCategories.map(c => c.label).join(', ');
            prompt += `Preferred categories (use if applicable): ${categoryList}\n\n`;
            prompt += `If the document doesn't match any existing category, you may create a new category name.\n\n`;
        } else {
            prompt += `Common document types include: Invoice, Receipt, Contract, ID Card, Passport, Birth Certificate, Driver's License, Bank Statement, Tax Form, Medical Record, Insurance Policy, etc.\n\n`;
        }

        prompt += `Ensure confidence scores sum to approximately 1.0. Be specific and accurate in your classification.`;

        return prompt;
    }

    /**
     * Parses Gemini response into Classification object
     */
    private parseClassificationResponse(
        responseText: string,
        documentUrl: string,
        filename: string
    ): Classification {
        try {
            // Extract JSON from response (handle markdown code blocks)
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in Gemini response');
            }

            const parsed = JSON.parse(jsonMatch[0]);

            if (!parsed.label || typeof parsed.confidence !== 'number') {
                throw new Error('Invalid classification format from Gemini');
            }

            // Normalize alternatives
            let alternatives: Alternative[] = parsed.alternatives || [];
            alternatives = normalizeConfidences(alternatives);
            alternatives = sortAlternatives(alternatives).slice(0, 3); // Top 3

            return {
                documentUrl,
                filename,
                label: parsed.label,
                confidence: parseFloat(parsed.confidence.toFixed(4)),
                alternatives,
                model: 'gemini'
            };
        } catch (error) {
            logger.error('Error parsing Gemini response', { responseText, error });

            // Fallback: create basic classification
            return {
                documentUrl,
                filename,
                label: 'Unknown Document',
                confidence: 0.5,
                alternatives: [],
                model: 'gemini'
            };
        }
    }

    /**
     * Gets MIME type from URL extension
     */
    private getMimeTypeFromUrl(url: string): string {
        // Remove query parameters before extracting extension (important for signed URLs)
        const urlWithoutQuery = url.split('?')[0];
        const extension = urlWithoutQuery.split('.').pop()?.toLowerCase();
        const mimeTypes: Record<string, string> = {
            'pdf': 'application/pdf',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'tiff': 'image/tiff',
            'gif': 'image/gif'
        };
        return extension && mimeTypes[extension] ? mimeTypes[extension] : 'application/pdf';
    }
}

export const geminiService = new GeminiService();
