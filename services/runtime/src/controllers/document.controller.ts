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
        const auth = new GoogleAuth();
        const client = await auth.getIdTokenClient(targetUrl);
        const headers = await client.getRequestHeaders() as unknown as Record<string, string>;
        const authHeader = headers['Authorization'] || headers['authorization'];
        return authHeader?.replace('Bearer ', '') || null;
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
 * Generate a fresh signed URL for viewing/downloading a document
 * Calls the Upload service to generate the signed URL
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

        // Call Upload service to generate signed URL
        const uploadServiceUrl = await getUploadServiceUrl();
        console.log(`[Document] Requesting signed URL from ${uploadServiceUrl}`);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        // Add IAM token for Cloud Run
        const iamToken = await getIamToken(uploadServiceUrl);
        if (iamToken) {
            headers['Authorization'] = `Bearer ${iamToken}`;
        }

        const response = await withRetry(() => axios.post(
            `${uploadServiceUrl}/api/v1/signed-url`,
            {
                storagePath: document.storagePath,
                expiryMinutes: 60 // 1 hour
            },
            { headers, timeout: 5000 }
        ));

        if (!response.data.success) {
            throw new Error(response.data.error?.message || 'Failed to generate signed URL');
        }

        res.json({
            id: document.id,
            filename: document.filename,
            url: response.data.data.signedUrl,
            expiresIn: response.data.data.expiresIn
        });

    } catch (error: any) {
        console.error('Error generating signed URL:', error);
        res.status(500).json({
            error: 'Failed to generate signed URL',
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
