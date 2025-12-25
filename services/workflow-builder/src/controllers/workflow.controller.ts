import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

export const createWorkflow = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        // Get userId and email from custom Clerk JWT claims
        const userId = req.auth?.userId;
        const userEmail = req.auth?.email;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        if (!userId) {
            return res.status(401).json({ error: 'User ID not found in token' });
        }

        if (!userEmail) {
            return res.status(401).json({ error: 'User email not found in token' });
        }

        // Ensure user exists in local DB (sync with Auth provider)
        await prisma.user.upsert({
            where: { id: userId },
            update: { email: userEmail }, // Update email if it changed
            create: {
                id: userId,
                email: userEmail
            }
        });

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
        const userId = req.auth?.userId; // From Clerk JWT claims

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

        // Query extracted fields from WorkflowField table
        // Using $queryRaw until Prisma client is regenerated
        const workflowFields = await prisma.$queryRaw<{ fieldName: string }[]>`
            SELECT DISTINCT "fieldName" FROM "WorkflowField" WHERE "workflowId" = ${id}
        `;

        // Extract field names
        const extractedFields = workflowFields.map(f => f.fieldName);

        res.json({
            ...workflow,
            extractedFields
        });
    } catch (error) {
        console.error('Error fetching workflow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllWorkflows = async (req: Request, res: Response) => {
    try {
        const userId = req.auth?.userId; // From Clerk JWT claims

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

        // Return workflows with counts and publish status
        const workflowsWithCounts = workflows.map(workflow => ({
            id: workflow.id,
            name: workflow.name,
            createdAt: workflow.createdAt,
            updatedAt: workflow.updatedAt,
            nodeCount: workflow.nodes.length,
            edgeCount: workflow.edges.length,
            // Publish status
            isPublished: (workflow as any).isPublished || false,
            publishedAt: (workflow as any).publishedAt || null,
            lastPublishedAt: (workflow as any).lastPublishedAt || null,
        }));

        res.json(workflowsWithCounts);
    } catch (error) {
        console.error('Error fetching workflows:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Update an existing workflow
 */
export const updateWorkflow = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'User ID not found in token' });
        }

        // Check if workflow exists and belongs to user
        const existingWorkflow = await prisma.workflow.findFirst({
            where: {
                id,
                userId
            }
        });

        if (!existingWorkflow) {
            return res.status(404).json({ error: 'Workflow not found' });
        }

        // Validate name if provided
        if (name !== undefined && (!name || typeof name !== 'string' || name.trim() === '')) {
            return res.status(400).json({ error: 'Name must be a non-empty string' });
        }

        const updatedWorkflow = await prisma.workflow.update({
            where: { id },
            data: {
                ...(name && { name: name.trim() })
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

        res.json(updatedWorkflow);
    } catch (error) {
        console.error('Error updating workflow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Delete a workflow
 */
export const deleteWorkflow = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'User ID not found in token' });
        }

        // Check if workflow exists and belongs to user
        const existingWorkflow = await prisma.workflow.findFirst({
            where: {
                id,
                userId
            }
        });

        if (!existingWorkflow) {
            return res.status(404).json({ error: 'Workflow not found' });
        }

        // Delete workflow (nodes and edges will cascade delete due to schema config)
        await prisma.workflow.delete({
            where: { id }
        });

        res.status(200).json({ message: 'Workflow deleted successfully' });
    } catch (error) {
        console.error('Error deleting workflow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Update publish status (called by runtime after publishing)
 * PATCH /workflows/:id/publish-status
 */
export const updatePublishStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { publishedWorkflowId, isPublished = true } = req.body;
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'User ID not found in token' });
        }

        // Check if workflow exists and belongs to user
        const existingWorkflow = await prisma.workflow.findFirst({
            where: {
                id,
                userId
            }
        });

        if (!existingWorkflow) {
            return res.status(404).json({ error: 'Workflow not found' });
        }

        const now = new Date();
        const updateData: any = {
            isPublished,
            publishedWorkflowId,
            lastPublishedAt: now
        };

        // Set publishedAt only on first publish
        if (!existingWorkflow.publishedAt && isPublished) {
            updateData.publishedAt = now;
        }

        const updatedWorkflow = await prisma.workflow.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                isPublished: true,
                publishedWorkflowId: true,
                publishedAt: true,
                lastPublishedAt: true
            }
        });

        console.log(`[Publish Status] Updated workflow ${id}: isPublished=${isPublished}`);

        res.json({
            success: true,
            workflow: updatedWorkflow
        });
    } catch (error) {
        console.error('Error updating publish status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
