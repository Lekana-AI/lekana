/**
 * Workflow Controller
 * Handles publishing and running workflows
 */

import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { generateApiKey } from '../middleware/apikey.middleware';
import { executeWorkflowWithInput } from '../services/engine.service';
import { getActionByName } from '../services/action-lookup.service';

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
 * Sync publish status back to workflow-builder
 * Non-blocking - errors are logged but don't fail the publish
 */
async function syncPublishStatus(
    workflowId: string,
    publishedWorkflowId: string,
    authHeader: string
): Promise<void> {
    try {
        const workflowApiUrl = process.env.WORKFLOW_API || 'http://localhost:3001';
        const response = await fetch(`${workflowApiUrl}/workflows/${workflowId}/publish-status`, {
            method: 'PATCH',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                publishedWorkflowId,
                isPublished: true
            })
        });

        if (response.ok) {
            console.log(`[Publish] Synced publish status to workflow-builder for ${workflowId}`);
        } else {
            console.warn(`[Publish] Failed to sync publish status: ${response.status}`);
        }
    } catch (error) {
        console.error('[Publish] Error syncing publish status:', error);
    }
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

            // Sync publish status to workflow-builder (non-blocking)
            syncPublishStatus(workflow.id, updated.id, authHeader);

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

        // Sync publish status to workflow-builder (non-blocking)
        syncPublishStatus(workflow.id, published.id, authHeader);

        res.status(201).json({
            success: true,
            message: 'Workflow published successfully',
            publishedWorkflowId: published.id,
            workflowId: workflow.id,
            workflowName: workflow.name,
            extractedFields: workflow.extractedFields || [],
            apiKeys: [{
                key, // Only returned on creation - user must save this!
                name: 'Default',
                prefix,
                warning: 'Save this API key! It will not be shown again.'
            }],
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

/**
 * POST /api/v1/workflows/:workflowId/run-with-files
 * Run a published workflow with file uploads (API key auth)
 * Files are uploaded to the Upload microservice and URLs are passed to the workflow
 */
export const runWorkflowWithFiles = async (req: Request, res: Response) => {
    try {
        const { workflowId } = req.params;
        const apiKeyInfo = req.apiKey!;
        const files = req.files as Express.Multer.File[];

        // Verify the API key is for this workflow
        if (apiKeyInfo.publishedWorkflow.workflowId !== workflowId) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'API key is not valid for this workflow'
            });
        }

        console.log(`[Run] Running workflow with files: ${apiKeyInfo.publishedWorkflow.name} (${workflowId})`);
        console.log(`[Run] Files received: ${files?.length || 0}`);

        // Parse JSON input from form data
        let input: any = {};
        if (req.body.input) {
            try {
                input = typeof req.body.input === 'string' ? JSON.parse(req.body.input) : req.body.input;
            } catch {
                input = req.body.input;
            }
        }

        // Upload files to Upload service and collect URLs
        const documents: { url: string; filename: string; mimeType: string }[] = [];

        if (files && files.length > 0) {
            // Get Upload service URL from workflow-builder database
            let uploadServiceUrl = 'http://localhost:4001'; // fallback

            try {
                const uploadAction = await getActionByName('Upload files');
                if (uploadAction?.serviceUrl) {
                    uploadServiceUrl = uploadAction.serviceUrl;
                    console.log(`[Run] Using Upload service from DB: ${uploadServiceUrl}`);
                } else {
                    console.warn(`[Run] Upload action not found in DB, using fallback: ${uploadServiceUrl}`);
                }
            } catch (err) {
                console.error(`[Run] Error looking up Upload action:`, err);
            }

            for (const file of files) {
                try {
                    console.log(`[Run] Uploading file: ${file.originalname} (${file.mimetype})`);

                    // Create form data for upload service using form-data package
                    const FormData = require('form-data');
                    const axios = require('axios');
                    const { GoogleAuth } = require('google-auth-library');

                    const formData = new FormData();
                    formData.append('files', file.buffer, {
                        filename: file.originalname,
                        contentType: file.mimetype
                    });

                    // Get headers including form-data headers
                    const headers: Record<string, string> = {
                        ...formData.getHeaders()
                    };

                    // Add IAM token for Cloud Run URLs
                    if (uploadServiceUrl.includes('.run.app')) {
                        try {
                            console.log(`[Run] Getting IAM token for ${uploadServiceUrl}`);
                            const auth = new GoogleAuth();
                            const url = new URL(uploadServiceUrl);
                            const audience = `${url.protocol}//${url.host}`;
                            const client = await auth.getIdTokenClient(audience);
                            const authHeaders = await client.getRequestHeaders(audience);
                            if (authHeaders.Authorization) {
                                headers['Authorization'] = authHeaders.Authorization;
                                console.log(`[Run] IAM token added for upload`);
                            } else if (client.credentials?.id_token) {
                                headers['Authorization'] = `Bearer ${client.credentials.id_token}`;
                                console.log(`[Run] IAM token (from credentials) added for upload`);
                            }
                        } catch (authError: any) {
                            console.error(`[Run] Failed to get IAM token for upload:`, authError.message);
                        }
                    }

                    // Use axios instead of fetch - it properly handles form-data streams
                    const uploadResponse = await axios.post(
                        `${uploadServiceUrl}/api/v1/upload`,
                        formData,
                        {
                            headers,
                            maxContentLength: Infinity,
                            maxBodyLength: Infinity
                        }
                    );

                    const uploadResult = uploadResponse.data as {
                        success: boolean;
                        documents?: Array<{ url: string; filename: string; mimeType: string }>;
                        data?: { uploadedFiles?: Array<{ url: string; filename: string; mimeType: string }> };
                    };

                    // Get the first uploaded file from documents array or data.uploadedFiles
                    const uploadedFile = uploadResult.documents?.[0] || uploadResult.data?.uploadedFiles?.[0];

                    if (uploadResult.success && uploadedFile) {
                        documents.push({
                            url: uploadedFile.url,
                            filename: uploadedFile.filename || file.originalname,
                            mimeType: uploadedFile.mimeType || file.mimetype
                        });
                        console.log(`[Run] File uploaded successfully: ${uploadedFile.url}`);
                    } else {
                        console.error(`[Run] Upload succeeded but no file data returned`);
                    }
                } catch (uploadError: any) {
                    console.error(`[Run] Error uploading file ${file.originalname}:`, uploadError.message);

                    return res.status(500).json({
                        error: 'Upload failed',
                        message: `Failed to upload file: ${file.originalname}`,
                        details: uploadError.message
                    });
                }
            }
        }

        // Get the workflow definition
        const workflowDefinition = apiKeyInfo.publishedWorkflow.definition;

        // Execute the workflow with provided input and uploaded documents
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
            filesUploaded: documents.length,
            documents: documents.map(d => ({ filename: d.filename, mimeType: d.mimeType })),
            statusEndpoint: `/api/v1/executions/${executionId}`
        });

    } catch (error: any) {
        console.error('Error running workflow with files:', error);
        res.status(500).json({
            error: 'Failed to run workflow',
            message: error.message
        });
    }
};
