/**
 * Service Client
 * Handles communication with external microservices
 * 
 * Service URLs are now loaded from the database (Action.serviceUrl)
 * and passed through the workflow definition
 */

import axios, { AxiosError } from 'axios';

// ============================================
// Default Configuration
// ============================================

const DEFAULT_TIMEOUT = 60000;  // 30 seconds

// ============================================
// Standard Request/Response Types
// ============================================

export interface DocumentRef {
    url: string;
    filename: string;
    mimeType: string;
    size?: number;
}

export interface ServiceRequest {
    executionId: string;
    nodeId: string;
    workflowId: string;
    userId: string;
    input: {
        data?: any;
        documents?: DocumentRef[];
    };
    config: Record<string, any>;
    metadata?: {
        correlationId?: string;
        priority?: 'low' | 'normal' | 'high';
    };
}

export interface ServiceResponse {
    success: boolean;
    data: any;
    documents?: DocumentRef[];
    metadata: {
        processingTime: number;
        serviceVersion: string;
        [key: string]: any;
    };
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    requiresHumanReview?: boolean;
    humanReviewData?: {
        type: 'ocr' | 'classification' | 'segmentation';
        originalResult: any;
        confidence?: number;
    };
}

// ============================================
// Service Client Functions
// ============================================

/**
 * Call external microservice using a direct URL (from database)
 * This is the primary method - service URLs come from Action.serviceUrl in the database
 */
export async function callServiceWithUrl(
    serviceUrl: string,
    request: ServiceRequest,
    timeout: number = DEFAULT_TIMEOUT
): Promise<ServiceResponse> {
    const startTime = Date.now();

    try {
        console.log(`[ServiceClient] Calling service at ${serviceUrl}`);

        const response = await axios.post<ServiceResponse>(
            `${serviceUrl}/api/v1/process`,
            request,
            {
                timeout,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Correlation-Id': request.metadata?.correlationId || request.executionId,
                    'X-Workflow-Id': request.workflowId,
                    'X-Execution-Id': request.executionId
                }
            }
        );

        const processingTime = Date.now() - startTime;
        console.log(`[ServiceClient] Service at ${serviceUrl} completed in ${processingTime}ms`);

        return {
            ...response.data,
            metadata: {
                ...response.data.metadata,
                processingTime,
                serviceUrl
            }
        };

    } catch (error) {
        const processingTime = Date.now() - startTime;

        if (error instanceof AxiosError) {
            if (error.response) {
                console.error(`[ServiceClient] Service error response:`, error.response.status);
                return {
                    success: false,
                    data: null,
                    metadata: { processingTime, serviceVersion: 'unknown', serviceUrl },
                    error: {
                        code: `SERVICE_ERROR_${error.response.status}`,
                        message: error.response.data?.error?.message || error.message,
                        details: error.response.data
                    }
                };
            }

            if (error.code === 'ECONNREFUSED') {
                console.error(`[ServiceClient] Service unavailable at ${serviceUrl}`);
                return {
                    success: false,
                    data: null,
                    metadata: { processingTime, serviceVersion: 'unknown', serviceUrl },
                    error: {
                        code: 'SERVICE_UNAVAILABLE',
                        message: `Service is not available at ${serviceUrl}`,
                        details: { url: serviceUrl }
                    }
                };
            }

            if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
                console.error(`[ServiceClient] Service timeout at ${serviceUrl}`);
                return {
                    success: false,
                    data: null,
                    metadata: { processingTime, serviceVersion: 'unknown', serviceUrl },
                    error: {
                        code: 'SERVICE_TIMEOUT',
                        message: `Service timed out after ${timeout}ms`,
                        details: { timeout }
                    }
                };
            }
        }

        throw error;
    }
}

/**
 * Legacy function - returns error if called without serviceUrl
 * Actions should have serviceUrl set in the database
 * 
 * @deprecated Use callServiceWithUrl instead
 */
export async function callService(
    actionName: string,
    request: ServiceRequest
): Promise<ServiceResponse> {
    console.error(`[ServiceClient] Action "${actionName}" does not have a serviceUrl configured in the database`);

    return {
        success: false,
        data: null,
        metadata: {
            processingTime: 0,
            serviceVersion: 'unknown'
        },
        error: {
            code: 'SERVICE_URL_NOT_CONFIGURED',
            message: `Action "${actionName}" does not have a serviceUrl configured. Please update the Action in the workflow-builder database.`,
            details: { actionName }
        }
    };
}

/**
 * Check if an action has a valid service URL
 * Actions must have serviceUrl set in the database
 */
export function isActionSupported(actionName: string): boolean {
    // All actions are supported if they have serviceUrl in the database
    // This function is kept for backward compatibility
    console.warn(`[ServiceClient] isActionSupported is deprecated. Check action.serviceUrl instead.`);
    return true;
}

/**
 * List all supported actions
 * @deprecated Actions are now loaded from the database
 */
export function listSupportedActions(): string[] {
    console.warn(`[ServiceClient] listSupportedActions is deprecated. Query actions from the workflow-builder database.`);
    return [];
}

/**
 * Health check for a specific service URL
 */
export async function checkServiceHealth(serviceUrl: string): Promise<boolean> {
    try {
        await axios.get(`${serviceUrl}/health`, { timeout: 5000 });
        return true;
    } catch {
        return false;
    }
}

/**
 * Health check for multiple service URLs
 */
export async function checkServicesHealth(serviceUrls: string[]): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};

    for (const url of serviceUrls) {
        health[url] = await checkServiceHealth(url);
    }

    return health;
}
