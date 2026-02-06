import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { validateConfigKeys, mergeConfig } from '../utils/config.utils';
import { touchWorkflow } from '../utils/workflow.utils';
import { encrypt, decrypt } from '../utils/crypto.utils';

export const addNode = async (req: Request, res: Response) => {
    try {
        const { id: workflowId } = req.params;
        const { actionId, config, positionX, positionY } = req.body;

        if (!actionId || positionX === undefined || positionY === undefined) {
            return res.status(400).json({ error: 'actionId, positionX, and positionY are required' });
        }

        // Fetch action to get its configSchema
        const action = await prisma.action.findUnique({
            where: { id: actionId }
        });

        if (!action) {
            return res.status(404).json({ error: 'Action not found' });
        }

        const actionConfigSchema = action.configSchema as Record<string, any>;

        // Validate node config keys if provided
        if (config && typeof config === 'object') {
            const { valid, invalidKeys } = validateConfigKeys(config, actionConfigSchema);
            if (!valid) {
                return res.status(400).json({
                    error: 'Invalid config keys',
                    invalidKeys,
                    validKeys: Object.keys(actionConfigSchema)
                });
            }
        }

        // Merge action defaults with node config (node values override defaults)
        const mergedConfig = mergeConfig(actionConfigSchema, config);

        // Encrypt sensitive fields
        if (mergedConfig.databaseUrl) {
            mergedConfig.databaseUrl = encrypt(mergedConfig.databaseUrl);
        }

        const node = await prisma.workflowNode.create({
            data: {
                workflowId,
                actionId,
                config: mergedConfig,
                positionX,
                positionY,
            },
            include: {
                action: true
            }
        });

        // Auto-sync workflow fields for actions that produce output fields
        console.log(`[addNode] About to call syncWorkflowFields for action: ${node.action.name}`);
        await syncWorkflowFields(workflowId, node.id, node.action.name, mergedConfig as Record<string, any>);

        // Touch workflow to update updatedAt
        await touchWorkflow(workflowId);

        res.status(201).json(node);
    } catch (error) {
        console.error('Error adding node:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get all nodes in a workflow
 */
export const getAllNodes = async (req: Request, res: Response) => {
    try {
        const { id: workflowId } = req.params;

        const nodes = await prisma.workflowNode.findMany({
            where: {
                workflowId,
                isDeleted: false
            },
            include: {
                action: {
                    include: {
                        category: true
                    }
                }
            },
            orderBy: {
                positionY: 'asc'
            }
        });

        // Mask sensitive fields for UI
        nodes.forEach(node => {
            if (node.config && (node.config as any).databaseUrl) {
                (node.config as any).databaseUrl = '[ENCRYPTED]';
            }
        });

        res.json(nodes);
    } catch (error) {
        console.error('Error fetching nodes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get a single node by ID
 */
export const getNode = async (req: Request, res: Response) => {
    try {
        const { id: workflowId, nodeId } = req.params;

        const node = await prisma.workflowNode.findFirst({
            where: {
                id: nodeId,
                workflowId,
                isDeleted: false
            },
            include: {
                action: {
                    include: {
                        category: true
                    }
                },
                outgoing: {
                    where: { isDeleted: false }
                },
                incoming: {
                    where: { isDeleted: false }
                }
            }
        });

        if (!node) {
            return res.status(404).json({ error: 'Node not found' });
        }

        // Mask sensitive fields for UI
        if (node.config && (node.config as any).databaseUrl) {
            (node.config as any).databaseUrl = '[ENCRYPTED]';
        }

        res.json(node);
    } catch (error) {
        console.error('Error fetching node:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Update a node (position and/or config)
 */
export const updateNode = async (req: Request, res: Response) => {
    try {
        const { id: workflowId, nodeId } = req.params;
        const { config, positionX, positionY } = req.body;

        // Check if node exists and belongs to workflow
        const existingNode = await prisma.workflowNode.findFirst({
            where: {
                id: nodeId,
                workflowId,
                isDeleted: false
            },
            include: {
                action: true
            }
        });

        if (!existingNode) {
            return res.status(404).json({ error: 'Node not found' });
        }

        // Validate config keys if provided
        if (config && typeof config === 'object') {
            const actionConfigSchema = existingNode.action.configSchema as Record<string, any>;
            const { valid, invalidKeys } = validateConfigKeys(config, actionConfigSchema);
            if (!valid) {
                return res.status(400).json({
                    error: 'Invalid config keys',
                    invalidKeys,
                    validKeys: Object.keys(actionConfigSchema)
                });
            }
        }

        // Merge existing config with new config if provided
        const updatedConfig = config
            ? mergeConfig(existingNode.config as Record<string, any>, config)
            : undefined;

        // Encrypt sensitive fields
        if (updatedConfig && updatedConfig.databaseUrl) {
            updatedConfig.databaseUrl = encrypt(updatedConfig.databaseUrl);
        }

        const updatedNode = await prisma.workflowNode.update({
            where: { id: nodeId },
            data: {
                ...(positionX !== undefined && { positionX }),
                ...(positionY !== undefined && { positionY }),
                ...(updatedConfig && { config: updatedConfig })
            },
            include: {
                action: {
                    include: {
                        category: true
                    }
                }
            }
        });

        // Auto-sync workflow fields for actions that produce output fields
        console.log(`[updateNode] About to call syncWorkflowFields for action: ${updatedNode.action.name}`);
        await syncWorkflowFields(workflowId, nodeId, updatedNode.action.name, updatedNode.config as Record<string, any>);

        // Touch workflow to update updatedAt
        await touchWorkflow(workflowId);

        // Mask sensitive fields for UI response
        if (updatedNode.config && (updatedNode.config as any).databaseUrl) {
            (updatedNode.config as any).databaseUrl = '[ENCRYPTED]';
        }

        res.json(updatedNode);
    } catch (error) {
        console.error('Error updating node:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Duplicate a node within the same workflow
 */
export const duplicateNode = async (req: Request, res: Response) => {
    try {
        const { id: workflowId, nodeId } = req.params;

        // Check if node exists and belongs to workflow
        const existingNode = await prisma.workflowNode.findFirst({
            where: {
                id: nodeId,
                workflowId,
                isDeleted: false
            },
            include: {
                action: true
            }
        });

        if (!existingNode) {
            return res.status(404).json({ error: 'Node not found' });
        }

        // Create new node with offset position
        const newNode = await prisma.workflowNode.create({
            data: {
                workflowId,
                actionId: existingNode.actionId,
                config: existingNode.config as any,
                positionX: existingNode.positionX + 20,
                positionY: existingNode.positionY + 20,
            },
            include: {
                action: true
            }
        });

        // Auto-sync workflow fields for the new node
        await syncWorkflowFields(workflowId, newNode.id, newNode.action.name, newNode.config as Record<string, any>);

        // Touch workflow to update updatedAt
        await touchWorkflow(workflowId);

        res.status(201).json(newNode);
    } catch (error) {
        console.error('Error duplicating node:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Sync workflow fields when a node's config changes
 * This auto-populates WorkflowField table based on node's output fields
 */
async function syncWorkflowFields(
    workflowId: string,
    nodeId: string,
    actionName: string,
    config: Record<string, any>
) {
    console.log(`[WorkflowFields] syncWorkflowFields called:`);
    console.log(`  - workflowId: ${workflowId}`);
    console.log(`  - nodeId: ${nodeId}`);
    console.log(`  - actionName: ${actionName}`);
    console.log(`  - config:`, JSON.stringify(config, null, 2));

    // Define which actions produce fields and how to extract them
    const fieldProducers: Record<string, { configKey: string; pathTemplate: string }> = {
        'OCR': { configKey: 'extractFields', pathTemplate: 'documents[].result.{field}' },
        // Add more actions here as needed
    };

    const producer = fieldProducers[actionName];
    if (!producer) {
        console.log(`[WorkflowFields] Action "${actionName}" is not a field producer, skipping`);
        return;
    }

    console.log(`[WorkflowFields] Found producer for "${actionName}": configKey="${producer.configKey}"`);

    const fields = config[producer.configKey];
    console.log(`[WorkflowFields] Fields from config[${producer.configKey}]:`, fields);

    if (!Array.isArray(fields)) {
        console.log(`[WorkflowFields] "${producer.configKey}" is not an array, skipping. Type: ${typeof fields}`);
        return;
    }

    if (fields.length === 0) {
        console.log(`[WorkflowFields] "${producer.configKey}" is empty, skipping`);
        return;
    }

    // Clear old fields from this node
    console.log(`[WorkflowFields] Deleting old fields for node ${nodeId}...`);
    const deleteResult = await prisma.workflowField.deleteMany({
        where: { sourceNodeId: nodeId }
    });
    console.log(`[WorkflowFields] Deleted ${deleteResult.count} old fields`);

    // Insert new fields - supports both string[] and {fieldName, fieldPrompt}[] formats
    console.log(`[WorkflowFields] Inserting ${fields.length} new fields...`);
    for (const field of fields) {
        let fieldName: string;

        // Handle old format (string), new format ({fieldName, fieldPrompt}), and keyValue UI ({key, value})
        if (typeof field === 'string') {
            fieldName = field;
        } else if (typeof field === 'object' && field !== null && (field.fieldName || field.key)) {
            fieldName = field.fieldName || field.key;
        } else {
            console.log(`[WorkflowFields] Skipping invalid field:`, field);
            continue;
        }

        const fieldPath = producer.pathTemplate.replace('{field}', fieldName);
        console.log(`[WorkflowFields] Creating field: ${fieldName} -> ${fieldPath}`);

        await prisma.workflowField.create({
            data: {
                workflowId,
                sourceNodeId: nodeId,
                fieldName,
                fieldPath
            }
        });
    }

    console.log(`[WorkflowFields] ✅ Synced ${fields.length} fields for ${actionName} node ${nodeId}`);
}

/**
 * Delete a node
 */
export const deleteNode = async (req: Request, res: Response) => {
    try {
        const { id: workflowId, nodeId } = req.params;

        // Check if node exists and belongs to workflow
        const existingNode = await prisma.workflowNode.findFirst({
            where: {
                id: nodeId,
                workflowId,
                isDeleted: false
            }
        });

        if (!existingNode) {
            return res.status(404).json({ error: 'Node not found' });
        }

        // Soft delete node
        await prisma.workflowNode.update({
            where: { id: nodeId },
            data: { isDeleted: true }
        });

        await prisma.workflowEdge.updateMany({
            where: {
                OR: [
                    { sourceNodeId: nodeId },
                    { targetNodeId: nodeId }
                ]
            },
            data: { isDeleted: true }
        });

        // Touch workflow to update updatedAt
        await touchWorkflow(workflowId);

        res.status(200).json({ message: 'Node deleted successfully' });
    } catch (error) {
        console.error('Error deleting node:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
