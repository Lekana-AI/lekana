import { Request, Response } from 'express';
import prisma from '../lib/prisma';

/**
 * Get all categories
 */
export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.actionCategory.findMany({
            include: {
                actions: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get a specific category with its actions
 */
export const getCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const category = await prisma.actionCategory.findUnique({
            where: { id },
            include: {
                actions: true
            }
        });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get categories with actions formatted for sidebar/action panel
 * Returns format: [{ category: string, actions: [{ id, label, icon }] }]
 */
export const getCategoriesWithActions = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.actionCategory.findMany({
            include: {
                actions: {
                    select: {
                        id: true,
                        name: true,
                        icon: true
                    },
                    orderBy: {
                        name: 'asc'
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        // Transform to the requested format
        const result = categories.map(cat => ({
            category: cat.name,
            actions: cat.actions.map(action => ({
                id: action.id,
                label: action.name,
                icon: action.icon
            }))
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching categories with actions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
