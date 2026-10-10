import { Router } from 'express';
import { getAllCategories, getCategory, getCategoriesWithActions } from '../controllers/category.controller';

const router = Router();

// Get all categories
router.get('/', getAllCategories);

// Get categories with actions formatted for sidebar
router.get('/with-actions', getCategoriesWithActions);

// Get specific category
router.get('/:id', getCategory);

export default router;
