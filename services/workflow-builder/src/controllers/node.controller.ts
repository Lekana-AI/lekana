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
