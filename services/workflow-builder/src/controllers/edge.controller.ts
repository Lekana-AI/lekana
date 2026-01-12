import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const addEdge = async (req: Request, res: Response) => {
    try {
        const { id: workflowId } = req.params;
        const { sourceNodeId, targetNodeId } = req.body;

        if (!sourceNodeId || !targetNodeId) {
            return res.status(400).json({ error: 'sourceNodeId and targetNodeId are required' });
        }

        // Fetch both nodes with their actions to validate type compatibility
        const sourceNode = await prisma.workflowNode.findFirst({
            where: {
                id: sourceNodeId,
                isDeleted: false
            },
            include: { action: true }
        });

        const targetNode = await prisma.workflowNode.findFirst({
            where: {
                id: targetNodeId,
                isDeleted: false
            },
            include: { action: true }
        });

        if (!sourceNode) {
            return res.status(404).json({ error: 'Source node not found or deleted' });
        }

        if (!targetNode) {
            return res.status(404).json({ error: 'Target node not found or deleted' });
        }

        // Validate type compatibility
        const sourceOutputType = sourceNode.action.outputType;
        const targetInputType = targetNode.action.inputType;

        // Allow connection if:
        // 1. Target accepts 'any' input type
        // 2. Target has no input requirement (null)
        // 3. Source output matches target input exactly
        if (targetInputType !== null && targetInputType !== 'any' && sourceOutputType !== targetInputType) {
            return res.status(400).json({
                error: 'Incompatible node types',
                message: `Cannot connect: source outputs "${sourceOutputType}" but target expects "${targetInputType}"`,
                sourceNode: {
                    id: sourceNode.id,
                    action: sourceNode.action.name,
                    outputType: sourceOutputType
                },
                targetNode: {
                    id: targetNode.id,
                    action: targetNode.action.name,
                    inputType: targetInputType
                }
            });
        }

        const edge = await prisma.workflowEdge.create({
            data: {
                workflowId,
                sourceNodeId,
                targetNodeId,
            },
        });

        res.status(201).json(edge);
    } catch (error) {
        console.error('Error adding edge:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Delete an edge (soft delete)
 */
export const deleteEdge = async (req: Request, res: Response) => {
    try {
        const { id: workflowId, edgeId } = req.params;

        // Check if edge exists and belongs to workflow
        const existingEdge = await prisma.workflowEdge.findFirst({
            where: {
                id: edgeId,
                workflowId,
                isDeleted: false
            }
        });

        if (!existingEdge) {
            return res.status(404).json({ error: 'Edge not found' });
        }

        // Soft delete edge
        await prisma.workflowEdge.update({
            where: { id: edgeId },
            data: { isDeleted: true }
        });

        res.status(200).json({ message: 'Edge deleted successfully' });
    } catch (error) {
        console.error('Error deleting edge:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
