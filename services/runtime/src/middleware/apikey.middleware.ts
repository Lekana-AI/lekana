/**
 * API Key Authentication Middleware
 * Validates API keys for workflow execution endpoints
 */
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            apiKey?: {
                id: string;
                name: string;
                publishedWorkflowId: string;
                publishedWorkflow: {
                    id: string;
                    workflowId: string;
                    userId: string;
                    name: string;
                    definition: any;
                };
            };
        }
    }
}

/**
 * Hash an API key for storage/comparison
 */
export function hashApiKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Generate a new API key
 * Returns: { key: 'lk_abc123...', hash: 'sha256hash' }
 */
export function generateApiKey(): { key: string; hash: string; prefix: string } {
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const key = `lk_${randomBytes}`;
    const hash = hashApiKey(key);
    const prefix = key.substring(0, 12); // "lk_" + 8 chars
    return { key, hash, prefix };
}

/**
 * API Key authentication middleware
 * Expects header: X-API-Key: lk_xxxxx
 */
export const checkApiKey: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const apiKeyHeader = req.headers['x-api-key'] as string;

        if (!apiKeyHeader) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Missing X-API-Key header'
            });
            return;
        }

        // Hash the provided key to compare with stored hash
        const keyHash = hashApiKey(apiKeyHeader);

        // Find the API key
        const apiKeyRecord = await prisma.apiKey.findUnique({
            where: { key: keyHash },
            include: {
                publishedWorkflow: true
            }
        });

        if (!apiKeyRecord) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid API key'
            });
            return;
        }

        // Check if key is active
        if (!apiKeyRecord.isActive) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'API key has been revoked'
            });
            return;
        }

        // Check if key is expired
        if (apiKeyRecord.expiresAt && new Date() > apiKeyRecord.expiresAt) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'API key has expired'
            });
            return;
        }

        // Check if workflow is active
        if (!apiKeyRecord.publishedWorkflow.isActive) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'This workflow has been deactivated'
            });
            return;
        }

        // Update last used timestamp (non-blocking)
        prisma.apiKey.update({
            where: { id: apiKeyRecord.id },
            data: { lastUsedAt: new Date() }
        }).catch(err => console.error('Failed to update lastUsedAt:', err));

        // Attach API key info to request
        req.apiKey = {
            id: apiKeyRecord.id,
            name: apiKeyRecord.name,
            publishedWorkflowId: apiKeyRecord.publishedWorkflowId,
            publishedWorkflow: {
                id: apiKeyRecord.publishedWorkflow.id,
                workflowId: apiKeyRecord.publishedWorkflow.workflowId,
                userId: apiKeyRecord.publishedWorkflow.userId,
                name: apiKeyRecord.publishedWorkflow.name,
                definition: apiKeyRecord.publishedWorkflow.definition
            }
        };

        next();
    } catch (error: any) {
        console.error('API Key validation error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to validate API key'
        });
    }
};
