import { Request, Response } from 'express';
import { documentAIService } from '../services/documentai.service';
import { geminiService } from '../services/gemini.service';
import { categoryService } from '../services/category.service';
import { documentService } from '../services/document.service';
import {
    ClassifyCustomRequest,
    ClassifyAutoRequest,
    Classification,
    ClassificationResponse
} from '../types';
import { getConfidenceThreshold, shouldRequireHumanReview } from '../utils/confidence.util';
import { logger } from '../utils/logger.util';
import { createError } from '../middleware/error.middleware';

export class ClassificationController {
    /**
     * Endpoint 1: Classify with custom labels (Document AI + Gemini fallback)
     */
    public async classifyWithCustomLabels(req: Request, res: Response): Promise<void> {
        const startTime = Date.now();

        try {
            const { workflowId, documents, customLabels, confidenceThreshold } = req.body as ClassifyCustomRequest;

            const threshold = getConfidenceThreshold(confidenceThreshold);
            logger.info('Processing custom classification request', {
                workflowId,
                documentCount: documents.length,
                customLabels,
                threshold
            });

            const classifications: Classification[] = [];
            let anyRequiresReview = false;

            // Process each document
            for (const document of documents) {
                try {
                    let classification: Classification;

                    // Try Document AI first if configured
                    if (documentAIService.isConfigured()) {
                        try {
                            classification = await documentAIService.classifyDocument(
                                document.url,
                                document.filename,
                                customLabels
                            );

                            // Check if confidence is below threshold - fallback to Gemini
                            if (classification.confidence < threshold) {
                                logger.info('Document AI confidence below threshold, using Gemini fallback', {
                                    filename: document.filename,
                                    confidence: classification.confidence,
                                    threshold
                                });

                                classification = await geminiService.classifyDocument(
                                    document.url,
                                    document.filename,
                                    { customLabels }
                                );
                            }
                        } catch (docAIError) {
                            logger.warn('Document AI failed, falling back to Gemini', {
                                filename: document.filename,
                                error: docAIError
                            });

                            classification = await geminiService.classifyDocument(
                                document.url,
                                document.filename,
                                { customLabels }
                            );
                        }
                    } else {
                        // Use Gemini directly if Document AI not configured
                        logger.info('Document AI not configured, using Gemini', { filename: document.filename });
                        classification = await geminiService.classifyDocument(
                            document.url,
                            document.filename,
                            { customLabels }
                        );
                    }

                    // Determine if human review is needed
                    const requiresReview = shouldRequireHumanReview(classification.confidence, threshold);
                    if (requiresReview) {
                        anyRequiresReview = true;
                    }

                    // Save classification to database
                    await documentService.saveClassification(
                        workflowId,
                        document.url,
                        document.filename,
                        document.mimeType,
                        classification,
                        requiresReview
                    );

                    // Add category to workflow
                    await categoryService.addCategoryToWorkflow(workflowId, classification.label);

                    classifications.push(classification);
                } catch (docError) {
                    logger.error('Error classifying document', {
                        filename: document.filename,
                        error: docError
                    });

                    // Add failed classification
                    classifications.push({
                        documentUrl: document.url,
                        filename: document.filename,
                        label: 'Classification Failed',
                        confidence: 0,
                        alternatives: [],
                        model: 'gemini'
                    });
                    anyRequiresReview = true;
                }
            }

            const processingTime = Date.now() - startTime;

            // Aggregate total tokens used across all classifications
            const totalTokensUsed = classifications.reduce((sum, c: any) => {
                return sum + (c.tokensUsed?.totalTokens || 0);
            }, 0);

            const response: ClassificationResponse = {
                success: true,
                data: {
                    classifications
                },
                metadata: {
                    processingTime,
                    serviceVersion: process.env.SERVICE_VERSION || '1.0.0',
                    modelUsed: documentAIService.isConfigured() ? 'document-ai-with-gemini-fallback' : 'gemini',
                    tokensUsed: totalTokensUsed
                },
                requiresHumanReview: anyRequiresReview
            };

            logger.info('Custom classification completed', {
                workflowId,
                processingTime,
                requiresReview: anyRequiresReview
            });

            res.status(200).json(response);
        } catch (error) {
            logger.error('Error in classifyWithCustomLabels', error);
            throw createError('Failed to process classification request', 500);
        }
    }

    /**
     * Endpoint 2: Auto-categorization (Gemini with category history)
     */
    public async autoClassify(req: Request, res: Response): Promise<void> {
        const startTime = Date.now();

        try {
            const { workflowId, documents, confidenceThreshold } = req.body as ClassifyAutoRequest;

            const threshold = getConfidenceThreshold(confidenceThreshold);
            logger.info('Processing auto-classification request', {
                workflowId,
                documentCount: documents.length,
                threshold
            });

            // Fetch existing categories for this workflow
            const existingCategories = await categoryService.getWorkflowCategories(workflowId);
            logger.debug('Fetched existing categories', {
                workflowId,
                categoryCount: existingCategories.length
            });

            const classifications: Classification[] = [];
            let anyRequiresReview = false;

            // Process each document
            for (const document of documents) {
                try {
                    // Use Gemini with existing categories as context
                    let classification = await geminiService.classifyDocument(
                        document.url,
                        document.filename,
                        { existingCategories }
                    );

                    // Check for similar existing category and use it if found
                    const { category, isNew } = await categoryService.getOrCreateCategory(
                        workflowId,
                        classification.label
                    );

                    // Update classification label if we matched to existing category
                    if (!isNew && category.label !== classification.label) {
                        logger.info('Matched to existing similar category', {
                            original: classification.label,
                            matched: category.label
                        });
                        classification = {
                            ...classification,
                            label: category.label
                        };
                    }

                    // Determine if human review is needed
                    const requiresReview = shouldRequireHumanReview(classification.confidence, threshold);
                    if (requiresReview) {
                        anyRequiresReview = true;
                    }

                    // Save classification to database
                    await documentService.saveClassification(
                        workflowId,
                        document.url,
                        document.filename,
                        document.mimeType,
                        classification,
                        requiresReview
                    );

                    classifications.push(classification);

                    if (isNew) {
                        logger.info('Created new category', { category: category.label, workflowId });
                    }
                } catch (docError) {
                    logger.error('Error auto-classifying document', {
                        filename: document.filename,
                        error: docError
                    });

                    // Add failed classification
                    classifications.push({
                        documentUrl: document.url,
                        filename: document.filename,
                        label: 'Classification Failed',
                        confidence: 0,
                        alternatives: [],
                        model: 'gemini'
                    });
                    anyRequiresReview = true;
                }
            }

            const processingTime = Date.now() - startTime;

            // Aggregate total tokens used across all classifications
            const totalTokensUsed = classifications.reduce((sum, c: any) => {
                return sum + (c.tokensUsed?.totalTokens || 0);
            }, 0);

            const response: ClassificationResponse = {
                success: true,
                data: {
                    classifications
                },
                metadata: {
                    processingTime,
                    serviceVersion: process.env.SERVICE_VERSION || '1.0.0',
                    modelUsed: 'gemini',
                    tokensUsed: totalTokensUsed
                },
                requiresHumanReview: anyRequiresReview
            };

            logger.info('Auto-classification completed', {
                workflowId,
                processingTime,
                requiresReview: anyRequiresReview
            });

            res.status(200).json(response);
        } catch (error) {
            logger.error('Error in autoClassify', error);
            throw createError('Failed to process auto-classification request', 500);
        }
    }
}

export const classificationController = new ClassificationController();
