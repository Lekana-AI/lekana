/**
 * SSE Service
 * Manages Server-Sent Event connections for real-time workflow monitoring
 */

import { Response } from 'express';

// Map of workflowId -> Set of client response objects
const workflowClients = new Map<string, Set<Response>>();

// Map of executionId -> Set of client response objects (for execution-specific updates)
const executionClients = new Map<string, Set<Response>>();

/**
 * Add a client to receive updates for a specific workflow
 */
export function addWorkflowClient(workflowId: string, res: Response): void {
    if (!workflowClients.has(workflowId)) {
        workflowClients.set(workflowId, new Set());
    }
    workflowClients.get(workflowId)!.add(res);
    console.log(`[SSE] Client connected for workflow ${workflowId}. Total clients: ${workflowClients.get(workflowId)!.size}`);
}

/**
 * Remove a client from workflow updates
 */
export function removeWorkflowClient(workflowId: string, res: Response): void {
    const clients = workflowClients.get(workflowId);
    if (clients) {
        clients.delete(res);
        console.log(`[SSE] Client disconnected from workflow ${workflowId}. Remaining clients: ${clients.size}`);
        if (clients.size === 0) {
            workflowClients.delete(workflowId);
        }
    }
}

/**
 * Send an event to all clients subscribed to a workflow
 */
export function sendWorkflowEvent(workflowId: string, eventType: string, data: any): void {
    const clients = workflowClients.get(workflowId);
    if (!clients || clients.size === 0) {
        return; // No clients listening
    }

    const eventData = JSON.stringify({ type: eventType, data, timestamp: new Date().toISOString() });
    const message = `event: ${eventType}\ndata: ${eventData}\n\n`;

    console.log(`[SSE] Broadcasting ${eventType} to ${clients.size} clients for workflow ${workflowId}`);

    clients.forEach(client => {
        try {
            client.write(message);
        } catch (error) {
            console.error('[SSE] Error sending to client:', error);
        }
    });
}

/**
 * Emit execution started event
 */
export function emitExecutionStarted(workflowId: string, execution: {
    id: string;
    workflowName: string;
    status: string;
    startedAt?: Date;
}): void {
    sendWorkflowEvent(workflowId, 'execution:started', execution);
}

/**
 * Emit execution updated event (status change)
 */
export function emitExecutionUpdated(workflowId: string, execution: {
    id: string;
    status: string;
    startedAt?: Date;
    completedAt?: Date;
}): void {
    sendWorkflowEvent(workflowId, 'execution:updated', execution);
}

/**
 * Emit node started event
 */
export function emitNodeStarted(workflowId: string, nodeData: {
    executionId: string;
    nodeId: string;
    actionName: string;
    stepName: string;
    executionOrder: number;
    startedAt: Date;
}): void {
    sendWorkflowEvent(workflowId, 'node:started', nodeData);
}

/**
 * Emit node completed event
 */
export function emitNodeCompleted(workflowId: string, nodeData: {
    executionId: string;
    nodeId: string;
    actionName: string;
    stepName: string;
    status: string;
    input?: any;
    output?: any;
    completedAt: Date;
}): void {
    sendWorkflowEvent(workflowId, 'node:completed', nodeData);
}

/**
 * Emit node failed event
 */
export function emitNodeFailed(workflowId: string, nodeData: {
    executionId: string;
    nodeId: string;
    actionName: string;
    stepName: string;
    error: string;
    completedAt: Date;
}): void {
    sendWorkflowEvent(workflowId, 'node:failed', nodeData);
}

/**
 * Emit node skipped event
 */
export function emitNodeSkipped(workflowId: string, nodeData: {
    executionId: string;
    nodeId: string;
    actionName: string;
    stepName: string;
    reason: string;
}): void {
    sendWorkflowEvent(workflowId, 'node:skipped', nodeData);
}
