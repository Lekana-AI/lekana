import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { Classification, Alternative } from '../types';
import { logger } from '../utils/logger.util';
import { sortAlternatives } from '../utils/confidence.util';

export class DocumentAIService {
    private client: DocumentProcessorServiceClient;
    private projectId: string;
    private location: string;
    private processorId: string;

    constructor() {
        this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || '';
        this.location = process.env.GOOGLE_CLOUD_LOCATION || 'us';
        this.processorId = process.env.GOOGLE_CLOUD_PROCESSOR_ID || '';

        if (!this.projectId || !this.processorId) {
            logger.warn('Document AI credentials not fully configured');
        }

        this.client = new DocumentProcessorServiceClient();
    }

    /**
     * Classifies a document using Google Document AI
     */
    public async classifyDocument(
        documentUrl: string,
        filename: string,
        customLabels?: string[]
    ): Promise<Classification> {
        try {
            logger.info('Classifying document with Document AI', { filename, documentUrl });

            // Download document content
            const documentContent = await this.fetchDocumentContent(documentUrl);

            // Construct the processor name
            const name = `projects/${this.projectId}/locations/${this.location}/processors/${this.processorId}`;

            // Process the document
            const request = {
                name,
                rawDocument: {
                    content: documentContent,
                    mimeType: this.getMimeTypeFromUrl(documentUrl) || 'application/pdf'
                }
            };

            const [result] = await this.client.processDocument(request);
            const { document } = result;

            if (!document) {
                throw new Error('No document returned from Document AI');
            }

            // Extract classification from Document AI result
            // Note: This is a simplified extraction - real implementation depends on processor type
            const classification = this.extractClassification(
                document,
                documentUrl,
                filename,
                customLabels
            );

            logger.info('Document AI classification complete', {
                filename,
                label: classification.label,
                confidence: classification.confidence
            });

            return classification;
        } catch (error) {
            logger.error('Document AI classification failed', error);
            throw new Error(`Document AI classification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Fetches document content from URL
     */
    private async fetchDocumentContent(url: string): Promise<Buffer> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch document: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            return Buffer.from(arrayBuffer);
        } catch (error) {
            logger.error('Error fetching document content', error);
            throw error;
        }
    }

    /**
     * Extracts classification from Document AI response
     * This is a simplified version - actual implementation depends on processor configuration
     */
    private extractClassification(
        document: any,
        documentUrl: string,
        filename: string,
        customLabels?: string[]
    ): Classification {
        // For document classification processor, extract entities
        const entities = document.entities || [];

        if (entities.length === 0) {
            throw new Error('No classification results from Document AI');
        }

        // Sort entities by confidence
        const sortedEntities = entities
            .filter((e: any) => e.type && e.confidence)
            .sort((a: any, b: any) => (b.confidence || 0) - (a.confidence || 0));

        if (sortedEntities.length === 0) {
            throw new Error('No valid classifications found');
        }

        // Primary classification
        const primary = sortedEntities[0];
        const label = primary.type || primary.mentionText || 'Unknown';
        const confidence = primary.confidence || 0;

        // Alternative classifications
        const alternatives: Alternative[] = sortedEntities
            .slice(1, 4) // Top 3 alternatives
            .map((entity: any) => ({
                label: entity.type || entity.mentionText || 'Unknown',
                confidence: entity.confidence || 0
            }));

        return {
            documentUrl,
            filename,
            label,
            confidence: parseFloat(confidence.toFixed(4)),
            alternatives: sortAlternatives(alternatives),
            model: 'document-ai'
        };
    }

    /**
     * Gets MIME type from URL extension
     */
    private getMimeTypeFromUrl(url: string): string | null {
        const extension = url.split('.').pop()?.toLowerCase();
        const mimeTypes: Record<string, string> = {
            'pdf': 'application/pdf',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'tiff': 'image/tiff',
            'gif': 'image/gif'
        };
        return extension ? mimeTypes[extension] || null : null;
    }

    /**
     * Checks if Document AI is properly configured
     */
    public isConfigured(): boolean {
        return !!(this.projectId && this.processorId);
    }
}

export const documentAIService = new DocumentAIService();
