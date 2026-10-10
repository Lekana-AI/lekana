import { DocumentModel, IDocument } from '../models/document.model';
import { Classification } from '../types';
import { logger } from '../utils/logger.util';

export class DocumentService {
    /**
     * Saves a classified document to the database
     */
    public async saveClassification(
        workflowId: string,
        documentUrl: string,
        filename: string,
        mimeType: string,
        classification: Classification,
        requiresHumanReview: boolean
    ): Promise<IDocument> {
        try {
            const document = new DocumentModel({
                workflowId,
                documentUrl,
                filename,
                mimeType,
                classification,
                requiresHumanReview
            });

            await document.save();
            logger.info('Saved classified document', { workflowId, filename });
            return document;
        } catch (error) {
            logger.error('Error saving classified document', error);
            throw new Error('Failed to save classified document');
        }
    }

    /**
     * Gets all documents for a workflow
     */
    public async getDocumentsByWorkflow(workflowId: string): Promise<IDocument[]> {
        try {
            const documents = await DocumentModel.find({ workflowId })
                .sort({ createdAt: -1 })
                .exec();

            return documents;
        } catch (error) {
            logger.error('Error fetching documents by workflow', error);
            throw new Error('Failed to fetch documents');
        }
    }

    /**
     * Gets documents that require human review
     */
    public async getDocumentsRequiringReview(workflowId: string): Promise<IDocument[]> {
        try {
            const documents = await DocumentModel.find({
                workflowId,
                requiresHumanReview: true
            })
                .sort({ createdAt: -1 })
                .exec();

            return documents;
        } catch (error) {
            logger.error('Error fetching documents requiring review', error);
            throw new Error('Failed to fetch documents requiring review');
        }
    }

    /**
     * Gets document statistics for a workflow
     */
    public async getWorkflowStats(workflowId: string): Promise<{
        totalDocuments: number;
        requiresReview: number;
        byCategory: Record<string, number>;
    }> {
        try {
            const documents = await this.getDocumentsByWorkflow(workflowId);

            const stats = {
                totalDocuments: documents.length,
                requiresReview: documents.filter(d => d.requiresHumanReview).length,
                byCategory: {} as Record<string, number>
            };

            // Count by category
            documents.forEach(doc => {
                const label = doc.classification.label;
                stats.byCategory[label] = (stats.byCategory[label] || 0) + 1;
            });

            return stats;
        } catch (error) {
            logger.error('Error getting workflow stats', error);
            throw new Error('Failed to get workflow statistics');
        }
    }
}

export const documentService = new DocumentService();
