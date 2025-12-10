import { Router } from 'express';
import { getAllCategories, getCategory } from '../controllers/category.controller';

const router = Router();

// Get all categories
router.get('/', getAllCategories);

// Get specific category
router.get('/:id', getCategory);

export default router;
