/**
 * Usage Service
 * Handles checking and updating user usage limits via workflow-builder database
 */

import { workflowDb } from './workflow-db.client';

interface UserUsage {
    userId: string;
    storageLimit: bigint;
    storageUsed: bigint;
    tokenLimit: number | null;
    tokensUsed: number;
}

/**
 * Check if a user can upload files of given size
 * Returns { canProceed, remaining, used, limit }
 */
export async function checkStorageLimit(userId: string, additionalBytes: number): Promise<{
    canProceed: boolean;
    used: number;
    limit: number;
    remaining: number;
    additionalBytes: number;
}> {
    if (!workflowDb) {
        console.warn('[UsageService] No workflow DB connection - skipping storage check');
        return { canProceed: true, used: 0, limit: Infinity, remaining: Infinity, additionalBytes };
    }

    try {
        // Get or create user usage record
        let usage = await workflowDb.$queryRaw<UserUsage[]>`
            SELECT "userId", "storageLimit", "storageUsed", "tokenLimit", "tokensUsed"
            FROM "UserUsage"
            WHERE "userId" = ${userId}
        `;

        if (usage.length === 0) {
            // Create usage record with defaults
            await workflowDb.$executeRaw`
                INSERT INTO "UserUsage" ("userId", "storageLimit", "storageUsed", "tokenLimit", "tokensUsed", "createdAt", "updatedAt")
                VALUES (${userId}, 1073741824, 0, NULL, 0, NOW(), NOW())
            `;
            usage = [{
                userId,
                storageLimit: BigInt(1073741824), // 1GB default
                storageUsed: BigInt(0),
                tokenLimit: null,
                tokensUsed: 0
            }];
        }

        const { storageLimit, storageUsed } = usage[0];
        const limit = Number(storageLimit);
        const used = Number(storageUsed);
        const remaining = limit - used;
        const canProceed = (used + additionalBytes) <= limit;

        return { canProceed, used, limit, remaining, additionalBytes };

    } catch (error) {
        console.error('[UsageService] Error checking storage limit:', error);
        // Fail open - allow operation if DB check fails
        return { canProceed: true, used: 0, limit: Infinity, remaining: Infinity, additionalBytes };
    }
}

/**
 * Increment user's storage usage
 */
export async function incrementStorageUsage(userId: string, bytes: number): Promise<void> {
    if (!workflowDb) {
        console.warn('[UsageService] No workflow DB connection - skipping storage increment');
        return;
    }

    try {
        await workflowDb.$executeRaw`
            UPDATE "UserUsage"
            SET "storageUsed" = "storageUsed" + ${bytes}, "updatedAt" = NOW()
            WHERE "userId" = ${userId}
        `;
    } catch (error) {
        console.error('[UsageService] Error incrementing storage usage:', error);
    }
}

/**
 * Increment user's token usage
 */
export async function incrementTokenUsage(userId: string, tokens: number): Promise<void> {
    if (!workflowDb) {
        console.warn('[UsageService] No workflow DB connection - skipping token increment');
        return;
    }

    try {
        await workflowDb.$executeRaw`
            UPDATE "UserUsage"
            SET "tokensUsed" = "tokensUsed" + ${tokens}, "updatedAt" = NOW()
            WHERE "userId" = ${userId}
        `;
    } catch (error) {
        console.error('[UsageService] Error incrementing token usage:', error);
    }
}

/**
 * Get user's current usage stats
 */
export async function getUserUsage(userId: string): Promise<{
    storage: { used: number; limit: number; percentage: number };
    tokens: { used: number; limit: number | null };
} | null> {
    if (!workflowDb) {
        return null;
    }

    try {
        const usage = await workflowDb.$queryRaw<UserUsage[]>`
            SELECT "userId", "storageLimit", "storageUsed", "tokenLimit", "tokensUsed"
            FROM "UserUsage"
            WHERE "userId" = ${userId}
        `;

        if (usage.length === 0) {
            return null;
        }

        const { storageLimit, storageUsed, tokenLimit, tokensUsed } = usage[0];
        const limit = Number(storageLimit);
        const used = Number(storageUsed);

        return {
            storage: {
                used,
                limit,
                percentage: Math.round((used / limit) * 100)
            },
            tokens: {
                used: tokensUsed,
                limit: tokenLimit
            }
        };
    } catch (error) {
        console.error('[UsageService] Error getting user usage:', error);
        return null;
    }
}
