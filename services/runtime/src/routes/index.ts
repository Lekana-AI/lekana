import { Router } from 'express';
import { checkJwt, handleAuthError, extractUserInfo } from '../middleware/auth.middleware';
import { checkApiKey } from '../middleware/apikey.middleware';
import * as executionController from '../controllers/execution.controller';
import * as workflowController from '../controllers/workflow.controller';

const router = Router();

// JWT auth middleware (for user-facing endpoints)
const jwtAuth = [checkJwt, handleAuthError, extractUserInfo];

// ========================================
// Workflow Publishing & Management (JWT auth)
// ========================================
router.post('/publish', jwtAuth, workflowController.publishWorkflow);
router.get('/workflows/:workflowId', jwtAuth, workflowController.getPublishedWorkflow);
router.get('/workflows/:workflowId/keys', jwtAuth, workflowController.listApiKeys);
router.post('/workflows/:workflowId/keys', jwtAuth, workflowController.createApiKey);
router.delete('/workflows/:workflowId/keys/:keyId', jwtAuth, workflowController.revokeApiKey);

// ========================================
// Workflow Execution (API Key auth)
// ========================================
router.post('/workflows/:workflowId/run', checkApiKey, workflowController.runWorkflow);

// ========================================
// Execution Status & Logs (JWT auth)
// ========================================
router.get('/executions', 
    //jwtAuth, 
    executionController.getExecutions);
router.get('/executions/:id', 
    //jwtAuth, 
    executionController.getExecution);
router.get('/executions/:id/logs', 
    //jwtAuth,
    executionController.getExecutionLogs);

// Note: Action endpoints have been removed.
// Actions are now external microservices called by the engine.
// See src/services/service-client.ts for the service registry.

export default router;

