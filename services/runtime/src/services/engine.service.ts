/**
 * Workflow Execution Engine
 * Handles parsing, ordering, and executing workflow nodes
 */

import { PrismaClient } from '@prisma/client';
import { callService, callServiceWithUrl, ServiceRequest, ServiceResponse } from './service-client';
import { getActionDetails } from './action-lookup.service';
import { incrementTokenUsage } from './usage.service';
import { logWorkflow, logExecution, logNodeExecution, logSeparator, logDebug, isLogEnabled } from './logger';

const prisma = new PrismaClient();

// Types for workflow data from workflow-builder
interface WorkflowAction {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    serviceUrl?: string;  // Microservice URL from database
    configSchema?: any;
    configMeta?: any;
}

interface WorkflowNode {
    id: string;
    workflowId: string;
    actionId: string;
    positionX: number;
    positionY: number;
    config: any;
    action: WorkflowAction;
}

interface WorkflowEdge {
    id: string;
    workflowId: string;
    sourceNodeId: string;
    targetNodeId: string;
}

interface WorkflowData {
    id: string;
    userId: string;
    name: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
}

interface ExecutionContext {
    workflowExecutionId: string;
    nodeOutputs: Map<string, any>;
}

/**
 * Build adjacency list from edges for topological sort
 */
function buildGraph(nodes: WorkflowNode[], edges: WorkflowEdge[]): {
    adjacency: Map<string, string[]>;
    inDegree: Map<string, number>;
} {
    const adjacency = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    // Initialize all nodes
    for (const node of nodes) {
        adjacency.set(node.id, []);
        inDegree.set(node.id, 0);
    }

    // Build edges
    for (const edge of edges) {
        const neighbors = adjacency.get(edge.sourceNodeId) || [];
        neighbors.push(edge.targetNodeId);
        adjacency.set(edge.sourceNodeId, neighbors);

        const degree = inDegree.get(edge.targetNodeId) || 0;
        inDegree.set(edge.targetNodeId, degree + 1);
    }

    return { adjacency, inDegree };
}

/**
 * Topological sort using Kahn's algorithm
 * Returns ordered node IDs or null if cycle detected
 */
function topologicalSort(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[] | null {
    const { adjacency, inDegree } = buildGraph(nodes, edges);
    const queue: string[] = [];
    const result: string[] = [];

    // Find nodes with no incoming edges (start nodes)
    for (const [nodeId, degree] of inDegree.entries()) {
        if (degree === 0) {
            queue.push(nodeId);
        }
    }

    while (queue.length > 0) {
        const current = queue.shift()!;
        result.push(current);

        const neighbors = adjacency.get(current) || [];
        for (const neighbor of neighbors) {
            const newDegree = (inDegree.get(neighbor) || 0) - 1;
            inDegree.set(neighbor, newDegree);
            if (newDegree === 0) {
                queue.push(neighbor);
            }
        }
    }

    // If we didn't process all nodes, there's a cycle
    if (result.length !== nodes.length) {
        return null;
    }

    return result;
}

/**
 * Get input for a node from its predecessor outputs
 */
function getNodeInput(nodeId: string, edges: WorkflowEdge[], context: ExecutionContext): any {
    // Find all edges pointing to this node
    const incomingEdges = edges.filter(e => e.targetNodeId === nodeId);

    if (incomingEdges.length === 0) {
        return null; // Start node, no input
    }

    if (incomingEdges.length === 1) {
        return context.nodeOutputs.get(incomingEdges[0].sourceNodeId);
    }

    // Multiple inputs - combine them
    const inputs: Record<string, any> = {};
    for (const edge of incomingEdges) {
        inputs[edge.sourceNodeId] = context.nodeOutputs.get(edge.sourceNodeId);
    }
    return inputs;
}

/**
 * Execute a single action by calling external microservice
 * Uses the service client for standardized communication
 * Prefers action.serviceUrl from database, falls back to name-based lookup
 */
async function executeAction(
    node: WorkflowNode,
    input: any,
    context: ExecutionContext,
    workflowData: { id: string; userId: string }
): Promise<ServiceResponse> {
    const actionName = node.action.name;

    // Fetch current serviceUrl from workflow-builder database
    // Falls back to cached serviceUrl from published workflow if DB unavailable
    let serviceUrl = node.action.serviceUrl;
    const currentAction = await getActionDetails(node.actionId);
    if (currentAction?.serviceUrl) {
        serviceUrl = currentAction.serviceUrl;
    }

    const config = node.config;

    // Build standard service request
    const serviceRequest: ServiceRequest = {
        executionId: context.workflowExecutionId,
        nodeId: node.id,
        workflowId: workflowData.id,
        userId: workflowData.userId,
        input: {
            data: input?.data || input,
            documents: input?.documents
        },
        config: {
            ...config,
            stepName: config?.stepName || actionName
        },
        metadata: {
            correlationId: context.workflowExecutionId,
            priority: 'normal'
        }
    };

    // Call external service using serviceUrl from database if available
    if (serviceUrl) {
        return callServiceWithUrl(serviceUrl, serviceRequest);
    }

    // Fallback to name-based lookup (backward compatibility)
    console.warn(`[Engine] serviceUrl not found for ${actionName}. Re-publish the workflow to include serviceUrl from the database.`);
    return callService(actionName, serviceRequest);
}

// Note: Action handlers have been moved to external microservices
// See service-client.ts for service registry and contracts

/**
 * Log execution event
 */
async function log(
    workflowExecutionId: string,
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR',
    message: string,
    nodeExecutionId?: string,
    metadata?: any
) {
    await prisma.executionLog.create({
        data: {
            workflowExecutionId,
            nodeExecutionId,
            level,
            message,
            metadata
        }
    });
}

/**
 * Main execution function - runs the entire workflow
 */
export async function executeWorkflow(workflow: WorkflowData): Promise<string> {
    // Log workflow configuration when LOG_NEED is enabled
    logSeparator('WORKFLOW EXECUTION START');
    logWorkflow('Starting workflow execution', {
        workflowId: workflow.id,
        workflowName: workflow.name,
        userId: workflow.userId,
        nodeCount: workflow.nodes.length,
        edgeCount: workflow.edges.length
    });

    if (isLogEnabled()) {
        logWorkflow('Workflow Configuration - Nodes', workflow.nodes.map(n => ({
            id: n.id,
            actionName: n.action.name,
            stepName: n.config?.stepName,
            serviceUrl: n.action.serviceUrl,
            config: n.config
        })));
        logWorkflow('Workflow Configuration - Edges', workflow.edges.map(e => ({
            source: e.sourceNodeId,
            target: e.targetNodeId
        })));
    }

    // Create workflow execution record
    const execution = await prisma.workflowExecution.create({
        data: {
            workflowId: workflow.id,
            workflowName: workflow.name,
            userId: workflow.userId,
            status: 'PENDING'
        }
    });

    logExecution('Created execution record', { executionId: execution.id });

    const context: ExecutionContext = {
        workflowExecutionId: execution.id,
        nodeOutputs: new Map()
    };

    try {
        // Log start
        await log(execution.id, 'INFO', `Starting workflow execution: ${workflow.name}`);

        // Get execution order
        const orderedNodeIds = topologicalSort(workflow.nodes, workflow.edges);

        if (!orderedNodeIds) {
            throw new Error('Workflow contains a cycle and cannot be executed');
        }

        // Log execution order
        const nodeMap = new Map(workflow.nodes.map(n => [n.id, n]));
        logExecution('Execution order determined', orderedNodeIds.map((id, index) => {
            const node = nodeMap.get(id);
            return `${index + 1}. ${node?.config?.stepName || node?.action.name} (${id})`;
        }));

        // Node map already created above for logging

        // Update execution status to running
        await prisma.workflowExecution.update({
            where: { id: execution.id },
            data: { status: 'RUNNING', startedAt: new Date() }
        });

        // Create node execution records
        for (let i = 0; i < orderedNodeIds.length; i++) {
            const nodeId = orderedNodeIds[i];
            const node = nodeMap.get(nodeId)!;

            await prisma.nodeExecution.create({
                data: {
                    workflowExecutionId: execution.id,
                    nodeId: node.id,
                    actionName: node.action.name,
                    stepName: node.config?.stepName || node.action.name,
                    executionOrder: i,
                    status: 'PENDING',
                    config: node.config
                }
            });
        }

        // Execute nodes in order
        for (let i = 0; i < orderedNodeIds.length; i++) {
            const nodeId = orderedNodeIds[i];
            const node = nodeMap.get(nodeId)!;

            logSeparator(`NODE ${i + 1}/${orderedNodeIds.length}`);
            logNodeExecution(nodeId, node.config?.stepName || node.action.name, 'STARTING', { config: node.config });

            await log(execution.id, 'INFO', `Executing node: ${node.config?.stepName || node.action.name}`);

            // Update node status to running
            const nodeExecution = await prisma.nodeExecution.updateMany({
                where: {
                    workflowExecutionId: execution.id,
                    nodeId: node.id
                },
                data: { status: 'RUNNING', startedAt: new Date() }
            });

            // Get input from previous nodes
            const input = getNodeInput(nodeId, workflow.edges, context);
            logDebug('Node input data', input);

            // Check if previous node returned skipped flag - propagate skip to downstream nodes
            // ServiceResponse can have skipped in data, metadata, or directly on the response
            const isSkipped =
                input?.data?.skipped === true ||
                input?.metadata?.skipped === true ||
                input?.skipped === true;

            logDebug('Skip check', {
                nodeId,
                nodeName: node.config?.stepName || node.action.name,
                inputDataSkipped: input?.data?.skipped,
                inputMetadataSkipped: input?.metadata?.skipped,
                inputSkipped: input?.skipped,
                isSkipped
            });

            if (isSkipped) {
                logNodeExecution(nodeId, node.config?.stepName || node.action.name, 'SKIPPED', { input });
                await log(execution.id, 'INFO', `Skipping node: ${node.config?.stepName || node.action.name} (upstream returned skipped)`);

                // Store skipped output for downstream nodes (propagate the skip)
                const skippedOutput = {
                    success: true,
                    data: { skipped: true, reason: 'Upstream node returned skipped' },
                    metadata: { skipped: true }
                };
                context.nodeOutputs.set(nodeId, skippedOutput);

                // Update node as skipped
                await prisma.nodeExecution.updateMany({
                    where: {
                        workflowExecutionId: execution.id,
                        nodeId: node.id
                    },
                    data: {
                        status: 'SKIPPED',
                        output: skippedOutput as any,
                        input: input,
                        completedAt: new Date()
                    }
                });

                continue; // Skip to next node
            }

            try {
                // Execute the action via external microservice
                const output = await executeAction(node, input, context, { id: workflow.id, userId: workflow.userId });

                // Log output when LOG_NEED is enabled (replaces debug console.error)
                logNodeExecution(nodeId, node.config?.stepName || node.action.name, 'COMPLETED', {
                    input,
                    output: output.success ? output.data : output.error
                });
                logDebug('Token tracking', {
                    action: node.action.name,
                    success: output.success,
                    metadata: output.metadata,
                    tokensUsed: output.metadata?.tokensUsed
                });

                // Track token usage if returned by the service (e.g., OCR/Gemini)
                const tokensUsed = output.metadata?.tokensUsed;
                if (tokensUsed && tokensUsed > 0) {
                    await incrementTokenUsage(workflow.userId, tokensUsed);
                    logDebug('Token usage incremented', { userId: workflow.userId, tokensUsed });
                }

                // Store output for downstream nodes
                context.nodeOutputs.set(nodeId, output);

                // Update node as completed
                await prisma.nodeExecution.updateMany({
                    where: {
                        workflowExecutionId: execution.id,
                        nodeId: node.id
                    },
                    data: {
                        status: 'COMPLETED',
                        output: output as any,
                        input: input,
                        completedAt: new Date()
                    }
                });

                await log(execution.id, 'INFO', `Node completed: ${node.config?.stepName || node.action.name}`);

            } catch (nodeError: any) {
                // Node failed - update and throw
                await prisma.nodeExecution.updateMany({
                    where: {
                        workflowExecutionId: execution.id,
                        nodeId: node.id
                    },
                    data: {
                        status: 'FAILED',
                        error: nodeError.message,
                        input: input,
                        completedAt: new Date()
                    }
                });

                await log(execution.id, 'ERROR', `Node failed: ${nodeError.message}`, undefined, { nodeId });
                throw nodeError;
            }
        }

        // Workflow completed successfully
        await prisma.workflowExecution.update({
            where: { id: execution.id },
            data: { status: 'COMPLETED', completedAt: new Date() }
        });

        await log(execution.id, 'INFO', 'Workflow execution completed successfully');
        logSeparator('WORKFLOW EXECUTION COMPLETE');
        logExecution('Workflow completed successfully', { executionId: execution.id, workflowName: workflow.name });

        return execution.id;

    } catch (error: any) {
        // Workflow failed
        await prisma.workflowExecution.update({
            where: { id: execution.id },
            data: { status: 'FAILED', completedAt: new Date() }
        });

        await log(execution.id, 'ERROR', `Workflow execution failed: ${error.message}`);

        throw error;
    }
}

/**
 * Execute a published workflow with external input data
 * Used when running via API key authentication
 */
export async function executeWorkflowWithInput(
    workflowDefinition: any,
    userId: string,
    publishedWorkflowId: string,
    inputData: { input?: any; documents?: any[] }
): Promise<string> {
    // Log workflow configuration when LOG_NEED is enabled
    logSeparator('WORKFLOW EXECUTION START (API Key)');
    logWorkflow('Starting published workflow execution', {
        workflowId: workflowDefinition.id,
        workflowName: workflowDefinition.name,
        userId,
        publishedWorkflowId,
        documentCount: inputData.documents?.length || 0
    });
    logDebug('Input data received', inputData);

    // Create workflow execution record linked to published workflow
    const execution = await prisma.workflowExecution.create({
        data: {
            workflowId: workflowDefinition.id,
            workflowName: workflowDefinition.name,
            userId,
            publishedWorkflowId,
            inputData: inputData,
            status: 'PENDING'
        }
    });

    logExecution('Created execution record', { executionId: execution.id });

    const context: ExecutionContext = {
        workflowExecutionId: execution.id,
        nodeOutputs: new Map()
    };

    // Store initial input for first node(s)
    context.nodeOutputs.set('__initial_input__', inputData);

    try {
        await log(execution.id, 'INFO', `Starting workflow execution: ${workflowDefinition.name}`);
        await log(execution.id, 'DEBUG', 'Input data received', undefined, inputData);

        const nodes = workflowDefinition.nodes as WorkflowNode[];
        const edges = workflowDefinition.edges as WorkflowEdge[];

        const orderedNodeIds = topologicalSort(nodes, edges);

        if (!orderedNodeIds) {
            throw new Error('Workflow contains a cycle and cannot be executed');
        }

        const nodeMap = new Map(nodes.map(n => [n.id, n]));
        logExecution('Execution order determined', orderedNodeIds.map((id, index) => {
            const node = nodeMap.get(id);
            return `${index + 1}. ${node?.config?.stepName || node?.action.name} (${id})`;
        }));

        await prisma.workflowExecution.update({
            where: { id: execution.id },
            data: { status: 'RUNNING', startedAt: new Date() }
        });

        // Create node execution records
        for (let i = 0; i < orderedNodeIds.length; i++) {
            const nodeId = orderedNodeIds[i];
            const node = nodeMap.get(nodeId)!;

            await prisma.nodeExecution.create({
                data: {
                    workflowExecutionId: execution.id,
                    nodeId: node.id,
                    actionName: node.action.name,
                    stepName: node.config?.stepName || node.action.name,
                    executionOrder: i,
                    status: 'PENDING',
                    config: node.config
                }
            });
        }

        // Execute nodes in order
        for (let i = 0; i < orderedNodeIds.length; i++) {
            const nodeId = orderedNodeIds[i];
            const node = nodeMap.get(nodeId)!;

            logSeparator(`NODE ${i + 1}/${orderedNodeIds.length}`);
            logNodeExecution(nodeId, node.config?.stepName || node.action.name, 'STARTING', { config: node.config });

            await log(execution.id, 'INFO', `Executing node: ${node.config?.stepName || node.action.name}`);

            await prisma.nodeExecution.updateMany({
                where: { workflowExecutionId: execution.id, nodeId: node.id },
                data: { status: 'RUNNING', startedAt: new Date() }
            });

            // Get input - use initial input for start nodes (no incoming edges)
            let nodeInput = getNodeInput(nodeId, edges, context);
            if (nodeInput === null && i === 0) {
                nodeInput = inputData; // First node gets the initial input
            }
            logDebug('Node input data', nodeInput);

            try {
                const output = await executeAction(node, nodeInput, context, { id: workflowDefinition.id, userId });

                // Log output when LOG_NEED is enabled
                logNodeExecution(nodeId, node.config?.stepName || node.action.name, 'COMPLETED', {
                    input: nodeInput,
                    output: output.success ? output.data : output.error
                });
                logDebug('Token tracking', {
                    action: node.action.name,
                    success: output.success,
                    tokensUsed: output.metadata?.tokensUsed
                });

                // Track token usage if returned by the service (e.g., OCR/Gemini)
                const tokensUsed = output.metadata?.tokensUsed;
                if (tokensUsed && tokensUsed > 0) {
                    await incrementTokenUsage(userId, tokensUsed);
                    logDebug('Token usage incremented', { userId, tokensUsed });
                }

                context.nodeOutputs.set(nodeId, output);

                await prisma.nodeExecution.updateMany({
                    where: { workflowExecutionId: execution.id, nodeId: node.id },
                    data: {
                        status: 'COMPLETED',
                        output: output as any,
                        input: nodeInput,
                        completedAt: new Date()
                    }
                });

                await log(execution.id, 'INFO', `Node completed: ${node.config?.stepName || node.action.name}`);

            } catch (nodeError: any) {
                await prisma.nodeExecution.updateMany({
                    where: { workflowExecutionId: execution.id, nodeId: node.id },
                    data: {
                        status: 'FAILED',
                        error: nodeError.message,
                        input: nodeInput,
                        completedAt: new Date()
                    }
                });

                await log(execution.id, 'ERROR', `Node failed: ${nodeError.message}`, undefined, { nodeId });
                throw nodeError;
            }
        }

        await prisma.workflowExecution.update({
            where: { id: execution.id },
            data: { status: 'COMPLETED', completedAt: new Date() }
        });

        await log(execution.id, 'INFO', 'Workflow execution completed successfully');

        return execution.id;

    } catch (error: any) {
        await prisma.workflowExecution.update({
            where: { id: execution.id },
            data: { status: 'FAILED', completedAt: new Date() }
        });

        await log(execution.id, 'ERROR', `Workflow execution failed: ${error.message}`);

        throw error;
    }
}

