import { Router } from 'express';
import { getAllActions, getAction, getActionsByCategory, createAction, updateAction } from '../controllers/action.controller';

const router = Router();

// Get all actions
router.get('/', getAllActions);

// Create a new action
router.post('/', createAction);

// Get specific action
router.get('/:id', getAction);

// Update an action
router.put('/:id', updateAction);

// Get actions by category
router.get('/category/:categoryId', getActionsByCategory);

export default router;

