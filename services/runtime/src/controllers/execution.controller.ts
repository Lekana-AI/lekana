/**
 * Execution Controller
 * Handles execution status and logs endpoints
 * Now with workflow-based access control
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Check if user owns or has access to a published workflow
 */
async function canAccessWorkflow(userId: string, workflowId: string): Promise<boolean> {
    const published = await prisma.publishedWorkflow.findFirst({
        where: { workflowId, userId }
    });
    return !!published;
}

/**
 * Sanitize execution output to remove Cloud Run URLs
 * Recursively walks through objects/arrays and redacts *.run.app URLs
 */
function sanitizeExecutionOutput(data: any): any {
    if (data === null || data === undefined) {
        return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
        return data.map(item => sanitizeExecutionOutput(item));
    }

    // Handle objects
    if (typeof data === 'object') {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(data)) {
            // Redact serviceUrl fields completely
            if (key === 'serviceUrl' && typeof value === 'string' && value.includes('.run.app')) {
                sanitized[key] = '[REDACTED]';
            }
            // Recursively sanitize nested objects
            else if (typeof value === 'object') {
                sanitized[key] = sanitizeExecutionOutput(value);
            }
            // Redact Cloud Run URLs in string values
            else if (typeof value === 'string' && value.includes('.run.app')) {
                // Replace the full URL with [REDACTED]
                sanitized[key] = value.replace(/https?:\/\/[a-z0-9-]+\.run\.app[^\s]*/gi, '[REDACTED]');
            }
            else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }

    // Redact Cloud Run URLs in string primitives
    if (typeof data === 'string' && data.includes('.run.app')) {
        return data.replace(/https?:\/\/[a-z0-9-]+\.run\.app[^\s]*/gi, '[REDACTED]');
    }

    return data;
}

/**
 * GET /api/v1/executions
 * List user's workflow executions (filtered by user's owned workflows)
 */
export const getExecutions = async (req: Request, res: Response) => {
    try {
        const userId = req.auth?.sub;

        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User ID not found in token'
            });
        }

        const { workflowId, limit = 50, offset = 0 } = req.query;

        // Build where clause - always filter by userId
        const where: any = { userId };

        // If workflowId provided, validate access and filter by it
        if (workflowId) {
            const hasAccess = await canAccessWorkflow(userId, workflowId as string);
            if (!hasAccess) {
                return res.status(403).json({
                    error: 'Forbidden',
                    message: 'You do not have access to this workflow'
                });
            }
            where.workflowId = workflowId;
        }

        const [executions, total] = await Promise.all([
            prisma.workflowExecution.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: Number(limit),
                skip: Number(offset),
                select: {
                    id: true,
                    workflowId: true,
                    workflowName: true,
                    status: true,
                    startedAt: true,
                    completedAt: true,
                    createdAt: true,
                    _count: {
                        select: { nodeExecutions: true }
                    }
                }
            }),
            prisma.workflowExecution.count({ where })
        ]);

        res.json({
            executions,
            pagination: {
                total,
                limit: Number(limit),
                offset: Number(offset),
                hasMore: Number(offset) + executions.length < total
            }
        });

    } catch (error: any) {
        console.error('Error fetching executions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/v1/workflows/:workflowId/executions
 * List executions for a specific workflow (with access control)
 */
export const getWorkflowExecutions = async (req: Request, res: Response) => {
    try {
        const userId = req.auth?.sub;
        const { workflowId } = req.params;
        const { limit = 50, offset = 0 } = req.query;

        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User ID not found in token'
            });
        }

        // Validate workflow access
        const hasAccess = await canAccessWorkflow(userId, workflowId);
        if (!hasAccess) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You do not have access to this workflow'
            });
        }

        const where = { workflowId };

        const [executions, total] = await Promise.all([
            prisma.workflowExecution.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: Number(limit),
                skip: Number(offset),
                select: {
                    id: true,
                    workflowId: true,
                    workflowName: true,
                    status: true,
                    startedAt: true,
                    completedAt: true,
                    createdAt: true,
                    _count: {
                        select: { nodeExecutions: true }
                    }
                }
            }),
            prisma.workflowExecution.count({ where })
        ]);

        res.json(executions);

    } catch (error: any) {
        console.error('Error fetching workflow executions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/v1/executions/:id
 * Get execution details with node statuses
 */
export const getExecution = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.auth?.sub;

        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User ID not found in token'
            });
        }

        const execution = await prisma.workflowExecution.findFirst({
            where: { id, userId },
            include: {
                nodeExecutions: {
                    orderBy: { executionOrder: 'asc' },
                    select: {
                        id: true,
                        nodeId: true,
                        actionName: true,
                        stepName: true,
                        executionOrder: true,
                        status: true,
                        input: true,
                        output: true,
                        error: true,
                        startedAt: true,
                        completedAt: true
                    }
                }
            }
        });

        if (!execution) {
            return res.status(404).json({ error: 'Execution not found' });
        }

        // Sanitize output to remove Cloud Run URLs before sending to client
        const sanitizedExecution = sanitizeExecutionOutput(execution);

        res.json(sanitizedExecution);

    } catch (error: any) {
        console.error('Error fetching execution:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/v1/executions/:id/logs
 * Get execution logs
 */
export const getExecutionLogs = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.auth?.sub;

        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User ID not found in token'
            });
        }

        // Verify user owns this execution
        const execution = await prisma.workflowExecution.findFirst({
            where: { id, userId },
            select: { id: true }
        });

        if (!execution) {
            return res.status(404).json({ error: 'Execution not found' });
        }

        const logs = await prisma.executionLog.findMany({
            where: { workflowExecutionId: id },
            orderBy: { timestamp: 'asc' },
            select: {
                id: true,
                level: true,
                message: true,
                metadata: true,
                timestamp: true,
                nodeExecutionId: true
            }
        });

        // Sanitize logs to remove Cloud Run URLs before sending to client
        const sanitizedLogs = sanitizeExecutionOutput(logs);

        res.json(sanitizedLogs);

    } catch (error: any) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
