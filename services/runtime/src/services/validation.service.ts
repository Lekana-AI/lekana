/**
 * Workflow Validation Service
 * Validates workflow nodes before publishing to ensure required fields are filled
 */

interface ConfigMetaField {
    type: string;
    label: string;
    required?: boolean;
    visibleWhen?: Record<string, string>;
}

interface ConfigMeta {
    [fieldName: string]: ConfigMetaField;
}

export interface ValidationError {
    nodeId: string;
    nodeName: string;
    actionName: string;
    field: string;
    fieldLabel: string;
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

interface WorkflowNode {
    id: string;
    config: Record<string, any>;
    action?: {
        id: string;
        name: string;
        configMeta?: ConfigMeta;
    };
}

/**
 * Check if a field value is considered "filled" based on its type
 */
function isFieldFilled(value: any, fieldType: string): boolean {
    if (value === null || value === undefined) {
        return false;
    }

    switch (fieldType) {
        case 'text':
        case 'select':
        case 'dynamicSelect':
        case 'dynamicSelectValues':
            return typeof value === 'string' && value.trim() !== '';

        case 'number':
            return typeof value === 'number' && !isNaN(value);

        case 'checkbox':
            // Checkbox is always valid - false is a valid choice
            return true;

        case 'keyValue':
            // Array should have at least one non-empty entry
            if (!Array.isArray(value)) return false;
            return value.length > 0 && value.some((item: any) => {
                if (typeof item === 'object' && item !== null) {
                    return Object.values(item).some(v => v !== '' && v !== null && v !== undefined);
                }
                return item !== '' && item !== null && item !== undefined;
            });

        case 'checkbox-group':
            return Array.isArray(value) && value.length > 0;

        case 'hidden':
            // Hidden fields are auto-generated, always valid
            return true;

        default:
            // For unknown types, just check if not empty
            return value !== '' && value !== null && value !== undefined;
    }
}

/**
 * Check if a field should be visible based on visibleWhen conditions
 */
function isFieldVisible(configMeta: ConfigMetaField, nodeConfig: Record<string, any>): boolean {
    if (!configMeta.visibleWhen) {
        return true; // No conditions, always visible
    }

    // Check all conditions (all must match for field to be visible)
    for (const [field, expectedValue] of Object.entries(configMeta.visibleWhen)) {
        if (nodeConfig[field] !== expectedValue) {
            return false;
        }
    }

    return true;
}

/**
 * Validate a single workflow node
 */
function validateNode(node: WorkflowNode): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!node.action?.configMeta) {
        // No configMeta defined, nothing to validate
        return errors;
    }

    const configMeta = node.action.configMeta;
    const nodeConfig = node.config || {};
    const nodeName = nodeConfig.stepName || node.action.name;

    for (const [fieldName, fieldMeta] of Object.entries(configMeta)) {
        // Skip if field is not required
        if (!fieldMeta.required) {
            continue;
        }

        // Skip if field is conditionally hidden
        if (!isFieldVisible(fieldMeta, nodeConfig)) {
            continue;
        }

        // Check if field is filled
        const value = nodeConfig[fieldName];
        if (!isFieldFilled(value, fieldMeta.type)) {
            errors.push({
                nodeId: node.id,
                nodeName,
                actionName: node.action.name,
                field: fieldName,
                fieldLabel: fieldMeta.label,
                message: `${fieldMeta.label} is required`
            });
        }
    }

    return errors;
}

/**
 * Validate all nodes in a workflow before publishing
 * @param nodes - Array of workflow nodes with their action data
 * @returns Validation result with any errors found
 */
export function validateWorkflowNodes(nodes: WorkflowNode[]): ValidationResult {
    const allErrors: ValidationError[] = [];

    for (const node of nodes) {
        const nodeErrors = validateNode(node);
        allErrors.push(...nodeErrors);
    }

    return {
        valid: allErrors.length === 0,
        errors: allErrors
    };
}

/**
 * Format validation errors into a user-friendly message
 */
export function formatValidationErrors(errors: ValidationError[]): string {
    if (errors.length === 0) {
        return 'Workflow is valid';
    }

    const grouped = errors.reduce((acc, error) => {
        if (!acc[error.nodeName]) {
            acc[error.nodeName] = [];
        }
        acc[error.nodeName].push(error.fieldLabel);
        return acc;
    }, {} as Record<string, string[]>);

    const messages = Object.entries(grouped).map(([nodeName, fields]) =>
        `${nodeName}: Missing ${fields.join(', ')}`
    );

    return `Validation failed:\n${messages.join('\n')}`;
}

// ======================================
// Database Connection Validation
// ======================================

import { Client } from 'pg';
import { decrypt } from '../utils/crypto.utils';

export interface ConnectionTestResult {
    nodeId: string;
    nodeName: string;
    success: boolean;
    message: string;
    database?: string;
}

/**
 * Test a single database connection
 */
async function testDatabaseConnection(databaseUrl: string): Promise<{ success: boolean; message: string; database?: string }> {
    let client: Client | null = null;
    console.log("Database URL: ", databaseUrl);
    try {
        client = new Client({
            connectionString: databaseUrl,
            ssl: databaseUrl.includes('sslmode=require')
                ? { rejectUnauthorized: false }
                : undefined,
            connectionTimeoutMillis: 10000 // 10 second timeout
        });

        await client.connect();

        const result = await client.query('SELECT current_database()');
        const database = result.rows[0].current_database;

        return {
            success: true,
            message: 'Connection successful',
            database
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    } finally {
        if (client) {
            try {
                await client.end();
            } catch (e) {
                // Ignore disconnect errors
            }
        }
    }
}

/**
 * Validate all database connections in workflow nodes
 * Finds nodes with databaseUrl config and tests each connection
 */
export async function validateDatabaseConnections(nodes: WorkflowNode[]): Promise<ConnectionTestResult[]> {
    const results: ConnectionTestResult[] = [];

    for (const node of nodes) {
        const databaseUrl = node.config?.databaseUrl;

        if (databaseUrl && typeof databaseUrl === 'string' && databaseUrl.trim() !== '') {
            const nodeName = node.config?.stepName || node.action?.name || 'Unknown';
            console.log(`[Validation] Testing database connection for node: ${nodeName}`);

            const decryptedUrl = decrypt(databaseUrl);
            const testResult = await testDatabaseConnection(decryptedUrl);

            results.push({
                nodeId: node.id,
                nodeName,
                success: testResult.success,
                message: testResult.message,
                database: testResult.database
            });

            if (testResult.success) {
                console.log(`[Validation] Database connection OK for ${nodeName}: ${testResult.database}`);
            } else {
                console.log(`[Validation] Database connection FAILED for ${nodeName}: ${testResult.message}`);
            }
        }
    }

    return results;
}

/**
 * Format database connection errors into a user-friendly message
 */
export function formatConnectionErrors(results: ConnectionTestResult[]): string {
    const failed = results.filter(r => !r.success);

    if (failed.length === 0) {
        return '';
    }

    return `Database connection failed:\n${failed.map(r => `${r.nodeName}: ${r.message}`).join('\n')}`;
}

