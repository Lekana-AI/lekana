import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

export const createWorkflow = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const userId = req.userId; // From auth middleware

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        if (!userId) {
            return res.status(401).json({ error: 'User ID not found in request' });
        }

        const workflow = await prisma.workflow.create({
            data: {
                name,
                userId,
            },
        });

        res.status(201).json(workflow);
    } catch (error) {
        console.error('Error creating workflow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getWorkflow = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId; // From auth middleware

        const workflow = await prisma.workflow.findFirst({
            where: {
                id,
                userId // Ensure user owns the workflow
            },
            include: {
                nodes: {
                    include: {
                        action: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                edges: true,
            },
        });

        if (!workflow) {
            return res.status(404).json({ error: 'Workflow not found' });
        }

        res.json(workflow);
    } catch (error) {
        console.error('Error fetching workflow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllWorkflows = async (req: Request, res: Response) => {
    try {
        const userId = req.userId; // From auth middleware

        const workflows = await prisma.workflow.findMany({
            where: {
                userId // Filter by user's workflows only
            },
            include: {
                nodes: true,
                edges: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        // Return workflows with counts
        const workflowsWithCounts = workflows.map(workflow => ({
            id: workflow.id,
            name: workflow.name,
            createdAt: workflow.createdAt,
            updatedAt: workflow.updatedAt,
            nodeCount: workflow.nodes.length,
            edgeCount: workflow.edges.length,
        }));

        res.json(workflowsWithCounts);
    } catch (error) {
        console.error('Error fetching workflows:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
