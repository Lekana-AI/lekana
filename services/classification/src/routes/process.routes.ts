import { Router, Request, Response } from 'express';
import { geminiService } from '../services/gemini.service';
import { documentAIService } from '../services/documentai.service';
import { categoryService } from '../services/category.service';
import { documentService } from '../services/document.service';
import { Classification } from '../types';
import { getConfidenceThreshold, shouldRequireHumanReview } from '../utils/confidence.util';
import { logger } from '../utils/logger.util';

const router = Router();

// Types matching runtime's ServiceRequest/ServiceResponse contract
interface DocumentRef {
    url: string;
    filename: string;
    mimeType: string;
    size?: number;
}

interface ServiceRequest {
    executionId: string;
    nodeId: string;
    workflowId: string;
    userId: string;
    input: {
        data?: any;
        documents?: DocumentRef[];
    };
    config: {
        mode?: 'custom' | 'auto';
        stepName?: string;
        customLabels?: string[];
        confidenceThreshold?: number;
    };
    metadata?: {
        correlationId?: string;
        priority?: 'low' | 'normal' | 'high';
    };
}

const SERVICE_VERSION = process.env.SERVICE_VERSION || '1.0.0';

/**
 * POST /api/v1/process
 * Main processing endpoint - follows runtime's ServiceRequest/ServiceResponse contract
 */
router.post('/process', async (req: Request, res: Response) => {
    const startTime = Date.now();

    try {
        const {
            executionId,
            nodeId,
            workflowId,
            userId,
            input = {},
            config = {}
        } = req.body as ServiceRequest;

        const {
            mode = 'auto',
            customLabels = [],
            confidenceThreshold
        } = config;

        const documents = input.documents || [];

        logger.info(`[Process] Classification request - Execution: ${executionId}, Node: ${nodeId}`);
        logger.info(`[Process] Mode: ${mode}, Documents: ${documents.length}`);

        if (!documents.length) {
            throw new Error('No documents provided in input.documents');
        }

        const threshold = getConfidenceThreshold(confidenceThreshold);
        const classifications: Classification[] = [];
        let anyRequiresReview = false;

        // Fetch existing categories for auto mode
        let existingCategories: any[] = [];
        if (mode === 'auto') {
            existingCategories = await categoryService.getWorkflowCategories(workflowId);
        }

        // Process each document
        for (const doc of documents) {
            try {
                logger.info(`[Process] Classifying document: ${doc.filename}`);

                let classification: Classification;

                if (mode === 'custom' && customLabels.length > 0) {
                    // Custom mode: Try Document AI first, fallback to Gemini
                    if (documentAIService.isConfigured()) {
                        try {
                            classification = await documentAIService.classifyDocument(
                                doc.url,
                                doc.filename,
                                customLabels
                            );

                            if (classification.confidence < threshold) {
                                logger.info('Document AI confidence below threshold, using Gemini fallback');
                                classification = await geminiService.classifyDocument(
                                    doc.url,
                                    doc.filename,
                                    { customLabels }
                                );
                            }
                        } catch (docAIError) {
                            logger.warn('Document AI failed, falling back to Gemini', { error: docAIError });
                            classification = await geminiService.classifyDocument(
                                doc.url,
                                doc.filename,
                                { customLabels }
                            );
                        }
                    } else {
                        classification = await geminiService.classifyDocument(
                            doc.url,
                            doc.filename,
                            { customLabels }
                        );
                    }
                } else {
                    // Auto mode: Use Gemini with existing categories
                    classification = await geminiService.classifyDocument(
                        doc.url,
                        doc.filename,
                        { existingCategories }
                    );

                    // Match to existing category if possible
                    const { category, isNew } = await categoryService.getOrCreateCategory(
                        workflowId,
                        classification.label
                    );

                    if (!isNew && category.label !== classification.label) {
                        classification = { ...classification, label: category.label };
                    }
                }

                // Check if human review is needed
                const requiresReview = shouldRequireHumanReview(classification.confidence, threshold);
                if (requiresReview) {
                    anyRequiresReview = true;
                }

                // Save classification to database
                await documentService.saveClassification(
                    workflowId,
                    doc.url,
                    doc.filename,
                    doc.mimeType,
                    classification,
                    requiresReview
                );

                // Add category to workflow
                await categoryService.addCategoryToWorkflow(workflowId, classification.label);

                classifications.push(classification);

                logger.info(`[Process] Classified ${doc.filename} as "${classification.label}" (${classification.confidence})`);
            } catch (docError: any) {
                logger.error('Error classifying document', { filename: doc.filename, error: docError });

                classifications.push({
                    documentUrl: doc.url,
                    filename: doc.filename,
                    label: 'Classification Failed',
                    confidence: 0,
                    alternatives: [],
                    model: 'gemini'
                });
                anyRequiresReview = true;
            }
        }

        const processingTime = Date.now() - startTime;
        logger.info(`[Process] Classification completed in ${processingTime}ms`);

        // Build ServiceResponse
        res.json({
            success: true,
            data: {
                classifications,
                summary: {
                    totalDocuments: documents.length,
                    processedDocuments: classifications.length,
                    mode,
                    customLabels: mode === 'custom' ? customLabels : undefined
                }
            },
            documents: documents.map(d => ({
                url: d.url,
                filename: d.filename,
                mimeType: d.mimeType
            })),
            metadata: {
                processingTime,
                serviceVersion: SERVICE_VERSION,
                modelUsed: documentAIService.isConfigured() ? 'document-ai-with-gemini-fallback' : 'gemini'
            },
            requiresHumanReview: anyRequiresReview,
            humanReviewData: anyRequiresReview ? {
                type: 'classification',
                originalResult: classifications,
                confidence: Math.min(...classifications.map(c => c.confidence))
            } : undefined
        });
    } catch (error: any) {
        const processingTime = Date.now() - startTime;
        logger.error(`[Process] Error:`, error.message);

        res.status(400).json({
            success: false,
            data: null,
            error: {
                code: 'CLASSIFICATION_ERROR',
                message: error.message,
                details: error.stack
            },
            metadata: {
                processingTime,
                serviceVersion: SERVICE_VERSION
            }
        });
    }
});

export default router;
