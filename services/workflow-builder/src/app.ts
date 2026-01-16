import express from 'express';
import cors from 'cors';
import workflowRoutes from './routes/workflow.routes';
import actionRoutes from './routes/action.routes';
import categoryRoutes from './routes/category.routes';
import roleRoutes from './routes/role.routes';
import usageRoutes from './routes/usage.routes';
import { checkJwt, handleAuthError, extractUserInfo } from './middleware/auth.middleware';
import { getUserWorkflowRoles } from './controllers/role.controller';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Public Routes (no auth required)
app.get('/', (req, res) => {
    res.send('Workflow Editor Service is running');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Protected Routes - Apply Clerk JWT authentication
app.use('/workflows',
    checkJwt,
    handleAuthError, extractUserInfo, workflowRoutes);
app.use('/actions', checkJwt, handleAuthError, extractUserInfo, actionRoutes);
app.use('/categories', checkJwt, handleAuthError, extractUserInfo, categoryRoutes);
app.use('/usage', checkJwt, handleAuthError, extractUserInfo, usageRoutes);

// Role management routes (nested under workflows)
app.use('/workflows/:id/roles', checkJwt, handleAuthError, extractUserInfo, roleRoutes);

// User-specific role endpoints
app.get('/user/workflow-roles', checkJwt, handleAuthError, extractUserInfo, getUserWorkflowRoles);

// Global permissions endpoint (for role management UI)
import { getAvailablePermissions } from './controllers/role.controller';
app.get('/permissions/available', checkJwt, handleAuthError, extractUserInfo, getAvailablePermissions);

// Utility endpoints
import { testConnection } from './controllers/utils.controller';
app.post('/utils/test-connection', checkJwt, handleAuthError, extractUserInfo, testConnection);

export default app;




