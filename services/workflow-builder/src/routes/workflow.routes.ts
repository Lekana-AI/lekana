import { Router } from 'express';
import { createWorkflow, getWorkflow, getAllWorkflows } from '../controllers/workflow.controller';
import { addNode } from '../controllers/node.controller';
import { addEdge } from '../controllers/edge.controller';

const router = Router();

// Workflow routes
router.get('/', getAllWorkflows);
router.post('/', createWorkflow);
router.get('/:id', getWorkflow);

// Node routes
router.post('/:id/nodes', addNode);

// Edge routes
router.post('/:id/edges', addEdge);

export default router;
