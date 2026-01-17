/**
 * Document Routes
 * API endpoints for document management
 */

import express from 'express';
import {
    listDocuments,
    getSignedUrl,
    listDocumentsByWorkflow,
    listDocumentsByWorkflowId
} from '../controllers/document.controller';

const router = express.Router();

// List all documents for the authenticated user
router.get('/', listDocuments);

// Get signed URL for a specific document
router.get('/:id/url', getSignedUrl);

// List documents for a specific workflow execution
router.get('/by-workflow/:workflowExecutionId', listDocumentsByWorkflow);

// List documents for a specific workflow (across all executions)
router.get('/by-workflow-id/:workflowId', listDocumentsByWorkflowId);

export default router;
