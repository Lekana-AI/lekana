import { Router } from 'express';
import { getAllActions, getAction, getActionsByCategory } from '../controllers/action.controller';

const router = Router();

// Get all actions
router.get('/', getAllActions);

// Get specific action
router.get('/:id', getAction);

// Get actions by category
router.get('/category/:categoryId', getActionsByCategory);

export default router;
