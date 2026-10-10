import { compareTwoStrings } from 'string-similarity';
import { Workflow } from '../models/workflow.model';
import { Category } from '../types';
import { logger } from '../utils/logger.util';

export class CategoryService {
    private static readonly SIMILARITY_THRESHOLD = 0.85;

    /**
     * Normalizes a label for comparison (lowercase, trim, singularize basic cases)
     */
    private normalizeLabel(label: string): string {
        let normalized = label.toLowerCase().trim();

        // Basic singularization (remove trailing 's')
        if (normalized.endsWith('s') && normalized.length > 3) {
            normalized = normalized.slice(0, -1);
        }

        return normalized;
    }

    /**
     * Finds a similar existing category or returns null
     */
    public findSimilarCategory(
        newLabel: string,
        existingCategories: Category[]
    ): Category | null {
        const normalizedNew = this.normalizeLabel(newLabel);

        for (const category of existingCategories) {
            // Exact match on normalized labels
            if (category.normalizedLabel === normalizedNew) {
                logger.debug('Found exact match', { newLabel, existing: category.label });
                return category;
            }

            // Fuzzy match using string similarity
            const similarity = compareTwoStrings(normalizedNew, category.normalizedLabel);
            if (similarity >= CategoryService.SIMILARITY_THRESHOLD) {
                logger.debug('Found fuzzy match', {
                    newLabel,
                    existing: category.label,
                    similarity
                });
                return category;
            }
        }

        return null;
    }

    /**
     * Gets all categories for a workflow
     */
    public async getWorkflowCategories(workflowId: string): Promise<Category[]> {
        try {
            const workflow = await Workflow.findOne({ workflowId });
            return workflow?.categories || [];
        } catch (error) {
            logger.error('Error fetching workflow categories', error);
            throw new Error('Failed to fetch workflow categories');
        }
    }

    /**
     * Adds a new category to a workflow or increments count if similar exists
     */
    public async addCategoryToWorkflow(
        workflowId: string,
        label: string
    ): Promise<Category> {
        try {
            const normalizedLabel = this.normalizeLabel(label);

            // Find or create workflow
            let workflow = await Workflow.findOne({ workflowId });

            if (!workflow) {
                workflow = new Workflow({
                    workflowId,
                    categories: []
                });
            }

            // Check if similar category exists
            const existingCategory = this.findSimilarCategory(label, workflow.categories);

            if (existingCategory) {
                // Increment count for existing category
                const categoryIndex = workflow.categories.findIndex(
                    c => c.normalizedLabel === existingCategory.normalizedLabel
                );

                if (categoryIndex !== -1) {
                    workflow.categories[categoryIndex].count += 1;
                    await workflow.save();
                    logger.info('Incremented existing category count', {
                        workflowId,
                        category: existingCategory.label
                    });
                    return workflow.categories[categoryIndex];
                }
            }

            // Add new category
            const newCategory: Category = {
                label,
                normalizedLabel,
                firstSeenAt: new Date(),
                count: 1
            };

            workflow.categories.push(newCategory);
            await workflow.save();

            logger.info('Added new category to workflow', { workflowId, category: label });
            return newCategory;
        } catch (error) {
            logger.error('Error adding category to workflow', error);
            throw new Error('Failed to add category to workflow');
        }
    }

    /**
     * Gets or creates a category, ensuring deduplication
     */
    public async getOrCreateCategory(
        workflowId: string,
        label: string
    ): Promise<{ category: Category; isNew: boolean }> {
        const existingCategories = await this.getWorkflowCategories(workflowId);
        const similarCategory = this.findSimilarCategory(label, existingCategories);

        if (similarCategory) {
            // Increment count
            await this.addCategoryToWorkflow(workflowId, similarCategory.label);
            return { category: similarCategory, isNew: false };
        }

        // Create new category
        const newCategory = await this.addCategoryToWorkflow(workflowId, label);
        return { category: newCategory, isNew: true };
    }
}

export const categoryService = new CategoryService();
