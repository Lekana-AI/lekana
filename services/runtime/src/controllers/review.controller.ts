/**
 * Review Controller
 * Handles human review workflow endpoints for validators
 */
import { Request, Response } from 'express';
import { PrismaClient, ReviewStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /review/queue
 * Get pending review tasks for the current validator
 * Optionally filter by workflowId
 */
export async function getReviewQueue(req: Request, res: Response): Promise<void> {
    try {
        const userId = req.userId;
        const { workflowId, status } = req.query;

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        // Build filter based on query params
        const where: any = {};

        // Filter by workflow if specified, otherwise show all accessible workflows
        if (workflowId) {
            where.workflowId = workflowId;
        }

        // Filter by status (default to PENDING)
        if (status) {
            where.status = status as ReviewStatus;
        } else {
            where.status = { in: ['PENDING', 'NEEDS_CHANGES'] };
        }

        const tasks = await prisma.reviewTask.findMany({
            where,
            include: {
                workflowExecution: {
                    select: {
                        workflowName: true,
                        createdAt: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        res.json({
            tasks,
            count: tasks.length
        });
    } catch (error) {
        console.error('Error fetching review queue:', error);
        res.status(500).json({ error: 'Failed to fetch review queue' });
    }
}

/**
 * GET /review/:taskId
 * Get a specific review task with all details
 */
export async function getReviewTask(req: Request, res: Response): Promise<void> {
    try {
        const { taskId } = req.params;

        const task = await prisma.reviewTask.findUnique({
            where: { id: taskId },
            include: {
                workflowExecution: {
                    select: {
                        id: true,
                        workflowName: true,
                        workflowId: true,
                        inputData: true,
                        createdAt: true
                    }
                }
            }
        });

        if (!task) {
            res.status(404).json({ error: 'Review task not found' });
            return;
        }

        res.json(task);
    } catch (error) {
        console.error('Error fetching review task:', error);
        res.status(500).json({ error: 'Failed to fetch review task' });
    }
}

/**
 * POST /review/:taskId/claim
 * Claim a review task (assign to current user)
 */
export async function claimReviewTask(req: Request, res: Response): Promise<void> {
    try {
        const { taskId } = req.params;
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        const task = await prisma.reviewTask.findUnique({
            where: { id: taskId }
        });

        if (!task) {
            res.status(404).json({ error: 'Review task not found' });
            return;
        }

        if (task.assignedTo && task.assignedTo !== userId) {
            res.status(409).json({ error: 'Task already claimed by another user' });
            return;
        }

        const updatedTask = await prisma.reviewTask.update({
            where: { id: taskId },
            data: {
                assignedTo: userId,
                status: 'IN_REVIEW'
            }
        });

        res.json(updatedTask);
    } catch (error) {
        console.error('Error claiming review task:', error);
        res.status(500).json({ error: 'Failed to claim review task' });
    }
}

/**
 * POST /review/:taskId/approve
 * Approve a reviewed document with optional corrections
 */
export async function approveReviewTask(req: Request, res: Response): Promise<void> {
    try {
        const { taskId } = req.params;
        const { reviewedData, reviewNotes } = req.body;
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        const task = await prisma.reviewTask.findUnique({
            where: { id: taskId }
        });

        if (!task) {
            res.status(404).json({ error: 'Review task not found' });
            return;
        }

        // Validator must have claimed the task
        if (task.assignedTo !== userId) {
            res.status(403).json({ error: 'You must claim this task before approving' });
            return;
        }

        const updatedTask = await prisma.reviewTask.update({
            where: { id: taskId },
            data: {
                status: 'APPROVED',
                reviewedData: reviewedData || task.originalData,
                reviewNotes,
                reviewedAt: new Date()
            },
            include: {
                workflowExecution: true
            }
        });

        // TODO: Trigger continuation of workflow execution after approval
        // await continueWorkflowExecution(task.workflowExecutionId, task.nodeExecutionId, updatedTask.reviewedData);

        res.json({
            message: 'Review approved successfully',
            task: updatedTask
        });
    } catch (error) {
        console.error('Error approving review task:', error);
        res.status(500).json({ error: 'Failed to approve review task' });
    }
}

/**
 * POST /review/:taskId/reject
 * Reject a document or request changes
 */
export async function rejectReviewTask(req: Request, res: Response): Promise<void> {
    try {
        const { taskId } = req.params;
        const { reviewNotes, needsChanges } = req.body;
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        const task = await prisma.reviewTask.findUnique({
            where: { id: taskId }
        });

        if (!task) {
            res.status(404).json({ error: 'Review task not found' });
            return;
        }

        if (task.assignedTo !== userId) {
            res.status(403).json({ error: 'You must claim this task before rejecting' });
            return;
        }

        if (!reviewNotes) {
            res.status(400).json({ error: 'Review notes are required when rejecting' });
            return;
        }

        const updatedTask = await prisma.reviewTask.update({
            where: { id: taskId },
            data: {
                status: needsChanges ? 'NEEDS_CHANGES' : 'REJECTED',
                reviewNotes,
                reviewedAt: new Date()
            }
        });

        res.json({
            message: needsChanges ? 'Changes requested' : 'Review rejected',
            task: updatedTask
        });
    } catch (error) {
        console.error('Error rejecting review task:', error);
        res.status(500).json({ error: 'Failed to reject review task' });
    }
}

/**
 * POST /review/:taskId/unclaim
 * Release a claimed task back to the queue
 */
export async function unclaimReviewTask(req: Request, res: Response): Promise<void> {
    try {
        const { taskId } = req.params;
        const userId = req.userId;

        const task = await prisma.reviewTask.findUnique({
            where: { id: taskId }
        });

        if (!task) {
            res.status(404).json({ error: 'Review task not found' });
            return;
        }

        if (task.assignedTo !== userId) {
            res.status(403).json({ error: 'You can only unclaim tasks assigned to you' });
            return;
        }

        const updatedTask = await prisma.reviewTask.update({
            where: { id: taskId },
            data: {
                assignedTo: null,
                status: 'PENDING'
            }
        });

        res.json(updatedTask);
    } catch (error) {
        console.error('Error unclaiming review task:', error);
        res.status(500).json({ error: 'Failed to unclaim review task' });
    }
}

/**
 * GET /review/stats
 * Get review statistics for the current user
 */
export async function getReviewStats(req: Request, res: Response): Promise<void> {
    try {
        const userId = req.userId;
        const { workflowId } = req.query;

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        const where: any = {};
        if (workflowId) {
            where.workflowId = workflowId;
        }

        const [pending, inReview, approved, rejected, needsChanges] = await Promise.all([
            prisma.reviewTask.count({ where: { ...where, status: 'PENDING' } }),
            prisma.reviewTask.count({ where: { ...where, status: 'IN_REVIEW' } }),
            prisma.reviewTask.count({ where: { ...where, status: 'APPROVED' } }),
            prisma.reviewTask.count({ where: { ...where, status: 'REJECTED' } }),
            prisma.reviewTask.count({ where: { ...where, status: 'NEEDS_CHANGES' } })
        ]);

        // Count user's completed reviews
        const myApproved = await prisma.reviewTask.count({
            where: { assignedTo: userId, status: 'APPROVED' }
        });

        res.json({
            queue: { pending, inReview, needsChanges },
            completed: { approved, rejected },
            myStats: { approved: myApproved }
        });
    } catch (error) {
        console.error('Error fetching review stats:', error);
        res.status(500).json({ error: 'Failed to fetch review stats' });
    }
}

/**
 * Internal: Create a review task (called by workflow engine)
 */
export async function createReviewTask(
    workflowExecutionId: string,
    nodeExecutionId: string,
    workflowId: string,
    originalData: any
): Promise<string> {
    const task = await prisma.reviewTask.create({
        data: {
            workflowExecutionId,
            nodeExecutionId,
            workflowId,
            originalData,
            status: 'PENDING'
        }
    });

    return task.id;
}
