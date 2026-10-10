import { Router } from 'express';
import { createWorkflow, getWorkflow, getAllWorkflows, updateWorkflow, deleteWorkflow, updatePublishStatus, duplicateWorkflow } from '../controllers/workflow.controller';
import { generateAIWorkflow } from '../controllers/ai.controller';
import { addNode, getAllNodes, getNode, updateNode, deleteNode, duplicateNode } from '../controllers/node.controller';
import { addEdge, deleteEdge } from '../controllers/edge.controller';
import { getWorkflowFields, deleteWorkflowField } from '../controllers/field.controller';

const router = Router();

// Workflow routes
router.get('/', getAllWorkflows);
router.post('/', createWorkflow);
router.post('/generate', generateAIWorkflow);
router.get('/:id', getWorkflow);
router.put('/:id', updateWorkflow);
router.patch('/:id/publish-status', updatePublishStatus);
router.delete('/:id', deleteWorkflow);
router.post('/:id/duplicate', duplicateWorkflow);

// Node routes
router.get('/:id/nodes', getAllNodes);
router.post('/:id/nodes', addNode);
router.get('/:id/nodes/:nodeId', getNode);
router.put('/:id/nodes/:nodeId', updateNode);
router.delete('/:id/nodes/:nodeId', deleteNode);
router.post('/:id/nodes/:nodeId/duplicate', duplicateNode);

// Edge routes
router.post('/:id/edges', addEdge);
router.delete('/:id/edges/:edgeId', deleteEdge);

// Field routes (for downstream nodes to discover available fields)
router.get('/:id/fields', getWorkflowFields);
router.delete('/:id/fields/:fieldId', deleteWorkflowField);

export default router;

