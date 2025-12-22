// Load environment variables FIRST (before any other imports)
import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { database } from './config/database';
import { logger } from './utils/logger.util';

const PORT = process.env.PORT || 4002;

async function startServer(): Promise<void> {
    try {
        // Create Express app
        const app = createApp();

        // Start server
        const server = app.listen(PORT, async () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info(`Health check: http://localhost:${PORT}/health`);
            logger.info(`Classify (custom): POST http://localhost:${PORT}/api/classify/custom`);
            logger.info(`Classify (auto): POST http://localhost:${PORT}/api/classify/auto`);

            try {
                // Connect to database after server started
                logger.info('Connecting to database...');
                await database.connect();
                logger.info('Database connected successfully');
            } catch (dbError) {
                logger.error('Failed to connect to database on startup', dbError);
                // We keep the server running so Cloud Run doesn't enter a crash loop immediately,
                // but health checks or subsequent requests will fail if DB is critical.
            }
        });

        // Graceful shutdown
        const gracefulShutdown = async (signal: string) => {
            logger.info(`${signal} received, shutting down gracefully...`);

            server.close(async () => {
                logger.info('HTTP server closed');

                try {
                    await database.disconnect();
                    logger.info('Database disconnected');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during graceful shutdown', error);
                    process.exit(1);
                }
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        // Handle shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle uncaught errors
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception', error);
            gracefulShutdown('uncaughtException');
        });

        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection', { reason, promise });
            gracefulShutdown('unhandledRejection');
        });

    } catch (error) {
        logger.error('Failed to start server', error);
        process.exit(1);
    }
}

// Start the server
startServer();
