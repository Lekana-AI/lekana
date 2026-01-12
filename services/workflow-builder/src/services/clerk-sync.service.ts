/**
 * Clerk Sync Service
 * Syncs workflow role assignments to Clerk user public metadata
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Clerk SDK needs to be installed: npm install @clerk/clerk-sdk-node
// Uncomment when ready to use:
// import { clerkClient } from '@clerk/clerk-sdk-node';

interface WorkflowRoleMetadata {
    workflowId: string;
    workflowName: string;
    roles: string[];
    permissions: string[];
}

/**
 * Build the role metadata for a user to sync to Clerk
 */
export async function buildUserRoleMetadata(userId: string): Promise<Record<string, WorkflowRoleMetadata>> {
    const assignments = await prisma.workflowRoleAssignment.findMany({
        where: { userId },
        include: {
            workflowRole: {
                include: {
                    workflow: {
                        select: { id: true, name: true }
                    }
                }
            }
        }
    });

    const roleMap: Record<string, WorkflowRoleMetadata> = {};

    for (const assignment of assignments) {
        const { workflowRole } = assignment;
        const workflowId = workflowRole.workflowId;

        if (!roleMap[workflowId]) {
            roleMap[workflowId] = {
                workflowId,
                workflowName: workflowRole.workflow.name,
                roles: [],
                permissions: []
            };
        }

        roleMap[workflowId].roles.push(workflowRole.name);

        // Add permissions, avoiding duplicates
        for (const perm of workflowRole.permissions) {
            if (!roleMap[workflowId].permissions.includes(perm)) {
                roleMap[workflowId].permissions.push(perm);
            }
        }
    }

    return roleMap;
}

/**
 * Sync user's workflow roles to Clerk public metadata
 * This makes roles available to the frontend without an API call
 * 
 * Note: Requires @clerk/clerk-sdk-node to be installed and CLERK_SECRET_KEY env var
 */
export async function syncUserRolesToClerk(userId: string): Promise<void> {
    try {
        const roleMetadata = await buildUserRoleMetadata(userId);

        // Uncomment when @clerk/clerk-sdk-node is installed:
        /*
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                workflowRoles: roleMetadata
            }
        });
        */

        console.log(`[Clerk Sync] Would sync roles for user ${userId}:`, Object.keys(roleMetadata).length, 'workflows');
    } catch (error) {
        console.error('[Clerk Sync] Error syncing user roles to Clerk:', error);
        throw error;
    }
}

/**
 * Sync all assigned users for a workflow when a role changes
 */
export async function syncWorkflowUsersToClerk(workflowId: string): Promise<void> {
    try {
        const assignments = await prisma.workflowRoleAssignment.findMany({
            where: {
                workflowRole: { workflowId }
            },
            select: { userId: true }
        });

        const uniqueUserIds = [...new Set(assignments.map(a => a.userId))];

        for (const userId of uniqueUserIds) {
            await syncUserRolesToClerk(userId);
        }

        console.log(`[Clerk Sync] Synced ${uniqueUserIds.length} users for workflow ${workflowId}`);
    } catch (error) {
        console.error('[Clerk Sync] Error syncing workflow users:', error);
        throw error;
    }
}
