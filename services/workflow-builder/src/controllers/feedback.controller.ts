import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { sendFeedbackAcknowledgmentEmail, sendInternalFeedbackNotification } from '../utils/emailService';

/**
 * Submit feedback
 */
export const createFeedback = async (req: Request, res: Response) => {
    try {
        const {
            comment,
            workflowId,
            executionId,
            nodeExecutionId,
            errorDetails
        } = req.body;
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'User ID not found in token' });
        }

        const hasComment = comment && typeof comment === 'string' && comment.trim() !== '';
        const hasErrorDetails = errorDetails && typeof errorDetails === 'string' && errorDetails.trim() !== '';

        if (!hasComment && !hasErrorDetails) {
            return res.status(400).json({ error: 'Either comment or errorDetails is required' });
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
                comment: comment?.trim(),
                workflowId: workflowId || null,
                executionId,
                nodeExecutionId: nodeExecutionId || null,
                errorDetails: errorDetails || null
            }
        });

        // Get user email for notifications
        let userEmail = req.auth?.email;

        // Send email notifications asynchronously
        if (userEmail) {
            sendFeedbackAcknowledgmentEmail(userEmail).catch(err =>
                console.error('Failed to send user feedback email:', err)
            );
        }

        sendInternalFeedbackNotification(feedback, userEmail).catch(err =>
            console.error('Failed to send internal feedback email:', err)
        );

        res.status(201).json(feedback);
    } catch (error) {
        console.error('Error creating feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
