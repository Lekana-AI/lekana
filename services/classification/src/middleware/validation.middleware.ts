import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.util';

export interface ValidationError {
    field: string;
    message: string;
}

/**
 * Validates custom classification request
 */
export function validateCustomClassifyRequest(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const errors: ValidationError[] = [];
    const { workflowId, documents, customLabels } = req.body;

    // Validate workflowId
    if (!workflowId || typeof workflowId !== 'string') {
        errors.push({ field: 'workflowId', message: 'workflowId is required and must be a string' });
    }

    // Validate documents array
    if (!Array.isArray(documents) || documents.length === 0) {
        errors.push({ field: 'documents', message: 'documents must be a non-empty array' });
    } else {
        documents.forEach((doc, index) => {
            if (!doc.url || typeof doc.url !== 'string') {
                errors.push({ field: `documents[${index}].url`, message: 'url is required and must be a string' });
            }
            if (!doc.filename || typeof doc.filename !== 'string') {
                errors.push({ field: `documents[${index}].filename`, message: 'filename is required and must be a string' });
            }
            if (!doc.mimeType || typeof doc.mimeType !== 'string') {
                errors.push({ field: `documents[${index}].mimeType`, message: 'mimeType is required and must be a string' });
            }
            // Validate URL format
            if (doc.url && !isValidUrl(doc.url)) {
                errors.push({ field: `documents[${index}].url`, message: 'url must be a valid URL' });
            }
        });
    }

    // Validate customLabels
    if (!Array.isArray(customLabels) || customLabels.length === 0) {
        errors.push({ field: 'customLabels', message: 'customLabels must be a non-empty array' });
    } else if (!customLabels.every(label => typeof label === 'string')) {
        errors.push({ field: 'customLabels', message: 'all customLabels must be strings' });
    }

    // Validate optional confidenceThreshold
    if (req.body.confidenceThreshold !== undefined) {
        const threshold = req.body.confidenceThreshold;
        if (typeof threshold !== 'number' || threshold < 0 || threshold > 1) {
            errors.push({ field: 'confidenceThreshold', message: 'confidenceThreshold must be a number between 0 and 1' });
        }
    }

    if (errors.length > 0) {
        logger.warn('Custom classify request validation failed', { errors });
        res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors
        });
        return;
    }

    next();
}

/**
 * Validates auto-classification request
 */
export function validateAutoClassifyRequest(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const errors: ValidationError[] = [];
    const { workflowId, documents } = req.body;

    // Validate workflowId
    if (!workflowId || typeof workflowId !== 'string') {
        errors.push({ field: 'workflowId', message: 'workflowId is required and must be a string' });
    }

    // Validate documents array
    if (!Array.isArray(documents) || documents.length === 0) {
        errors.push({ field: 'documents', message: 'documents must be a non-empty array' });
    } else {
        documents.forEach((doc, index) => {
            if (!doc.url || typeof doc.url !== 'string') {
                errors.push({ field: `documents[${index}].url`, message: 'url is required and must be a string' });
            }
            if (!doc.filename || typeof doc.filename !== 'string') {
                errors.push({ field: `documents[${index}].filename`, message: 'filename is required and must be a string' });
            }
            if (!doc.mimeType || typeof doc.mimeType !== 'string') {
                errors.push({ field: `documents[${index}].mimeType`, message: 'mimeType is required and must be a string' });
            }
            // Validate URL format
            if (doc.url && !isValidUrl(doc.url)) {
                errors.push({ field: `documents[${index}].url`, message: 'url must be a valid URL' });
            }
        });
    }

    // Validate optional confidenceThreshold
    if (req.body.confidenceThreshold !== undefined) {
        const threshold = req.body.confidenceThreshold;
        if (typeof threshold !== 'number' || threshold < 0 || threshold > 1) {
            errors.push({ field: 'confidenceThreshold', message: 'confidenceThreshold must be a number between 0 and 1' });
        }
    }

    if (errors.length > 0) {
        logger.warn('Auto classify request validation failed', { errors });
        res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors
        });
        return;
    }

    next();
}

/**
 * Helper to validate URL format
 */
function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
