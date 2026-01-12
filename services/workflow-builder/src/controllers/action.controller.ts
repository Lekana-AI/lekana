import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { generateUiSchema } from '../utils/config.utils';

/**
 * Transform action to include computed uiSchema
 */
function transformAction(action: any) {
    return {
        ...action,
        uiSchema: generateUiSchema(
            action.configSchema as Record<string, any>,
            action.configMeta as Record<string, any> | undefined
        )
    };
}

/**
 * Get all actions with their field schemas
 * Used by frontend to know what forms to render for each action type
 */
export const getAllActions = async (req: Request, res: Response) => {
    try {
        const actions = await prisma.action.findMany({
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        // Transform actions to include computed uiSchema
        const transformedActions = actions.map(transformAction);

        res.json(transformedActions);
    } catch (error) {
        console.error('Error fetching actions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get a specific action by ID
 */
export const getAction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const action = await prisma.action.findUnique({
            where: { id },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                }
            }
        });

        if (!action) {
            return res.status(404).json({ error: 'Action not found' });
        }

        res.json(transformAction(action));
    } catch (error) {
        console.error('Error fetching action:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get actions by category ID
 */
export const getActionsByCategory = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.params;

        const actions = await prisma.action.findMany({
            where: { categoryId },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        const transformedActions = actions.map(transformAction);

        res.json(transformedActions);
    } catch (error) {
        console.error('Error fetching actions by category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Create a new action
 */
export const createAction = async (req: Request, res: Response) => {
    try {
        const { name, description, icon, categoryId, inputType, outputType, configSchema, configMeta } = req.body;

        // Validate required fields
        if (!name || !categoryId || !outputType || !configSchema) {
            return res.status(400).json({
                error: 'name, categoryId, outputType, and configSchema are required'
            });
        }

        // Check if category exists
        const category = await prisma.actionCategory.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Check if action with same name already exists
        const existingAction = await prisma.action.findUnique({
            where: { name }
        });

        if (existingAction) {
            return res.status(409).json({ error: 'Action with this name already exists' });
        }

        const action = await prisma.action.create({
            data: {
                name,
                description: description || null,
                icon: icon || 'Zap',
                categoryId,
                inputType: inputType || null,
                outputType,
                configSchema,
                configMeta: configMeta || null
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                }
            }
        });

        res.status(201).json(transformAction(action));
    } catch (error) {
        console.error('Error creating action:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Update an existing action
 */
export const updateAction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, icon, categoryId, inputType, outputType, configSchema, configMeta } = req.body;

        // Check if action exists
        const existingAction = await prisma.action.findUnique({
            where: { id }
        });

        if (!existingAction) {
            return res.status(404).json({ error: 'Action not found' });
        }

        // If categoryId is being updated, verify the new category exists
        if (categoryId && categoryId !== existingAction.categoryId) {
            const category = await prisma.actionCategory.findUnique({
                where: { id: categoryId }
            });

            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
        }

        // If name is being updated, check for duplicates
        if (name && name !== existingAction.name) {
            const duplicateAction = await prisma.action.findUnique({
                where: { name }
            });

            if (duplicateAction) {
                return res.status(409).json({ error: 'Action with this name already exists' });
            }
        }

        const action = await prisma.action.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(icon && { icon }),
                ...(categoryId && { categoryId }),
                ...(inputType !== undefined && { inputType }),
                ...(outputType && { outputType }),
                ...(configSchema && { configSchema }),
                ...(configMeta !== undefined && { configMeta })
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                }
            }
        });

        res.json(transformAction(action));
    } catch (error) {
        console.error('Error updating action:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
