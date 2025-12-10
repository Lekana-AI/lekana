/**
 * Config utilities for Action/Node configuration handling
 */

interface FieldMeta {
    type: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    options?: Array<{ label: string; value: string }>;
    [key: string]: any;
}

interface ConfigMeta {
    [fieldName: string]: FieldMeta;
}

interface UiSchemaField extends FieldMeta {
    name: string;
    default: any;
}

interface UiSchema {
    fields: UiSchemaField[];
}

/**
 * Generate uiSchema from configSchema (defaults) + configMeta (field types)
 * Used by API to transform action data for frontend
 */
export function generateUiSchema(
    configSchema: Record<string, any>,
    configMeta?: ConfigMeta
): UiSchema {
    return {
        fields: Object.entries(configSchema).map(([key, defaultValue]) => ({
            name: key,
            default: defaultValue,
            type: configMeta?.[key]?.type || inferType(defaultValue),
            label: configMeta?.[key]?.label || formatLabel(key),
            ...configMeta?.[key]
        }))
    };
}

/**
 * Validate that node config keys match action configSchema keys
 */
export function validateConfigKeys(
    nodeConfig: Record<string, any>,
    actionConfig: Record<string, any>
): { valid: boolean; invalidKeys: string[] } {
    const validKeys = Object.keys(actionConfig);
    const nodeKeys = Object.keys(nodeConfig);
    const invalidKeys = nodeKeys.filter(k => !validKeys.includes(k));
    return { valid: invalidKeys.length === 0, invalidKeys };
}

/**
 * Merge action defaults with node overrides
 * Node values take precedence over defaults
 */
export function mergeConfig(
    actionConfig: Record<string, any>,
    nodeConfig?: Record<string, any>
): Record<string, any> {
    return { ...actionConfig, ...(nodeConfig || {}) };
}

/**
 * Infer field type from default value
 */
function inferType(value: any): string {
    if (value === null) return 'text';
    if (typeof value === 'boolean') return 'checkbox';
    if (typeof value === 'number') return 'number';
    if (Array.isArray(value)) return 'checkbox-group';
    if (typeof value === 'object') return 'json';
    return 'text';
}

/**
 * Convert camelCase/snake_case to readable label
 */
function formatLabel(key: string): string {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/[_-]/g, ' ')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}
