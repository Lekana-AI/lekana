/**
 * Service Client
 * Handles communication with external microservices
 * 
 * All microservices must follow the standard request/response contract
 */

import axios, { AxiosError } from 'axios';

// ============================================
// Service Registry - Configure service URLs
// ============================================

interface ServiceConfig {
    url: string;
    timeout: number;
    retries: number;
}

// Service URL mapping - configure via environment variables
const SERVICES: Record<string, ServiceConfig> = {
    'upload': {
        url: process.env.UPLOAD_SERVICE_URL || 'http://localhost:4001',
        timeout: 60000,  // 60s for file uploads
        retries: 2
    },
    'classification': {
        url: process.env.CLASSIFICATION_SERVICE_URL || 'http://localhost:4002',
        timeout: 30000,
        retries: 2
    },
    'segmentation': {
        url: process.env.SEGMENTATION_SERVICE_URL || 'http://localhost:4003',
        timeout: 60000,  // Longer for multi-page processing
        retries: 1
    },
    'ocr': {
        url: process.env.OCR_SERVICE_URL || 'http://localhost:4004',
        timeout: 60000,
        retries: 2
    },
    'validation': {
        url: process.env.VALIDATION_SERVICE_URL || 'http://localhost:4005',
        timeout: 10000,
        retries: 3
    },
    'summarization': {
        url: process.env.SUMMARIZATION_SERVICE_URL || 'http://localhost:4006',
        timeout: 30000,
        retries: 1
    },
    'duplication': {
        url: process.env.DUPLICATION_SERVICE_URL || 'http://localhost:4007',
        timeout: 30000,
        retries: 2
    },
    'human-review': {
        url: process.env.HUMAN_REVIEW_SERVICE_URL || 'http://localhost:4008',
        timeout: 10000,
        retries: 3
    },
    'email': {
        url: process.env.EMAIL_SERVICE_URL || 'http://localhost:4009',
        timeout: 10000,
        retries: 3
    }
};

// Action name to service mapping (aliases)
const ACTION_SERVICE_MAP: Record<string, string> = {
    // Upload service
    'upload': 'upload',
    'upload files': 'upload',
    'file upload': 'upload',
    'invoice upload': 'upload',
    'document upload': 'upload',

    // Classification service
    'classification': 'classification',
    'classify': 'classification',
    'classify document': 'classification',
    'document classification': 'classification',

    // Segmentation service
    'segmentation': 'segmentation',
    'segment': 'segmentation',
    'segment document': 'segmentation',
    'document segmentation': 'segmentation',

    // OCR service
    'ocr': 'ocr',
    'ocr processing': 'ocr',
    'text extraction': 'ocr',
    'extract text': 'ocr',

    // Validation service
    'validation': 'validation',
    'validate': 'validation',
    'data validation': 'validation',

    // Summarization service
    'summarization': 'summarization',
    'summarize': 'summarization',
    'summary': 'summarization',

    // Duplication service
    'duplication': 'duplication',
    'duplicate detection': 'duplication',
    'check duplicates': 'duplication',

    // Human review service
    'human review': 'human-review',
    'human review ocr': 'human-review',
    'human review classification': 'human-review',
    'human review segments': 'human-review',

    // Email service
    'email': 'email',
    'send email': 'email',
    'email notification': 'email',
    'notify': 'email'
};

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
 * Get service key from action name
 */
function getServiceKey(actionName: string): string | null {
    const normalizedName = actionName.toLowerCase().trim();
    return ACTION_SERVICE_MAP[normalizedName] || null;
}

/**
 * Get service configuration
 */
function getServiceConfig(serviceKey: string): ServiceConfig | null {
    return SERVICES[serviceKey] || null;
}

/**
 * Check if an action is supported
 */
export function isActionSupported(actionName: string): boolean {
    return getServiceKey(actionName) !== null;
}

/**
 * List all supported actions
 */
export function listSupportedActions(): string[] {
    return Object.keys(ACTION_SERVICE_MAP);
}

/**
 * Call external microservice
 */
export async function callService(
    actionName: string,
    request: ServiceRequest
): Promise<ServiceResponse> {
    const serviceKey = getServiceKey(actionName);

    if (!serviceKey) {
        // Return mock success for unknown actions (for development)
        console.warn(`[ServiceClient] Unknown action: ${actionName}, returning mock success`);
        return {
            success: true,
            data: {
                message: `Action "${actionName}" not implemented yet`,
                input: request.input
            },
            metadata: {
                processingTime: 0,
                serviceVersion: 'mock-v1'
            }
        };
    }

    const serviceConfig = getServiceConfig(serviceKey);

    if (!serviceConfig) {
        throw new Error(`Service configuration not found for: ${serviceKey}`);
    }

    const startTime = Date.now();

    try {
        console.log(`[ServiceClient] Calling ${serviceKey} service at ${serviceConfig.url}`);

        const response = await axios.post<ServiceResponse>(
            `${serviceConfig.url}/api/v1/process`,
            request,
            {
                timeout: serviceConfig.timeout,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Correlation-Id': request.metadata?.correlationId || request.executionId,
                    'X-Workflow-Id': request.workflowId,
                    'X-Execution-Id': request.executionId
                }
            }
        );

        const processingTime = Date.now() - startTime;
        console.log(`[ServiceClient] ${serviceKey} completed in ${processingTime}ms`);

        return {
            ...response.data,
            metadata: {
                ...response.data.metadata,
                processingTime,
                serviceKey
            }
        };

    } catch (error) {
        const processingTime = Date.now() - startTime;

        if (error instanceof AxiosError) {
            // Service returned an error response
            if (error.response) {
                console.error(`[ServiceClient] ${serviceKey} error response:`, error.response.status);

                return {
                    success: false,
                    data: null,
                    metadata: {
                        processingTime,
                        serviceVersion: 'unknown',
                        serviceKey
                    },
                    error: {
                        code: `SERVICE_ERROR_${error.response.status}`,
                        message: error.response.data?.error?.message || error.message,
                        details: error.response.data
                    }
                };
            }

            // Network error or timeout
            if (error.code === 'ECONNREFUSED') {
                console.error(`[ServiceClient] ${serviceKey} service unavailable`);
                return {
                    success: false,
                    data: null,
                    metadata: {
                        processingTime,
                        serviceVersion: 'unknown',
                        serviceKey
                    },
                    error: {
                        code: 'SERVICE_UNAVAILABLE',
                        message: `${serviceKey} service is not available at ${serviceConfig.url}`,
                        details: { url: serviceConfig.url }
                    }
                };
            }

            if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
                console.error(`[ServiceClient] ${serviceKey} timeout`);
                return {
                    success: false,
                    data: null,
                    metadata: {
                        processingTime,
                        serviceVersion: 'unknown',
                        serviceKey
                    },
                    error: {
                        code: 'SERVICE_TIMEOUT',
                        message: `${serviceKey} service timed out after ${serviceConfig.timeout}ms`,
                        details: { timeout: serviceConfig.timeout }
                    }
                };
            }
        }

        // Unknown error
        throw error;
    }
}

/**
 * Health check for all services
 */
export async function checkServicesHealth(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};

    for (const [serviceKey, config] of Object.entries(SERVICES)) {
        try {
            await axios.get(`${config.url}/health`, { timeout: 5000 });
            health[serviceKey] = true;
        } catch {
            health[serviceKey] = false;
        }
    }

    return health;
}
