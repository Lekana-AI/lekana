import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { streamWorkflowGeneration, WorkflowSnapshot } from '../utils/ai.utils';

const prisma = new PrismaClient({});

/**
 * Endpoint to generate or refine a workflow using AI
 * POST /workflows/generate
 */
export const generateAIWorkflow = async (req: Request, res: Response) => {
    try {
        const { prompt, workflowId } = req.body;
        const userId = req.auth?.userId;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        if (!userId) {
            return res.status(401).json({ error: 'User ID not found in token' });
        }

        // 1. Fetch all available actions for context
        const actions = await prisma.action.findMany({
            include: { category: true }
        });

        // 2. Fetch current state if refining
        let currentState: WorkflowSnapshot | undefined;
        let existingWorkflow: any;

        if (workflowId) {
            existingWorkflow = await prisma.workflow.findFirst({
                where: { id: workflowId, userId },
                include: {
                    nodes: {
                        include: { action: true }
                    },
                    edges: true
                }
            });

            if (existingWorkflow) {
                currentState = {
                    name: existingWorkflow.name,
                    nodes: existingWorkflow.nodes.map((n: any) => ({
                        tempId: n.id,
                        actionName: n.action.name,
                        config: n.config,
                        position: { x: n.positionX, y: n.positionY }
                    })),
                    edges: existingWorkflow.edges.map((e: any) => ({
                        sourceTempId: e.sourceNodeId,
                        targetTempId: e.targetNodeId
                    }))
                };
            }
        }

        // 3. Set up streaming headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        let fullText = '';
        const stream = streamWorkflowGeneration(prompt, actions, currentState);

        let isStreamingJson = false;

        for await (const chunk of stream) {
            fullText += chunk;

            // Check if we hit the JSON marker
            if (fullText.includes('---JSON_START---')) {
                isStreamingJson = true;
            }

            // Only send reasoning/text chunks to client if we haven't hit JSON part
            if (!isStreamingJson) {
                res.write(`data: ${JSON.stringify({ type: 'text', content: chunk })}\n\n`);
            }
        }

        // 4. Extract JSON from fullText using the specific markers
        const jsonMatch = fullText.match(/---JSON_START---([\s\S]*?)---JSON_END---/);

        if (!jsonMatch) {
            res.write(`data: ${JSON.stringify({ type: 'error', message: 'Failed to generate valid workflow JSON' })}\n\n`);
            return res.end();
        }

        let workflowData: WorkflowSnapshot;
        try {
            workflowData = JSON.parse(jsonMatch[1].trim());
        } catch (e) {
            console.error('Failed to parse JSON:', jsonMatch[1]);
            res.write(`data: ${JSON.stringify({ type: 'error', message: 'Failed to parse generated JSON' })}\n\n`);
            return res.end();
        }

        // 5. Save to Database
        const savedWorkflow = await saveWorkflowSnapshot(userId, workflowData, actions, workflowId);

        // 6. Send final success message with workflowId
        res.write(`data: ${JSON.stringify({ type: 'done', workflowId: savedWorkflow.id })}\n\n`);
        res.end();

    } catch (error) {
        console.error('Error in generateAIWorkflow:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.write(`data: ${JSON.stringify({ type: 'error', message: 'Internal server error during streaming' })}\n\n`);
            res.end();
        }
    }
};

/**
 * Saves a workflow snapshot to the database.
 * If workflowId is provided, it updates existing; otherwise creates new.
 */
async function saveWorkflowSnapshot(
    userId: string,
    data: WorkflowSnapshot,
    availableActions: any[],
    workflowId?: string
) {
    const actionMap = new Map(availableActions.map(a => [a.name, a]));

    if (workflowId) {
        // UPDATE EXISTING
        // Use a transaction to ensure atomicity
        return await prisma.$transaction(async (tx) => {
            // 1. Update workflow name if provided
            const workflow = await tx.workflow.update({
                where: { id: workflowId },
                data: {
                    ...(data.name && { name: data.name })
                }
            });

            // 2. Clear existing edges and nodes (simpler for AI generation)
            await tx.workflowEdge.deleteMany({ where: { workflowId } });
            await tx.workflowNode.deleteMany({ where: { workflowId } });

            // 3. Re-create nodes
            const tempIdToRealId: Record<string, string> = {};
            for (const n of data.nodes) {
                const action = actionMap.get(n.actionName);
                if (!action) continue;

                const node = await tx.workflowNode.create({
                    data: {
                        workflowId,
                        actionId: action.id,
                        config: n.config || action.configSchema,
                        positionX: n.position.x,
                        positionY: n.position.y
                    }
                });
                tempIdToRealId[n.tempId] = node.id;
            }

            // 4. Re-create edges
            for (const e of data.edges) {
                const sourceId = tempIdToRealId[e.sourceTempId];
                const targetId = tempIdToRealId[e.targetTempId];
                if (sourceId && targetId) {
                    await tx.workflowEdge.create({
                        data: {
                            workflowId,
                            sourceNodeId: sourceId,
                            targetNodeId: targetId
                        }
                    });
                }
            }

            return workflow;
        }, {
            maxWait: 5000,
            timeout: 30000
        });
    } else {
        // CREATE NEW
        return await prisma.$transaction(async (tx) => {
            // 1. Create workflow
            const workflow = await tx.workflow.create({
                data: {
                    name: data.name || 'AI Generated Workflow',
                    userId
                }
            });

            // 2. Create nodes
            const tempIdToRealId: Record<string, string> = {};
            for (const n of data.nodes) {
                const action = actionMap.get(n.actionName);
                if (!action) continue;

                const node = await tx.workflowNode.create({
                    data: {
                        workflowId: workflow.id,
                        actionId: action.id,
                        config: n.config || action.configSchema,
                        positionX: n.position.x,
                        positionY: n.position.y
                    }
                });
                tempIdToRealId[n.tempId] = node.id;
            }

            // 3. Create edges
            for (const e of data.edges) {
                const sourceId = tempIdToRealId[e.sourceTempId];
                const targetId = tempIdToRealId[e.targetTempId];
                if (sourceId && targetId) {
                    await tx.workflowEdge.create({
                        data: {
                            workflowId: workflow.id,
                            sourceNodeId: sourceId,
                            targetNodeId: targetId
                        }
                    });
                }
            }

            return workflow;
        }, {
            maxWait: 5000,
            timeout: 30000
        });
    }
}
