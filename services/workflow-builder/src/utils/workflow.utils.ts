import prisma from '../lib/prisma';

/**
 * Update the updatedAt timestamp of a workflow by performing a dummy update.
 * This is used when child entities (nodes, edges, fields) are modified,
 * as Prisma doesn't automatically update the parent's @updatedAt.
 */
export async function touchWorkflow(workflowId: string) {
    try {
        await prisma.workflow.update({
            where: { id: workflowId },
            data: {
                // We don't actually change anything, just trigger @updatedAt
                updatedAt: new Date()
            }
        });
        console.log(`[Workflow Utils] Touched workflow ${workflowId} to refresh updatedAt`);
    } catch (error) {
        // Silently fail or log, but don't break the caller's transaction/flow
        console.error(`[Workflow Utils] Failed to touch workflow ${workflowId}:`, error);
    }
}
