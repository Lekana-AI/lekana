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
