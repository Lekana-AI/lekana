import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import classificationRoutes from './routes/classification.routes';
import processRoutes from './routes/process.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { logger } from './utils/logger.util';

export function createApp(): Application {
    const app = express();

    // Security middleware
    app.use(helmet());

    // CORS configuration
    app.use(cors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check endpoint
    app.get('/health', (_req, res) => {
        res.status(200).json({
            status: 'healthy',
            service: 'lekana-classification',
            version: process.env.SERVICE_VERSION || '1.0.0',
            timestamp: new Date().toISOString()
        });
    });

    // API routes
    app.use('/api/classify', classificationRoutes);
    app.use('/api/v1', processRoutes);

    // 404 handler
    app.use(notFoundHandler);

    // Global error handler
    app.use(errorHandler);

    logger.info('Express app configured');

    return app;
}
