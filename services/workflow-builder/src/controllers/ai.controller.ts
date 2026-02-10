import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { streamWorkflowGeneration, WorkflowSnapshot } from '../utils/ai.utils';

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
        const START_MARKER = '---JSON_START---';
        const END_MARKER = '---JSON_END---';

        let reasoningSentLength = 0;
        const BUFFER_SIZE = 20; // Enough to hold '---JSON_START---' and some change

        try {
            for await (const chunk of stream) {
                fullText += chunk;

                if (!isStreamingJson) {
                    const markerIndex = fullText.indexOf(START_MARKER);
                    const markdownIndex = fullText.search(/```json|```/);
                    const braceIndex = fullText.search(/\n\s*\{/);

                    const triggerIndex = [markerIndex, markdownIndex, braceIndex]
                        .filter(i => i !== -1)
                        .sort((a, b) => a - b)[0];

                    if (triggerIndex !== undefined) {
                        isStreamingJson = true;

                        // Flush everything from reasoningSentLength to triggerIndex
                        const toSend = fullText.slice(reasoningSentLength, triggerIndex);
                        if (toSend.trim()) {
                            res.write(`data: ${JSON.stringify({ type: 'text', content: toSend })}\n\n`);
                        }
                        reasoningSentLength = triggerIndex;
                    } else {
                        // We haven't found a trigger yet. 
                        // Send everything up to (fullText.length - BUFFER_SIZE) to avoid leaking partial markers
                        const safeLimit = Math.max(0, fullText.length - BUFFER_SIZE);
                        if (safeLimit > reasoningSentLength) {
                            const toSend = fullText.slice(reasoningSentLength, safeLimit);
                            res.write(`data: ${JSON.stringify({ type: 'text', content: toSend })}\n\n`);
                            reasoningSentLength = safeLimit;
                        }
                    }
                }
            }
        } catch (streamError) {
            console.error('Error during AI stream iteration:', streamError);
            res.write(`data: ${JSON.stringify({ type: 'error', message: 'Stream processing error' })}\n\n`);
            return res.end();
        }

        // Before moving to JSON extraction, flush any remaining reasoning if we NEVER hit isStreamingJson (error case)
        // or if there's a tiny bit of reasoning left before the trigger that was in the buffer
        if (!isStreamingJson && reasoningSentLength < fullText.length) {
            const finalReasoning = fullText.slice(reasoningSentLength).trim();
            if (finalReasoning) {
                res.write(`data: ${JSON.stringify({ type: 'text', content: finalReasoning })}\n\n`);
            }
        }

        // console.log('--- FULL AI RESPONSE ---');
        // console.log(fullText);
        // console.log('-------------------------');

        // 4. Extract JSON from fullText using a more robust approach
        let jsonContent = '';
        let startIndex = fullText.indexOf(START_MARKER);

        if (startIndex !== -1) {
            startIndex += START_MARKER.length;
        } else {
            // FALLBACK: Find the first curly bracket if marker is missing
            const curlyIndex = fullText.indexOf('{');
            if (curlyIndex !== -1) {
                startIndex = curlyIndex;
            }
        }

        if (startIndex !== -1) {
            const endIndex = fullText.indexOf(END_MARKER, startIndex);
            if (endIndex !== -1) {
                jsonContent = fullText.slice(startIndex, endIndex).trim();
            } else {
                // Fallback: AI might have missed the end marker or wrapped it in markdown
                // Try to find the last closing brace if END_MARKER is missing
                const lastBraceIndex = fullText.lastIndexOf('}');
                if (lastBraceIndex > startIndex) {
                    jsonContent = fullText.slice(startIndex, lastBraceIndex + 1).trim();
                } else {
                    jsonContent = fullText.slice(startIndex).trim();
                }
            }
        }

        // Final cleanup of markdown leakage
        jsonContent = jsonContent
            .replace(/^```json\s*/g, '')
            .replace(/^```\s*/g, '')
            .replace(/\s*```$/g, '')
            .trim();

        if (!jsonContent) {
            res.write(`data: ${JSON.stringify({ type: 'error', message: 'Failed to generate valid workflow JSON' })}\n\n`);
            return res.end();
        }

        let workflowData: WorkflowSnapshot;
        try {
            workflowData = JSON.parse(jsonContent);
        } catch (e) {
            console.error('Failed to parse JSON:', jsonContent);
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
