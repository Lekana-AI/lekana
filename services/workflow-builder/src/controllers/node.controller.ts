import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateConfigKeys, mergeConfig } from '../utils/config.utils';

const prisma = new PrismaClient({});

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
            where: { workflowId },
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
                workflowId
            },
            include: {
                action: {
                    include: {
                        category: true
                    }
                },
                outgoing: true,
                incoming: true
            }
        });

        if (!node) {
            return res.status(404).json({ error: 'Node not found' });
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
                workflowId
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

        res.json(updatedNode);
    } catch (error) {
        console.error('Error updating node:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

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
                workflowId
            }
        });

        if (!existingNode) {
            return res.status(404).json({ error: 'Node not found' });
        }

        // Delete node (edges will cascade delete due to schema config)
        await prisma.workflowNode.delete({
            where: { id: nodeId }
        });

        res.status(200).json({ message: 'Node deleted successfully' });
    } catch (error) {
        console.error('Error deleting node:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
