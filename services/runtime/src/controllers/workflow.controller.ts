/**
 * Workflow Controller
 * Handles publishing and running workflows
 */

import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { generateApiKey } from '../middleware/apikey.middleware';
import { executeWorkflowWithInput } from '../services/engine.service';

const prisma = new PrismaClient();

// Type for workflow fetched from workflow-builder
interface WorkflowData {
    id: string;
    name: string;
    nodes: any[];
    edges: any[];
    extractedFields?: string[];
    [key: string]: any;
}

/**
 * POST /api/v1/publish
 * Publish a workflow - fetches from workflow-builder and stores definition with API key
 */
export const publishWorkflow = async (req: Request, res: Response) => {
    try {
        const { workflowId } = req.body;
        const userId = req.auth?.sub;
        const authHeader = req.headers.authorization;

        // Validate required fields
        if (!workflowId) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'workflowId is required'
            });
        }

        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User ID not found in token'
            });
        }

        if (!authHeader) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authorization header is required'
            });
        }

        // Fetch workflow from workflow-builder with JWT passthrough
        const workflowApiUrl = process.env.WORKFLOW_API || 'http://localhost:3001';
        console.log(`[Publish] Fetching workflow ${workflowId} from ${workflowApiUrl}`);

        const response = await fetch(`${workflowApiUrl}/workflows/${workflowId}`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader, // Forward user's JWT token
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})) as { error?: string };
            console.error(`[Publish] Failed to fetch workflow: ${response.status}`, errorData);
            return res.status(response.status).json({
                error: 'Failed to fetch workflow',
                message: errorData.error || `Workflow not found or access denied (${response.status})`
            });
        }

        const workflow = await response.json() as WorkflowData;
        console.log(`[Publish] Publishing workflow: ${workflow.name} (${workflow.id}) for user ${userId}`);

        // Check if workflow already published
        const existingPublished = await prisma.publishedWorkflow.findUnique({
            where: { workflowId: workflow.id },
            include: { apiKeys: true }
        });

        if (existingPublished) {
            // Update existing published workflow
            const updated = await prisma.publishedWorkflow.update({
                where: { id: existingPublished.id },
                data: {
                    name: workflow.name,
                    definition: workflow as Prisma.InputJsonValue,
                    isActive: true
                },
                include: { apiKeys: { where: { isActive: true } } }
            });

            return res.json({
                success: true,
                message: 'Workflow updated',
                publishedWorkflowId: updated.id,
                workflowId: workflow.id,
                workflowName: workflow.name,
                extractedFields: workflow.extractedFields || [],
                apiKeys: updated.apiKeys.map(k => ({
                    id: k.id,
                    name: k.name,
                    prefix: k.keyPrefix,
                    createdAt: k.createdAt
                })),
                note: 'Use existing API keys or create a new one'
            });
        }

        // Create new published workflow
        const { key, hash, prefix } = generateApiKey();

        const published = await prisma.publishedWorkflow.create({
            data: {
                workflowId: workflow.id,
                userId,
                name: workflow.name,
                definition: workflow as Prisma.InputJsonValue,
                apiKeys: {
                    create: {
                        key: hash,
                        keyPrefix: prefix,
                        name: 'Default'
                    }
                }
            },
            include: { apiKeys: true }
        });

        res.status(201).json({
            success: true,
            message: 'Workflow published successfully',
            publishedWorkflowId: published.id,
            workflowId: workflow.id,
            workflowName: workflow.name,
            extractedFields: workflow.extractedFields || [],
            apiKey: {
                key, // Only returned on creation - user must save this!
                name: 'Default',
                prefix,
                warning: 'Save this API key! It will not be shown again.'
            },
            runEndpoint: `/api/v1/workflows/${workflow.id}/run`
        });

    } catch (error: any) {
        console.error('Error publishing workflow:', error);
        res.status(500).json({
            error: 'Failed to publish workflow',
            message: error.message
        });
    }
};

/**
 * POST /api/v1/workflows/:workflowId/run
 * Run a published workflow with input data (API key auth)
 */
export const runWorkflow = async (req: Request, res: Response) => {
    try {
        const { workflowId } = req.params;
        const { input, documents } = req.body;
        const apiKeyInfo = req.apiKey!;

        // Verify the API key is for this workflow
        if (apiKeyInfo.publishedWorkflow.workflowId !== workflowId) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'API key is not valid for this workflow'
            });
        }

        console.log(`Running workflow: ${apiKeyInfo.publishedWorkflow.name} (${workflowId})`);
        console.log(`Input received:`, { hasInput: !!input, hasDocuments: !!documents });

        // Get the workflow definition
        const workflowDefinition = apiKeyInfo.publishedWorkflow.definition;

        // Execute the workflow with provided input
        const executionId = await executeWorkflowWithInput(
            workflowDefinition,
            apiKeyInfo.publishedWorkflow.userId,
            apiKeyInfo.publishedWorkflowId,
            { input, documents }
        );

        res.status(202).json({
            success: true,
            message: 'Workflow execution started',
            executionId,
            workflowId,
            workflowName: apiKeyInfo.publishedWorkflow.name,
            statusEndpoint: `/api/v1/executions/${executionId}`
        });

    } catch (error: any) {
        console.error('Error running workflow:', error);
        res.status(500).json({
            error: 'Failed to run workflow',
            message: error.message
        });
    }
};

/**
 * GET /api/v1/workflows/:workflowId/keys
 * List API keys for a workflow (JWT auth)
 */
export const listApiKeys = async (req: Request, res: Response) => {
    try {
        const { workflowId } = req.params;
        const userId = req.auth?.sub;

        const published = await prisma.publishedWorkflow.findFirst({
            where: { workflowId, userId },
            include: {
                apiKeys: {
                    select: {
                        id: true,
                        keyPrefix: true,
                        name: true,
                        isActive: true,
                        lastUsedAt: true,
                        createdAt: true,
                        expiresAt: true
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!published) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Workflow not found or not published'
            });
        }

        res.json({
            workflowId,
            workflowName: published.name,
            apiKeys: published.apiKeys
        });

    } catch (error: any) {
        console.error('Error listing API keys:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * POST /api/v1/workflows/:workflowId/keys
 * Create a new API key for a workflow (JWT auth)
 */
export const createApiKey = async (req: Request, res: Response) => {
    try {
        const { workflowId } = req.params;
        const { name, expiresAt } = req.body;
        const userId = req.auth?.sub;

        const published = await prisma.publishedWorkflow.findFirst({
            where: { workflowId, userId }
        });

        if (!published) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Workflow not found or not published'
            });
        }

        const { key, hash, prefix } = generateApiKey();

        const apiKey = await prisma.apiKey.create({
            data: {
                key: hash,
                keyPrefix: prefix,
                name: name || 'API Key',
                publishedWorkflowId: published.id,
                expiresAt: expiresAt ? new Date(expiresAt) : null
            }
        });

        res.status(201).json({
            success: true,
            apiKey: {
                id: apiKey.id,
                key, // Only returned on creation!
                name: apiKey.name,
                prefix,
                expiresAt: apiKey.expiresAt,
                warning: 'Save this API key! It will not be shown again.'
            }
        });

    } catch (error: any) {
        console.error('Error creating API key:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * DELETE /api/v1/workflows/:workflowId/keys/:keyId
 * Revoke an API key (JWT auth)
 */
export const revokeApiKey = async (req: Request, res: Response) => {
    try {
        const { workflowId, keyId } = req.params;
        const userId = req.auth?.sub;

        // Verify ownership
        const published = await prisma.publishedWorkflow.findFirst({
            where: { workflowId, userId },
            include: { apiKeys: { where: { id: keyId } } }
        });

        if (!published || published.apiKeys.length === 0) {
            return res.status(404).json({
                error: 'Not found',
                message: 'API key not found'
            });
        }

        await prisma.apiKey.update({
            where: { id: keyId },
            data: { isActive: false }
        });

        res.json({
            success: true,
            message: 'API key revoked'
        });

    } catch (error: any) {
        console.error('Error revoking API key:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/v1/workflows/:workflowId
 * Get published workflow info (JWT auth)
 */
export const getPublishedWorkflow = async (req: Request, res: Response) => {
    try {
        const { workflowId } = req.params;
        const userId = req.auth?.sub;

        const published = await prisma.publishedWorkflow.findFirst({
            where: { workflowId, userId },
            include: {
                _count: { select: { apiKeys: true, executions: true } }
            }
        });

        if (!published) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Workflow not found or not published'
            });
        }

        res.json({
            id: published.id,
            workflowId: published.workflowId,
            name: published.name,
            isActive: published.isActive,
            publishedAt: published.publishedAt,
            updatedAt: published.updatedAt,
            apiKeyCount: published._count.apiKeys,
            executionCount: published._count.executions,
            runEndpoint: `/api/v1/workflows/${workflowId}/run`
        });

    } catch (error: any) {
        console.error('Error getting workflow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
