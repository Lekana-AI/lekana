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
