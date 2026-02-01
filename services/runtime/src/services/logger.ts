/**
 * Logger Utility
 * Provides comprehensive logging when LOG_NEED=true in environment
 * 
 * Categories:
 * - [WORKFLOW] - Workflow configuration and setup
 * - [EXECUTION] - Node execution flow and status
 * - [SERVICE] - External microservice calls
 * - [DEBUG] - Data flow and debugging info
 */

// Check if detailed logging is enabled
const isLoggingEnabled = (): boolean => {
    return process.env.LOG_NEED === 'true';
};

// Format timestamp for logs
const timestamp = (): string => {
    return new Date().toISOString();
};

// Pretty print objects for logging
const formatData = (data: any): string => {
    try {
        return JSON.stringify(data, null, 2);
    } catch {
        return String(data);
    }
};

/**
 * Log workflow configuration details
 */
export const logWorkflow = (message: string, data?: any): void => {
    if (!isLoggingEnabled()) return;

    console.log(`\n[${timestamp()}] [WORKFLOW] ${message}`);
    if (data !== undefined) {
        console.log(formatData(data));
    }
};

/**
 * Log execution flow details
 */
export const logExecution = (message: string, data?: any): void => {
    if (!isLoggingEnabled()) return;

    console.log(`[${timestamp()}] [EXECUTION] ${message}`);
    if (data !== undefined) {
        console.log(formatData(data));
    }
};

/**
 * Log external service calls
 */
export const logService = (message: string, data?: any): void => {
    if (!isLoggingEnabled()) return;

    console.log(`[${timestamp()}] [SERVICE] ${message}`);
    if (data !== undefined) {
        console.log(formatData(data));
    }
};

/**
 * Log debug information
 */
export const logDebug = (message: string, data?: any): void => {
    if (!isLoggingEnabled()) return;

    console.log(`[${timestamp()}] [DEBUG] ${message}`);
    if (data !== undefined) {
        console.log(formatData(data));
    }
};

/**
 * Log info (general information)
 */
export const logInfo = (message: string, data?: any): void => {
    if (!isLoggingEnabled()) return;

    console.log(`[${timestamp()}] [INFO] ${message}`);
    if (data !== undefined) {
        console.log(formatData(data));
    }
};

/**
 * Log errors with context (always logs, regardless of LOG_NEED)
 */
export const logError = (message: string, error?: any, context?: any): void => {
    console.error(`[${timestamp()}] [ERROR] ${message}`);
    if (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        if (error instanceof Error && error.stack && isLoggingEnabled()) {
            console.error('Stack:', error.stack);
        }
    }
    if (context && isLoggingEnabled()) {
        console.error('Context:', formatData(context));
    }
};

/**
 * Log a separator line for visual clarity
 */
export const logSeparator = (title?: string): void => {
    if (!isLoggingEnabled()) return;

    if (title) {
        console.log(`\n${'='.repeat(20)} ${title} ${'='.repeat(20)}`);
    } else {
        console.log(`\n${'='.repeat(50)}`);
    }
};

/**
 * Log node execution details
 */
export const logNodeExecution = (
    nodeId: string,
    nodeName: string,
    status: string,
    details?: { input?: any; output?: any; config?: any; error?: any }
): void => {
    if (!isLoggingEnabled()) return;

    console.log(`[${timestamp()}] [EXECUTION] Node: ${nodeName} (${nodeId}) - Status: ${status}`);

    if (details) {
        if (details.config) {
            console.log('  Config:', formatData(details.config));
        }
        if (details.input !== undefined) {
            console.log('  Input:', formatData(details.input));
        }
        if (details.output !== undefined) {
            console.log('  Output:', formatData(details.output));
        }
        if (details.error) {
            console.log('  Error:', details.error);
        }
    }
};

/**
 * Check if logging is enabled (for conditional complex logging)
 */
export const isLogEnabled = isLoggingEnabled;
