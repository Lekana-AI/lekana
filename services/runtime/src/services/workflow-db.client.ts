/**
 * Workflow Database Client
 * Connects to the workflow-builder database to fetch current action details
 * 
 * This allows the runtime to use the current serviceUrl from the database
 * rather than the baked-in URL from published workflow definitions
 */

import { PrismaClient } from '@prisma/client';

const workflowDbUrl = process.env.WORKFLOW_DB_URL;

if (!workflowDbUrl) {
    console.warn('[WorkflowDB] WORKFLOW_DB_URL not set - action lookup will use cached serviceUrl from published workflow');
}

// Second Prisma client for workflow-builder database
// Uses WORKFLOW_DB_URL to connect to the workflow-builder's PostgreSQL database
export const workflowDb = workflowDbUrl
    ? new PrismaClient({
        datasources: {
            db: { url: workflowDbUrl }
        }
    })
    : null;
