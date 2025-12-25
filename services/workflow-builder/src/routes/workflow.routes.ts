import { Router } from 'express';
import { createWorkflow, getWorkflow, getAllWorkflows, updateWorkflow, deleteWorkflow, updatePublishStatus } from '../controllers/workflow.controller';
import { addNode, getAllNodes, getNode, updateNode, deleteNode } from '../controllers/node.controller';
import { addEdge } from '../controllers/edge.controller';
import { getWorkflowFields, deleteWorkflowField } from '../controllers/field.controller';

const router = Router();

// Workflow routes
router.get('/', getAllWorkflows);
router.post('/', createWorkflow);
router.get('/:id', getWorkflow);
router.put('/:id', updateWorkflow);
router.patch('/:id/publish-status', updatePublishStatus);
router.delete('/:id', deleteWorkflow);

// Node routes
router.get('/:id/nodes', getAllNodes);
router.post('/:id/nodes', addNode);
router.get('/:id/nodes/:nodeId', getNode);
router.put('/:id/nodes/:nodeId', updateNode);
router.delete('/:id/nodes/:nodeId', deleteNode);

// Edge routes
router.post('/:id/edges', addEdge);

// Field routes (for downstream nodes to discover available fields)
router.get('/:id/fields', getWorkflowFields);
router.delete('/:id/fields/:fieldId', deleteWorkflowField);

export default router;

