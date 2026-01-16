import { Request, Response } from 'express';
import prisma from '../lib/prisma';

/**
 * Submit feedback
 */
export const createFeedback = async (req: Request, res: Response) => {
    try {
        const { comment, workflowId } = req.body;
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'User ID not found in token' });
        }

        if (!comment || typeof comment !== 'string' || comment.trim() === '') {
            return res.status(400).json({ error: 'Comment is required' });
        }

        // Ensure user exists in local DB (sync with Auth provider)
        await prisma.user.upsert({
            where: { id: userId },
            update: {}, // Nothing to update
            create: {
                id: userId
            }
        });

        // Create feedback record
        const feedback = await prisma.feedback.create({
            data: {
                userId,
                comment,
                workflowId: workflowId || null
            }
        });

        res.status(201).json(feedback);
    } catch (error) {
        console.error('Error creating feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
