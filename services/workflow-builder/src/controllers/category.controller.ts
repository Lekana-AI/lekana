import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

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
