import { Request, Response } from 'express';
import prisma from '../lib/prisma';

/**
 * Get all fields available in a workflow
 * Returns fields from all nodes that produce output fields (like OCR)
 */
export const getWorkflowFields = async (req: Request, res: Response) => {
    try {
        const { id: workflowId } = req.params;

        const fields = await prisma.workflowField.findMany({
            where: {
                workflowId,
                sourceNode: {
                    isDeleted: false
                }
            },
            include: {
                sourceNode: {
                    include: {
                        action: true
                    }
                }
            },
            orderBy: [
                { sourceNodeId: 'asc' },
                { fieldName: 'asc' }
            ]
        });

        // Transform to a more usable format
        const result = fields.map(field => ({
            id: field.id,
            fieldName: field.fieldName,
            fieldPath: field.fieldPath,
            fieldType: field.fieldType,
            sourceNode: {
                id: field.sourceNode.id,
                stepName: (field.sourceNode.config as any)?.stepName || field.sourceNode.action.name,
                actionName: field.sourceNode.action.name
            }
        }));

        res.json({
            workflowId,
            fields: result,
            count: result.length
        });
    } catch (error) {
        console.error('Error fetching workflow fields:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Delete a specific field (manual cleanup)
 */
export const deleteWorkflowField = async (req: Request, res: Response) => {
    try {
        const { id: workflowId, fieldId } = req.params;

        const field = await prisma.workflowField.findFirst({
            where: {
                id: fieldId,
                workflowId
            }
        });

        if (!field) {
            return res.status(404).json({ error: 'Field not found' });
        }

        await prisma.workflowField.delete({
            where: { id: fieldId }
        });

        res.json({ message: 'Field deleted successfully' });
    } catch (error) {
        console.error('Error deleting field:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
