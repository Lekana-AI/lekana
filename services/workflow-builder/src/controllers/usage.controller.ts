/**
 * Usage Controller
 * Manages user storage and token usage limits
 */

import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

// Default limits (fallback if not configured in DB)
const DEFAULT_STORAGE_LIMIT = 1 * 1024 * 1024 * 1024; // 1GB
const DEFAULT_TOKEN_LIMIT: number | null = null; // null = unlimited

/**
 * Get default limits from SystemConfig table
 */
async function getDefaultLimits() {
    try {
        const [storageLimitConfig, tokenLimitConfig] = await Promise.all([
            prisma.systemConfig.findUnique({ where: { key: 'free_user_storage_limit' } }),
            prisma.systemConfig.findUnique({ where: { key: 'free_user_token_limit' } })
        ]);

        return {
            storageLimit: storageLimitConfig
                ? BigInt(JSON.parse(storageLimitConfig.value))
                : BigInt(DEFAULT_STORAGE_LIMIT),
            tokenLimit: tokenLimitConfig
                ? JSON.parse(tokenLimitConfig.value)
                : DEFAULT_TOKEN_LIMIT
        };
    } catch (error) {
        console.error('Error fetching default limits from DB, using fallbacks:', error);
        return {
            storageLimit: BigInt(DEFAULT_STORAGE_LIMIT),
            tokenLimit: DEFAULT_TOKEN_LIMIT
        };
    }
}

/**
 * GET /api/v1/usage
 * Get current user's usage stats
 */
export const getUsage = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).auth?.sub;

        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User ID not found in token'
            });
        }

        // Find or create usage record
        let usage = await prisma.userUsage.findUnique({
            where: { userId }
        });

        if (!usage) {
            const defaults = await getDefaultLimits();
            usage = await prisma.userUsage.create({
                data: {
                    userId,
                    storageLimit: defaults.storageLimit,
                    tokenLimit: defaults.tokenLimit
                }
            });
        }

        res.json({
            userId: usage.userId,
            storage: {
                used: Number(usage.storageUsed),
                limit: Number(usage.storageLimit),
                usedFormatted: formatBytes(Number(usage.storageUsed)),
                limitFormatted: formatBytes(Number(usage.storageLimit)),
                percentage: Math.round((Number(usage.storageUsed) / Number(usage.storageLimit)) * 100)
            },
            tokens: {
                used: usage.tokensUsed,
                limit: usage.tokenLimit
            }
        });

    } catch (error: any) {
        console.error('Error getting usage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/v1/usage/:userId
 * Get a specific user's usage stats (admin only)
 */
export const getUserUsage = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        let usage = await prisma.userUsage.findUnique({
            where: { userId }
        });

        if (!usage) {
            const defaults = await getDefaultLimits();
            usage = await prisma.userUsage.create({
                data: {
                    userId,
                    storageLimit: defaults.storageLimit,
                    tokenLimit: defaults.tokenLimit
                }
            });
        }

        res.json({
            userId: usage.userId,
            storage: {
                used: Number(usage.storageUsed),
                limit: Number(usage.storageLimit),
                usedFormatted: formatBytes(Number(usage.storageUsed)),
                limitFormatted: formatBytes(Number(usage.storageLimit)),
                percentage: Math.round((Number(usage.storageUsed) / Number(usage.storageLimit)) * 100)
            },
            tokens: {
                used: usage.tokensUsed,
                limit: usage.tokenLimit
            }
        });

    } catch (error: any) {
        console.error('Error getting user usage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * PATCH /api/v1/usage/:userId/limits
 * Update a user's storage/token limits (admin only)
 */
export const updateLimits = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { storageLimit, tokenLimit } = req.body;

        const updateData: any = {};
        if (storageLimit !== undefined) {
            updateData.storageLimit = BigInt(storageLimit);
        }
        if (tokenLimit !== undefined) {
            updateData.tokenLimit = tokenLimit;
        }

        const defaults = await getDefaultLimits();
        const usage = await prisma.userUsage.upsert({
            where: { userId },
            update: updateData,
            create: {
                userId,
                storageLimit: updateData.storageLimit || defaults.storageLimit,
                tokenLimit: updateData.tokenLimit !== undefined ? updateData.tokenLimit : defaults.tokenLimit
            }
        });

        res.json({
            success: true,
            userId: usage.userId,
            storageLimit: Number(usage.storageLimit),
            tokenLimit: usage.tokenLimit
        });

    } catch (error: any) {
        console.error('Error updating limits:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * POST /api/v1/usage/increment
 * Increment storage or token usage (internal API for runtime)
 */
export const incrementUsage = async (req: Request, res: Response) => {
    try {
        const { userId, storageBytes, tokens } = req.body;

        if (!userId) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'userId is required'
            });
        }

        // Ensure user has a usage record
        let usage = await prisma.userUsage.findUnique({
            where: { userId }
        });

        if (!usage) {
            const defaults = await getDefaultLimits();
            usage = await prisma.userUsage.create({
                data: {
                    userId,
                    storageLimit: defaults.storageLimit,
                    tokenLimit: defaults.tokenLimit
                }
            });
        }

        // Check if adding storage would exceed limit
        if (storageBytes) {
            const newStorageUsed = Number(usage.storageUsed) + storageBytes;
            if (newStorageUsed > Number(usage.storageLimit)) {
                return res.status(400).json({
                    error: 'Storage limit exceeded',
                    message: `Adding ${formatBytes(storageBytes)} would exceed your ${formatBytes(Number(usage.storageLimit))} limit`,
                    currentUsed: Number(usage.storageUsed),
                    limit: Number(usage.storageLimit),
                    requested: storageBytes
                });
            }
        }

        // Increment usage
        const updated = await prisma.userUsage.update({
            where: { userId },
            data: {
                storageUsed: storageBytes ? { increment: storageBytes } : undefined,
                tokensUsed: tokens ? { increment: tokens } : undefined
            }
        });

        res.json({
            success: true,
            storage: {
                used: Number(updated.storageUsed),
                limit: Number(updated.storageLimit)
            },
            tokens: {
                used: updated.tokensUsed,
                limit: updated.tokenLimit
            }
        });

    } catch (error: any) {
        console.error('Error incrementing usage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * POST /api/v1/usage/check
 * Check if user can use specified resources (internal API for runtime)
 */
export const checkUsage = async (req: Request, res: Response) => {
    try {
        const { userId, storageBytes } = req.body;

        if (!userId) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'userId is required'
            });
        }

        let usage = await prisma.userUsage.findUnique({
            where: { userId }
        });

        if (!usage) {
            const defaults = await getDefaultLimits();
            usage = await prisma.userUsage.create({
                data: {
                    userId,
                    storageLimit: defaults.storageLimit,
                    tokenLimit: defaults.tokenLimit
                }
            });
        }

        const canProceed = storageBytes
            ? (Number(usage.storageUsed) + storageBytes) <= Number(usage.storageLimit)
            : true;

        res.json({
            canProceed,
            storage: {
                used: Number(usage.storageUsed),
                limit: Number(usage.storageLimit),
                requested: storageBytes || 0,
                remaining: Number(usage.storageLimit) - Number(usage.storageUsed)
            }
        });

    } catch (error: any) {
        console.error('Error checking usage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/v1/usage/config
 * Get current system config for default limits
 */
export const getSystemConfig = async (req: Request, res: Response) => {
    try {
        const defaults = await getDefaultLimits();

        res.json({
            storageLimit: Number(defaults.storageLimit),
            storageLimitFormatted: formatBytes(Number(defaults.storageLimit)),
            tokenLimit: defaults.tokenLimit
        });

    } catch (error: any) {
        console.error('Error getting system config:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * PUT /api/v1/usage/config
 * Update system config for default limits (admin only)
 */
export const updateSystemConfig = async (req: Request, res: Response) => {
    try {
        const { storageLimit, tokenLimit } = req.body;

        const updates = [];

        if (storageLimit !== undefined) {
            updates.push(
                prisma.systemConfig.upsert({
                    where: { key: 'free_user_storage_limit' },
                    update: { value: JSON.stringify(storageLimit) },
                    create: { key: 'free_user_storage_limit', value: JSON.stringify(storageLimit) }
                })
            );
        }

        if (tokenLimit !== undefined) {
            updates.push(
                prisma.systemConfig.upsert({
                    where: { key: 'free_user_token_limit' },
                    update: { value: JSON.stringify(tokenLimit) },
                    create: { key: 'free_user_token_limit', value: JSON.stringify(tokenLimit) }
                })
            );
        }

        await Promise.all(updates);

        const newDefaults = await getDefaultLimits();

        res.json({
            success: true,
            storageLimit: Number(newDefaults.storageLimit),
            storageLimitFormatted: formatBytes(Number(newDefaults.storageLimit)),
            tokenLimit: newDefaults.tokenLimit
        });

    } catch (error: any) {
        console.error('Error updating system config:', error);
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
