import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

export const addEdge = async (req: Request, res: Response) => {
    try {
        const { id: workflowId } = req.params;
        const { sourceNodeId, targetNodeId } = req.body;

        if (!sourceNodeId || !targetNodeId) {
            return res.status(400).json({ error: 'sourceNodeId and targetNodeId are required' });
        }

        // Fetch both nodes with their actions to validate type compatibility
        const sourceNode = await prisma.workflowNode.findUnique({
            where: { id: sourceNodeId },
            include: { action: true }
        });

        const targetNode = await prisma.workflowNode.findUnique({
            where: { id: targetNodeId },
            include: { action: true }
        });

        if (!sourceNode) {
            return res.status(404).json({ error: 'Source node not found' });
        }

        if (!targetNode) {
            return res.status(404).json({ error: 'Target node not found' });
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
