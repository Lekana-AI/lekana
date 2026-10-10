/**
 * Action Lookup Service
 * Fetches current action details from workflow-builder database
 * 
 * This enables dynamic serviceUrl resolution - when you update an action's
 * serviceUrl in the workflow-builder, all workflows (including old published ones)
 * will automatically use the new URL
 */

import { workflowDb } from './workflow-db.client';

export interface ActionDetails {
    id: string;
    name: string;
    serviceUrl: string | null;
}

// Cache to avoid repeated DB lookups within same execution
const actionCache = new Map<string, ActionDetails>();
const actionNameCache = new Map<string, ActionDetails>();

/**
 * Fetch action details from workflow-builder database by ID
 * Returns null if WORKFLOW_DB_URL not configured (fallback to cached serviceUrl)
 */
export async function getActionDetails(actionId: string): Promise<ActionDetails | null> {
    // Check cache first
    if (actionCache.has(actionId)) {
        return actionCache.get(actionId)!;
    }

    // If no workflow DB client, return null (fallback to cached serviceUrl)
    if (!workflowDb) {
        return null;
    }

    try {
        // Fetch from workflow-builder database
        // Uses raw query since we don't have generated types for this DB
        const actions = await workflowDb.$queryRaw<ActionDetails[]>`
            SELECT id, name, "serviceUrl" FROM "Action" WHERE id = ${actionId}
        `;

        if (actions.length > 0) {
            actionCache.set(actionId, actions[0]);
            return actions[0];
        }

        return null;
    } catch (error) {
        console.error(`[ActionLookup] Failed to fetch action ${actionId}:`, error);
        return null;
    }
}

/**
 * Fetch action details from workflow-builder database by name
 * Useful for looking up services like "Upload" without having an actionId
 */
export async function getActionByName(actionName: string): Promise<ActionDetails | null> {
    // Check cache first
    if (actionNameCache.has(actionName)) {
        return actionNameCache.get(actionName)!;
    }

    // If no workflow DB client, return null
    if (!workflowDb) {
        return null;
    }

    try {
        const actions = await workflowDb.$queryRaw<ActionDetails[]>`
            SELECT id, name, "serviceUrl" FROM "Action" WHERE name = ${actionName}
        `;

        if (actions.length > 0) {
            actionNameCache.set(actionName, actions[0]);
            return actions[0];
        }

        return null;
    } catch (error) {
        console.error(`[ActionLookup] Failed to fetch action by name ${actionName}:`, error);
        return null;
    }
}

/**
 * Clear action cache
 * Useful for testing or when action details are updated
 */
export function clearActionCache(): void {
    actionCache.clear();
    actionNameCache.clear();
}

