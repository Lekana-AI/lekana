/**
 * Workflow Controller
 * Handles publishing and running workflows
 */

import { Request, Response } from 'express';
// Add BigInt serialization support for JSON.stringify
// This prevents "Do not know how to serialize a BigInt" errors
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

import { PrismaClient, Prisma } from '@prisma/client';
import { generateApiKey } from '../middleware/apikey.middleware';
import { executeWorkflowWithInput } from '../services/engine.service';
import { getActionByName } from '../services/action-lookup.service';
import { validateWorkflowNodes, formatValidationErrors, validateDatabaseConnections, formatConnectionErrors } from '../services/validation.service';
import { checkStorageLimit, incrementStorageUsage, checkTokenLimit } from '../services/usage.service';

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

        // Validate workflow nodes before publishing
        if (workflow.nodes && workflow.nodes.length > 0) {
            const validationResult = validateWorkflowNodes(workflow.nodes);
            if (!validationResult.valid) {
                console.log(`[Publish] Validation failed for workflow ${workflow.id}:`, validationResult.errors);
                return res.status(400).json({
                    error: 'Workflow validation failed',
                    message: formatValidationErrors(validationResult.errors),
                    validationErrors: validationResult.errors
                });
            }
            console.log(`[Publish] Workflow validation passed`);

            // Validate database connections
            const connectionResults = await validateDatabaseConnections(workflow.nodes);
            const failedConnections = connectionResults.filter(r => !r.success);
            if (failedConnections.length > 0) {
                console.log(`[Publish] Database connection validation failed for workflow ${workflow.id}:`, failedConnections);
                return res.status(400).json({
                    error: 'Database connection failed',
                    message: formatConnectionErrors(connectionResults),
                    connectionErrors: failedConnections
                });
            }
            if (connectionResults.length > 0) {
                console.log(`[Publish] Database connection validation passed (${connectionResults.length} connections tested)`);
            }
        }

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

        // Check token limit before execution
        const tokenCheck = await checkTokenLimit(apiKeyInfo.publishedWorkflow.userId);
        if (!tokenCheck.canProceed) {
            console.log(`[Run] Token limit exceeded for user ${apiKeyInfo.publishedWorkflow.userId}`);
            return res.status(403).json({
                error: 'Token limit exceeded',
                message: `You have used ${tokenCheck.used} of your ${tokenCheck.limit} token limit. Cannot process more requests.`,
                tokens: {
                    used: tokenCheck.used,
                    limit: tokenCheck.limit,
                    remaining: tokenCheck.remaining
                }
            });
        }

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

        // Extract Upload node config from workflow definition
        const workflowDef = apiKeyInfo.publishedWorkflow.definition as any;
        const uploadNode = workflowDef.nodes?.find((n: any) =>
            n.action?.name?.toLowerCase().includes('upload')
        );
        const uploadConfig = uploadNode?.config || {};

        // Validate files against Upload node config
        if (files && files.length > 0) {
            for (const file of files) {
                // Check bulkUpload setting
                if (uploadConfig.bulkUpload === false) {
                    const isZip = file.mimetype === 'application/zip' ||
                        file.mimetype === 'application/x-zip-compressed' ||
                        file.originalname.toLowerCase().endsWith('.zip');
                    if (isZip) {
                        return res.status(400).json({
                            error: 'Bulk upload not allowed',
                            message: 'Bulk uploads (zip files) are not allowed for this workflow'
                        });
                    }
                }

                // Check maxFileSizeMB setting
                const maxBytes = (uploadConfig.maxFileSizeMB || 50) * 1024 * 1024;
                if (file.size > maxBytes) {
                    return res.status(400).json({
                        error: 'File too large',
                        message: `File "${file.originalname}" exceeds the maximum size of ${uploadConfig.maxFileSizeMB || 50}MB`
                    });
                }

                // Check allowedFileTypes setting
                if (uploadConfig.allowedFileTypes && uploadConfig.allowedFileTypes.length > 0) {
                    const allowed = uploadConfig.allowedFileTypes;
                    const isPdf = file.mimetype === 'application/pdf';
                    const isImage = file.mimetype.startsWith('image/');
                    const isZip = file.mimetype === 'application/zip' ||
                        file.mimetype === 'application/x-zip-compressed' ||
                        file.originalname.toLowerCase().endsWith('.zip');

                    // Allow ZIPs if bulkUpload is enabled, otherwise check allowedFileTypes
                    const isAllowed =
                        (uploadConfig.bulkUpload && isZip) ||
                        (allowed.includes('pdf') && isPdf) ||
                        (allowed.includes('images') && isImage);

                    if (!isAllowed) {
                        return res.status(400).json({
                            error: 'File type not allowed',
                            message: `File "${file.originalname}" has type "${file.mimetype}" which is not allowed. Allowed types: ${allowed.join(', ')}${uploadConfig.bulkUpload ? ', zip' : ''}`
                        });
                    }
                }
            }
        }

        const userId = apiKeyInfo.publishedWorkflow.userId;

        // Check storage limit before uploading
        if (files && files.length > 0) {
            const totalSize = files.reduce((sum, file) => sum + file.size, 0);

            const storageCheck = await checkStorageLimit(userId, totalSize);
            if (!storageCheck.canProceed) {
                console.log(`[Run] Storage limit exceeded for user ${userId}`);
                return res.status(400).json({
                    error: 'Storage limit exceeded',
                    message: `Adding ${formatBytes(totalSize)} would exceed your ${formatBytes(storageCheck.limit)} limit. Currently using ${formatBytes(storageCheck.used)}.`,
                    storage: {
                        used: storageCheck.used,
                        limit: storageCheck.limit,
                        remaining: storageCheck.remaining,
                        requested: totalSize
                    }
                });
            }
        }

        // Check token limit before processing
        const tokenCheck = await checkTokenLimit(userId);
        if (!tokenCheck.canProceed) {
            console.log(`[Run] Token limit exceeded for user ${userId}`);
            return res.status(403).json({
                error: 'Token limit exceeded',
                message: `You have used ${tokenCheck.used} of your ${tokenCheck.limit} token limit. Cannot process more documents.`,
                tokens: {
                    used: tokenCheck.used,
                    limit: tokenCheck.limit,
                    remaining: tokenCheck.remaining
                }
            });
        }

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
        const documents: { url: string; storagePath?: string; filename: string; mimeType: string }[] = [];
        let skippedFiles: { filename: string; reason: string }[] = [];

        if (files && files.length > 0) {
            // Get Upload service URL from workflow-builder database
            let uploadServiceUrl = 'http://localhost:4001'; // fallback

            try {
                const uploadAction = await getActionByName('Upload files');
                if (uploadAction?.serviceUrl) {
                    uploadServiceUrl = uploadAction.serviceUrl;
                } else {
                    console.warn(`[Run] Upload action not found in DB, using fallback: ${uploadServiceUrl}`);
                }
            } catch (err) {
                console.error(`[Run] Error looking up Upload action:`, err);
            }

            try {
                // Create form data for upload service using form-data package
                const FormData = require('form-data');
                const axios = require('axios');
                const { GoogleAuth } = require('google-auth-library');

                const formData = new FormData();

                // Add all files to the form data
                for (const file of files) {
                    formData.append('files', file.buffer, {
                        filename: file.originalname,
                        contentType: file.mimetype
                    });
                }

                // Add upload config from workflow's upload node
                formData.append('config', JSON.stringify(uploadConfig));

                // Add userId and workflowId for folder organization (user_id/workflow_id/)
                formData.append('userId', userId);
                formData.append('workflowId', workflowId);

                // Get headers including form-data headers
                const headers: Record<string, string> = {
                    ...formData.getHeaders()
                };

                // Add IAM token for Cloud Run URLs
                if (uploadServiceUrl.includes('.run.app')) {
                    try {
                        const auth = new GoogleAuth();
                        const url = new URL(uploadServiceUrl);
                        const audience = `${url.protocol}//${url.host}`;
                        const client = await auth.getIdTokenClient(audience);
                        const authHeaders = await client.getRequestHeaders(audience);
                        if (authHeaders.Authorization) {
                            headers['Authorization'] = authHeaders.Authorization;
                        } else if (client.credentials?.id_token) {
                            headers['Authorization'] = `Bearer ${client.credentials.id_token}`;
                        }
                    } catch (authError: any) {
                        console.error(`[Run] Failed to get IAM token for upload:`, authError.message);
                    }
                }

                // Use axios to send all files in one batch request
                console.log(`[Run] Uploading ${files.length} file(s) to upload service`);
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
                    uploadedFiles?: Array<{ url: string; storagePath?: string; filename: string; mimeType: string }>;
                    skippedFiles?: Array<{ filename: string; reason: string }>;
                    data?: { uploadedFiles?: Array<{ url: string; storagePath?: string; filename: string; mimeType: string }> };
                };

                // Collect uploaded files
                const uploadedFiles = uploadResult.uploadedFiles || uploadResult.data?.uploadedFiles || [];
                for (const uploadedFile of uploadedFiles) {
                    documents.push({
                        // Prefer signed URL if available, otherwise use public URL
                        url: (uploadedFile as any).signedUrl || uploadedFile.url,
                        storagePath: uploadedFile.storagePath,
                        filename: uploadedFile.filename,
                        mimeType: uploadedFile.mimeType
                    });
                }

                // Collect skipped files for monitor display
                if (uploadResult.skippedFiles && uploadResult.skippedFiles.length > 0) {
                    skippedFiles = uploadResult.skippedFiles;
                    console.log(`[Run] ${skippedFiles.length} file(s) skipped: ${skippedFiles.map(s => s.filename).join(', ')}`);
                }

                console.log(`[Run] Upload complete: ${documents.length} uploaded, ${skippedFiles.length} skipped`);

            } catch (uploadError: any) {
                // Enhanced error logging with full context
                const errorDetails: any = {
                    fileCount: files.length,
                    uploadServiceUrl,
                    workflowId
                };

                // Capture HTTP error details (including 502 Bad Gateway)
                if (uploadError.response) {
                    errorDetails.statusCode = uploadError.response.status;
                    errorDetails.statusText = uploadError.response.statusText;
                    errorDetails.responseData = uploadError.response.data;
                }

                // Capture network/timeout errors
                if (uploadError.code) {
                    errorDetails.errorCode = uploadError.code;
                }

                console.error(`[Run] File upload failed:`, errorDetails);

                // Return informative error to user
                const statusCode = uploadError.response?.status;
                let errorMessage = `Failed to upload files`;

                if (statusCode === 400 && uploadError.response?.data?.message) {
                    // Validation errors from upload service (ZIP not allowed, etc.)
                    errorMessage = uploadError.response.data.message;
                } else if (statusCode === 400 && uploadError.response?.data?.error?.message) {
                    // Check for nested error object (e.g. UPLOAD_ERROR from upload-service)
                    errorMessage = uploadError.response.data.error.message;
                } else if (statusCode === 502) {
                    errorMessage += ' - Upload service is temporarily unavailable (502 Bad Gateway)';
                } else if (statusCode) {
                    errorMessage += ` - Upload service returned ${statusCode} error`;
                } else if (uploadError.code === 'ECONNREFUSED') {
                    errorMessage += ' - Upload service is not reachable';
                } else if (uploadError.code === 'ETIMEDOUT') {
                    errorMessage += ' - Upload request timed out';
                }

                return res.status(statusCode === 400 ? 400 : 500).json({
                    error: 'Upload failed',
                    message: errorMessage,
                    details: {
                        statusCode: statusCode || null,
                        errorCode: uploadError.code || null,
                        //serviceUrl: uploadServiceUrl
                    }
                });
            }
        }

        // Get the workflow definition
        const workflowDefinition = apiKeyInfo.publishedWorkflow.definition;

        // Execute the workflow with provided input, uploaded documents, and skipped files info
        const executionId = await executeWorkflowWithInput(
            workflowDefinition,
            apiKeyInfo.publishedWorkflow.userId,
            apiKeyInfo.publishedWorkflowId,
            { input, documents, skippedFiles }
        );

        // Log documents and update usage after successful execution start
        if (documents.length > 0) {
            // Calculate total size from uploaded documents (files array may differ due to ZIP extraction)
            let totalSize = 0;

            // Log each document to the database
            for (const doc of documents) {
                // Skip macOS hidden files
                if (doc.filename.startsWith('._') || doc.filename.startsWith('.')) {
                    console.log(`[Run] Skipping hidden file: ${doc.filename}`);
                    continue;
                }

                // Find matching file for size (or estimate from document)
                const matchingFile = files.find(f => f.originalname === doc.filename);
                const fileSize = matchingFile?.size || 0;
                totalSize += fileSize;

                // Retry up to 3 times for transient DB errors
                for (let attempt = 1; attempt <= 3; attempt++) {
                    try {
                        await prisma.document.create({
                            data: {
                                userId,
                                filename: doc.filename,
                                size: BigInt(fileSize),
                                mimeType: doc.mimeType,
                                storagePath: doc.storagePath || doc.url,
                                workflowExecutionId: executionId
                            }
                        });
                        break; // Success, exit retry loop
                    } catch (docError: any) {
                        if (attempt === 3 || !docError.code?.startsWith('P1')) {
                            console.error(`[Run] Error logging document ${doc.filename}:`, docError);
                            break;
                        }
                        await new Promise(r => setTimeout(r, 500 * attempt));
                    }
                }
            }

            // Increment storage usage
            if (totalSize > 0) {
                await incrementStorageUsage(userId, totalSize);
            }
        }

        res.status(202).json({
            success: true,
            message: 'Workflow execution started',
            executionId,
            workflowId,
            workflowName: apiKeyInfo.publishedWorkflow.name,
            filesUploaded: documents.length,
            filesSkipped: skippedFiles.length,
            documents: documents.map(d => ({ filename: d.filename, mimeType: d.mimeType })),
            skippedFiles: skippedFiles.length > 0 ? skippedFiles : undefined,
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

// Helper function to format bytes
function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
