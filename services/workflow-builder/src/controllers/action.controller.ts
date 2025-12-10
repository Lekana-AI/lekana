import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

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

        res.json(actions);
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

        res.json(action);
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

        res.json(actions);
    } catch (error) {
        console.error('Error fetching actions by category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
