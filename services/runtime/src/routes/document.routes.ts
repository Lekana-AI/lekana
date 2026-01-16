/**
 * Document Routes
 * API endpoints for document management
 */

import express from 'express';
import {
    listDocuments,
    getSignedUrl,
    listDocumentsByWorkflow
} from '../controllers/document.controller';

const router = express.Router();

// List all documents for the authenticated user
router.get('/', listDocuments);

// Get signed URL for a specific document
router.get('/:id/url', getSignedUrl);

// List documents for a specific workflow execution
router.get('/by-workflow/:workflowExecutionId', listDocumentsByWorkflow);

export default router;
