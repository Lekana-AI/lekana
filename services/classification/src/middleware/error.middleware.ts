import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.util';

export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

/**
 * Global error handling middleware
 */
export function errorHandler(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    // Log error
    logger.error('Error occurred', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Determine status code
    const statusCode = err.statusCode || 500;
    const isOperational = err.isOperational !== undefined ? err.isOperational : false;

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            message: isOperational ? err.message : 'Internal server error',
            ...(process.env.NODE_ENV === 'development' && {
                stack: err.stack,
                details: err
            })
        }
    });
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(req: Request, res: Response): void {
    logger.warn('Route not found', { path: req.path, method: req.method });

    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.method} ${req.path} not found`
        }
    });
}

/**
 * Creates an operational error (expected error)
 */
export function createError(message: string, statusCode: number = 400): AppError {
    const error = new Error(message) as AppError;
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
}
