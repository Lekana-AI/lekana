import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

export const addNode = async (req: Request, res: Response) => {
    try {
        const { id: workflowId } = req.params;
        const { actionId, config, positionX, positionY } = req.body;

        if (!actionId || positionX === undefined || positionY === undefined) {
            return res.status(400).json({ error: 'actionId, positionX, and positionY are required' });
        }

        // Verify action exists
        const action = await prisma.action.findUnique({
            where: { id: actionId }
        });

        if (!action) {
            return res.status(404).json({ error: 'Action not found' });
        }

        const node = await prisma.workflowNode.create({
            data: {
                workflowId,
                actionId,
                config: config || {},
                positionX,
                positionY,
            },
            include: {
                action: true  // Include action config for frontend
            }
        });

        res.status(201).json(node);
    } catch (error) {
        console.error('Error adding node:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
