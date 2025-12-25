import express from 'express';
import cors from 'cors';
import workflowRoutes from './routes/workflow.routes';
import actionRoutes from './routes/action.routes';
import categoryRoutes from './routes/category.routes';
import { checkJwt, handleAuthError, extractUserInfo } from './middleware/auth.middleware';

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

// Public Routes - Actions list (for service-to-service lookups)
app.use('/actions', actionRoutes);

// Public Routes - Categories with actions
app.use('/categories', categoryRoutes);

// Protected Routes - Apply Clerk JWT authentication
app.use('/workflows',
    checkJwt,
    handleAuthError, extractUserInfo, workflowRoutes);

export default app;



