/**
 * Service Client
 * Handles communication with external microservices
 * 
 * Service URLs are now loaded from the database (Action.serviceUrl)
 * and passed through the workflow definition
 * 
 * Cloud Run IAM Authentication:
 * - Automatically detects Cloud Run URLs (*.run.app)
 * - Generates ID tokens for authenticated service-to-service calls
 * - Skips auth for localhost (local development)
 */

import axios, { AxiosError } from 'axios';
import { GoogleAuth } from 'google-auth-library';
import { logService, logDebug, isLogEnabled } from './logger';

// ============================================
// Default Configuration
// ============================================

const DEFAULT_TIMEOUT = 60000;  // 60 seconds

// GoogleAuth instance for generating ID tokens
const auth = new GoogleAuth();

// Cache for ID token clients to avoid recreating them
const tokenClientCache = new Map<string, any>();

/**
 * Check if a URL is a Cloud Run URL that requires IAM authentication
 */
function isCloudRunUrl(url: string): boolean {
    return url.includes('.run.app');
}

/**
 * Get an ID token for authenticating with a Cloud Run service
 * Returns null if running locally or if unable to get token
 */
async function getIdTokenForService(serviceUrl: string): Promise<string | null> {
    // Skip for localhost
    if (serviceUrl.includes('localhost') || serviceUrl.includes('127.0.0.1')) {
        logDebug('Skipping IAM token for localhost', { serviceUrl });
        return null;
    }

    // Only get token for Cloud Run URLs
    if (!isCloudRunUrl(serviceUrl)) {
        return null;
    }

    try {
        // Extract the base URL (audience) for the ID token
        const url = new URL(serviceUrl);
        const audience = `${url.protocol}//${url.host}`;

        logDebug('Getting IAM token for Cloud Run', { serviceUrl, audience });

        // Check cache first
        if (!tokenClientCache.has(audience)) {
            const client = await auth.getIdTokenClient(audience);
            tokenClientCache.set(audience, client);
        }

        const client = tokenClientCache.get(audience);

        // Pass the URL to getRequestHeaders
        const headers = await client.getRequestHeaders(audience);
        const token = headers.Authorization?.replace('Bearer ', '') || headers.authorization?.replace('Bearer ', '');

        if (token) {
            logDebug('IAM token obtained successfully', { serviceUrl, tokenLength: token.length });
            return token;
        }

        // Fallback: try to get token from client credentials directly
        if (client.credentials && client.credentials.id_token) {
            logDebug('IAM token obtained from credentials', { serviceUrl });
            return client.credentials.id_token;
        }

        console.error(`[ServiceClient] Failed to get IAM token for ${serviceUrl} - no token in headers or credentials`);
        return null;
    } catch (error: any) {
        console.error(`[ServiceClient] Failed to get IAM token for ${serviceUrl}:`, error.message);
        return null;
    }
}

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

    logService('Calling external service', {
        serviceUrl,
        nodeId: request.nodeId,
        executionId: request.executionId,
        workflowId: request.workflowId
    });

    if (isLogEnabled()) {
        logDebug('Service request payload', {
            config: request.config,
            inputData: request.input?.data,
            documentCount: request.input?.documents?.length || 0
        });
    }

    try {
        // Get IAM token for Cloud Run services
        const idToken = await getIdTokenForService(serviceUrl);

        // Build headers
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'X-Correlation-Id': request.metadata?.correlationId || request.executionId,
            'X-Workflow-Id': request.workflowId,
            'X-Execution-Id': request.executionId
        };

        // Add Authorization header if we have an ID token
        if (idToken) {
            headers['Authorization'] = `Bearer ${idToken}`;
        }

        const response = await axios.post<ServiceResponse>(
            `${serviceUrl}/api/v1/process`,
            request,
            {
                timeout,
                headers
            }
        );

        const processingTime = Date.now() - startTime;

        logService('Service response received', {
            serviceUrl,
            success: response.data.success,
            processingTime: `${processingTime}ms`,
            hasRequireHumanReview: !!response.data.requiresHumanReview
        });

        if (isLogEnabled() && response.data.success) {
            logDebug('Service response data', {
                dataKeys: response.data.data ? Object.keys(response.data.data) : [],
                documentCount: response.data.documents?.length || 0,
                metadata: response.data.metadata
            });
        }

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
                const statusCode = error.response.status;
                logService('Service error response', {
                    serviceUrl,
                    statusCode,
                    nodeId: request.nodeId,
                    executionId: request.executionId,
                    processingTime: `${processingTime}ms`
                });
                console.error(`[ServiceClient] Service returned ${statusCode} from ${serviceUrl}`, {
                    nodeId: request.nodeId,
                    executionId: request.executionId,
                    errorData: error.response.data
                });

                return {
                    success: false,
                    data: null,
                    metadata: { processingTime, serviceVersion: 'unknown', serviceUrl },
                    error: {
                        code: `SERVICE_ERROR_${statusCode}`,
                        message: error.response.data?.error?.message || error.message,
                        details: {
                            statusCode,
                            data: error.response.data,
                            url: serviceUrl
                        }
                    }
                };
            }

            if (error.code === 'ECONNREFUSED') {
                console.error(`[ServiceClient] Service unavailable at ${serviceUrl}`, {
                    nodeId: request.nodeId,
                    executionId: request.executionId
                });
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
                console.error(`[ServiceClient] Service timeout at ${serviceUrl}`, {
                    nodeId: request.nodeId,
                    executionId: request.executionId,
                    timeout
                });
                return {
                    success: false,
                    data: null,
                    metadata: { processingTime, serviceVersion: 'unknown', serviceUrl },
                    error: {
                        code: 'SERVICE_TIMEOUT',
                        message: `Service timed out after ${timeout}ms`,
                        details: { timeout, url: serviceUrl }
                    }
                };
            }
        }

        // Log unexpected errors with full context
        console.error(`[ServiceClient] Unexpected error calling ${serviceUrl}:`, {
            nodeId: request.nodeId,
            executionId: request.executionId,
            error: error instanceof Error ? error.message : String(error)
        });
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
