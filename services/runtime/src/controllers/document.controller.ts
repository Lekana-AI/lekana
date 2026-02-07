/**
 * Document Controller
 * Manages document listings and signed URL generation
 * Calls the Upload service to generate fresh signed URLs
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getActionByName } from '../services/action-lookup.service';
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';

const prisma = new PrismaClient();

// Retry helper for service calls
async function withRetry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delayMs: number = 500
): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            if (attempt === retries || !error.code?.includes('ECONNREFUSED')) {
                throw error;
            }
            console.log(`[Document] Retry ${attempt}/${retries} after connection refused...`);
            await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        }
    }
    throw new Error('Max retries reached');
}

// Get Upload service URL
async function getUploadServiceUrl(): Promise<string> {
    try {
        const uploadAction = await getActionByName('Upload files');
        if (uploadAction?.serviceUrl) {
            return uploadAction.serviceUrl;
        }
    } catch (err) {
        console.error('[Document] Error looking up Upload action:', err);
    }
    return process.env.UPLOAD_SERVICE_URL || 'http://localhost:4001';
}

// Get IAM token for Cloud Run authentication
async function getIamToken(targetUrl: string): Promise<string | null> {
    if (!targetUrl.includes('.run.app')) {
        return null;
    }
    try {
        // Extract base URL for audience (remove path)
        const url = new URL(targetUrl);
        const audience = `${url.protocol}//${url.host}`;

        const auth = new GoogleAuth();
        const client = await auth.getIdTokenClient(audience);

        // IMPORTANT: Pass the audience to getRequestHeaders() - this is required!
        const headers = await client.getRequestHeaders(audience) as unknown as Record<string, string>;
        const authHeader = headers['Authorization'] || headers['authorization'];
        const token = authHeader?.replace('Bearer ', '') || null;

        if (token) {
            return token;
        }

        // Fallback: try to get token from client credentials directly
        if ((client as any).credentials?.id_token) {
            return (client as any).credentials.id_token;
        }

        console.error('[Document] Failed to get IAM token - no token in headers or credentials');
        return null;
    } catch (err) {
        console.error('[Document] Error getting IAM token:', err);
        return null;
    }
}



/**
 * GET /api/v1/documents
 * List documents for the authenticated user
 */
export const listDocuments = async (req: Request, res: Response) => {
    try {
        const userId = req.auth?.sub;

        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User ID not found in token'
            });
        }

        const { workflowExecutionId, limit = 50, offset = 0 } = req.query;

        const where: any = { userId };
        if (workflowExecutionId) {
            where.workflowExecutionId = workflowExecutionId as string;
        }

        const [documents, total] = await Promise.all([
            prisma.document.findMany({
                where,
                orderBy: { uploadedAt: 'desc' },
                take: Number(limit),
                skip: Number(offset),
                include: {
                    workflowExecution: {
                        select: {
                            id: true,
                            workflowName: true,
                            status: true
                        }
                    }
                }
            }),
            prisma.document.count({ where })
        ]);

        res.json({
            documents: documents.map(doc => ({
                id: doc.id,
                filename: doc.filename,
                size: Number(doc.size),
                sizeFormatted: formatBytes(Number(doc.size)),
                mimeType: doc.mimeType,
                uploadedAt: doc.uploadedAt,
                workflowExecution: doc.workflowExecution
            })),
            pagination: {
                total,
                limit: Number(limit),
                offset: Number(offset),
                hasMore: Number(offset) + documents.length < total
            }
        });

    } catch (error: any) {
        console.error('Error listing documents:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/v1/documents/:id/url
 * Generate a URL for viewing/downloading a document
 * For encrypted files, returns a runtime proxy URL that decrypts on-the-fly
 */
export const getSignedUrl = async (req: Request, res: Response) => {
    try {
        const userId = req.auth?.sub;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User ID not found in token'
            });
        }

        const document = await prisma.document.findUnique({
            where: { id }
        });

        if (!document) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Document not found'
            });
        }

        // Ensure user owns this document
        if (document.userId !== userId) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You do not have access to this document'
            });
        }

        // Return a proxy URL that will decrypt the file on-the-fly
        // The frontend will call this URL, which proxies to the upload service
        const proxyUrl = `/api/v1/documents/${id}/content`;

        res.json({
            id: document.id,
            filename: document.filename,
            url: proxyUrl,
            expiresIn: 3600, // 1 hour
            note: 'Use this URL to fetch decrypted content'
        });

    } catch (error: any) {
        console.error('Error generating document URL:', error);
        res.status(500).json({
            error: 'Failed to generate document URL',
            message: error.message
        });
    }
};

/**
 * GET /api/v1/documents/:id/content
 * Proxy endpoint that fetches and decrypts document content from Upload service
 * Streams decrypted content back to the frontend
 */
export const getDocumentContent = async (req: Request, res: Response) => {
    try {
        const userId = req.auth?.sub;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User ID not found in token'
            });
        }

        const document = await prisma.document.findUnique({
            where: { id }
        });

        if (!document) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Document not found'
            });
        }

        // Ensure user owns this document
        if (document.userId !== userId) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You do not have access to this document'
            });
        }

        // Call Upload service to fetch and decrypt file
        const uploadServiceUrl = await getUploadServiceUrl();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        // Add IAM token for Cloud Run
        const iamToken = await getIamToken(uploadServiceUrl);
        if (iamToken) {
            headers['Authorization'] = `Bearer ${iamToken}`;
        }

        console.log(`[Document] Fetching decrypted content for: ${document.filename}`);

        const response = await withRetry(() => axios.post(
            `${uploadServiceUrl}/api/v1/decrypt`,
            {
                storagePath: document.storagePath
            },
            {
                headers,
                timeout: 60000, // 60 seconds for large files
                responseType: 'arraybuffer' // Get binary data
            }
        ));

        // Forward the decrypted content to the client
        res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
        res.setHeader('Content-Length', response.data.length);
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(document.filename)}"`);
        res.setHeader('Cache-Control', 'private, max-age=3600');

        res.send(Buffer.from(response.data));

    } catch (error: any) {
        console.error('Error fetching document content:', error);
        res.status(500).json({
            error: 'Failed to fetch document content',
            message: error.message
        });
    }
};

/**
 * GET /api/v1/documents/by-workflow/:workflowExecutionId
 * List documents for a specific workflow execution
 */
export const listDocumentsByWorkflow = async (req: Request, res: Response) => {
    try {
        const userId = req.auth?.sub;
        const { workflowExecutionId } = req.params;

        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User ID not found in token'
            });
        }

        const documents = await prisma.document.findMany({
            where: {
                workflowExecutionId,
                userId // Ensure user owns these documents
            },
            orderBy: { uploadedAt: 'desc' }
        });

        res.json({
            workflowExecutionId,
            documents: documents.map(doc => ({
                id: doc.id,
                filename: doc.filename,
                size: Number(doc.size),
                sizeFormatted: formatBytes(Number(doc.size)),
                mimeType: doc.mimeType,
                uploadedAt: doc.uploadedAt
            }))
        });

    } catch (error: any) {
        console.error('Error listing documents by workflow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/v1/documents/by-workflow-id/:workflowId
 * List documents for a specific workflow (across all executions)
 */
export const listDocumentsByWorkflowId = async (req: Request, res: Response) => {
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

        // Find all documents for executions of this workflow
        const [documents, total] = await Promise.all([
            prisma.document.findMany({
                where: {
                    userId,
                    workflowExecution: {
                        workflowId
                    }
                },
                orderBy: { uploadedAt: 'desc' },
                take: Number(limit),
                skip: Number(offset),
                include: {
                    workflowExecution: {
                        select: {
                            id: true,
                            workflowName: true,
                            status: true,
                            startedAt: true
                        }
                    }
                }
            }),
            prisma.document.count({
                where: {
                    userId,
                    workflowExecution: {
                        workflowId
                    }
                }
            })
        ]);

        res.json({
            workflowId,
            documents: documents.map(doc => ({
                id: doc.id,
                filename: doc.filename,
                size: Number(doc.size),
                sizeFormatted: formatBytes(Number(doc.size)),
                mimeType: doc.mimeType,
                uploadedAt: doc.uploadedAt,
                workflowExecution: doc.workflowExecution
            })),
            pagination: {
                total,
                limit: Number(limit),
                offset: Number(offset),
                hasMore: Number(offset) + documents.length < total
            }
        });

    } catch (error: any) {
        console.error('Error listing documents by workflow ID:', error);
        res.status(500).json({ error: 'Internal server error' });
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
