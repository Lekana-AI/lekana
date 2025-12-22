/**
 * Execution Controller
 * Handles execution status and logs endpoints
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/v1/executions
 * List user's workflow executions
 */
export const getExecutions = async (req: Request, res: Response) => {
    try {
        const userId = req.auth?.sub;

        const executions = await prisma.workflowExecution.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
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
        });

        res.json(executions);

    } catch (error: any) {
        console.error('Error fetching executions:', error);
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

        res.json(execution);

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

        res.json(logs);

    } catch (error: any) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
