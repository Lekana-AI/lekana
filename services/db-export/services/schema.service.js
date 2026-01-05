/**
 * Schema Service
 * Handles schema inference and table management
 */
const databaseService = require("./database.service");

/**
 * Infer SQL type from JavaScript value
 * @param {any} value
 * @returns {string} PostgreSQL type
 */
function inferSqlType(value) {
  if (value === null || value === undefined) {
    return "TEXT";
  }

  const type = typeof value;

  switch (type) {
    case "string":
      // Check if it looks like a date
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        return "TIMESTAMP";
      }
      return "TEXT";
    case "number":
      return Number.isInteger(value) ? "INTEGER" : "DECIMAL";
    case "boolean":
      return "BOOLEAN";
    case "object":
      return "JSONB";
    default:
      return "TEXT";
  }
}

/**
 * Infer schema from a record
 * @param {Record<string, any>} record
 * @returns {Record<string, string>} Column definitions
 */
function inferSchemaFromRecord(record) {
  const schema = {};

  for (const [key, value] of Object.entries(record)) {
    schema[key] = inferSqlType(value);
  }

  return schema;
}

/**
 * Check if a table exists
 * @param {Client} client
 * @param {string} tableName
 * @returns {Promise<boolean>}
 */
async function tableExists(client, tableName) {
  const result = await databaseService.query(
    client,
    `SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = $1
    )`,
    [tableName]
  );
  return result.rows[0].exists;
}

/**
 * Ensure table exists with required schema
 * Creates table if it doesn't exist
 * @param {Client} client
 * @param {string} tableName
 * @param {Record<string, string>} schema
 * @param {boolean} includeMetadata
 */
/**
 * Get existing columns for a table
 * @param {Client} client
 * @param {string} tableName
 * @returns {Promise<Set<string>>} Set of column names (lowercase)
 */
async function getExistingColumns(client, tableName) {
  const result = await databaseService.query(
    client,
    `SELECT column_name 
     FROM information_schema.columns 
     WHERE table_name = $1`,
    [tableName]
  );
  return new Set(result.rows.map((row) => row.column_name.toLowerCase()));
}

/**
 * Add missing columns to an existing table
 * @param {Client} client
 * @param {string} tableName
 * @param {Record<string, string>} schema
 * @param {Set<string>} existingColumns
 */
async function addMissingColumns(client, tableName, schema, existingColumns) {
  const columnsToAdd = [];

  for (const [columnName, columnType] of Object.entries(schema)) {
    // Skip internal columns - they're handled by ensureMetadataColumns
    if (columnName.startsWith("_")) continue;

    const safeName = sanitizeColumnName(columnName);
    if (!existingColumns.has(safeName)) {
      columnsToAdd.push({ name: safeName, type: columnType });
    }
  }

  if (columnsToAdd.length === 0) {
    return;
  }

  console.log(
    `[Schema] Adding ${
      columnsToAdd.length
    } missing column(s) to "${tableName}": ${columnsToAdd
      .map((c) => c.name)
      .join(", ")}`
  );

  for (const col of columnsToAdd) {
    const alterQuery = `ALTER TABLE "${tableName}" ADD COLUMN "${col.name}" ${col.type}`;
    await databaseService.query(client, alterQuery);
    console.log(`[Schema] Added column "${col.name}" (${col.type})`);
  }
}

/**
 * Ensure metadata columns exist in the table
 * @param {Client} client
 * @param {string} tableName
 * @param {Set<string>} existingColumns
 * @param {boolean} includeMetadata
 */
async function ensureMetadataColumns(
  client,
  tableName,
  existingColumns,
  includeMetadata
) {
  console.log(
    `[Schema] ensureMetadataColumns called, includeMetadata=${includeMetadata}`
  );
  const metadataColumns = [];

  // _source_filename is ALWAYS added to records, so always ensure it exists
  if (!existingColumns.has("_source_filename")) {
    metadataColumns.push({ name: "_source_filename", type: "TEXT" });
  }

  // These metadata columns are optional based on config
  if (includeMetadata) {
    if (!existingColumns.has("_execution_id")) {
      metadataColumns.push({ name: "_execution_id", type: "TEXT" });
    }
    if (!existingColumns.has("_workflow_id")) {
      metadataColumns.push({ name: "_workflow_id", type: "TEXT" });
    }
    if (!existingColumns.has("_created_at")) {
      metadataColumns.push({
        name: "_created_at",
        type: "TIMESTAMP DEFAULT NOW()",
      });
    }
  }

  // Always ensure _extra_data exists
  if (!existingColumns.has("_extra_data")) {
    metadataColumns.push({ name: "_extra_data", type: "JSONB" });
  }

  if (metadataColumns.length === 0) {
    return;
  }

  console.log(
    `[Schema] Adding ${
      metadataColumns.length
    } missing metadata column(s) to "${tableName}": ${metadataColumns
      .map((c) => c.name)
      .join(", ")}`
  );

  for (const col of metadataColumns) {
    const alterQuery = `ALTER TABLE "${tableName}" ADD COLUMN "${col.name}" ${col.type}`;
    await databaseService.query(client, alterQuery);
    console.log(`[Schema] Added metadata column "${col.name}"`);
  }
}

async function ensureTable(client, tableName, schema, includeMetadata = true) {
  const exists = await tableExists(client, tableName);

  if (exists) {
    console.log(`[Schema] Table "${tableName}" already exists`);
    // Auto-add missing columns
    const existingColumns = await getExistingColumns(client, tableName);
    console.log(
      `[Schema] Existing columns: ${[...existingColumns].join(", ")}`
    );

    try {
      await addMissingColumns(client, tableName, schema, existingColumns);
    } catch (error) {
      console.error(`[Schema] Error adding missing columns: ${error.message}`);
    }

    try {
      await ensureMetadataColumns(
        client,
        tableName,
        existingColumns,
        includeMetadata
      );
    } catch (error) {
      console.error(`[Schema] Error adding metadata columns: ${error.message}`);
    }
    return;
  }

  // Build column definitions
  const columns = ["id UUID PRIMARY KEY DEFAULT gen_random_uuid()"];

  // Add schema columns
  for (const [columnName, columnType] of Object.entries(schema)) {
    // Skip internal columns, we'll add them separately
    if (columnName.startsWith("_")) continue;

    const safeName = sanitizeColumnName(columnName);
    columns.push(`"${safeName}" ${columnType}`);
  }

  // _source_filename is always added to records
  columns.push(`"_source_filename" TEXT`);

  // Add optional metadata columns if enabled
  if (includeMetadata) {
    columns.push(`"_execution_id" TEXT`);
    columns.push(`"_workflow_id" TEXT`);
    columns.push(`"_created_at" TIMESTAMP DEFAULT NOW()`);
  }

  // Add extra data column for unmapped fields
  columns.push(`"_extra_data" JSONB`);

  const createQuery = `CREATE TABLE "${tableName}" (\n  ${columns.join(
    ",\n  "
  )}\n)`;

  console.log(`[Schema] Creating table "${tableName}"`);
  await databaseService.query(client, createQuery);
  console.log(`[Schema] Table "${tableName}" created successfully`);
}

/**
 * Sanitize column name for PostgreSQL
 * @param {string} name
 * @returns {string}
 */
function sanitizeColumnName(name) {
  // Check if it's an internal column (starts with _)
  const isInternal = name.startsWith("_");

  // Replace special characters with underscores, keep leading underscore for internal columns
  let sanitized = name.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();

  // Only strip leading underscores from non-internal columns
  if (!isInternal) {
    sanitized = sanitized.replace(/^_+/, "");
  }

  return sanitized;
}

module.exports = {
  inferSqlType,
  inferSchemaFromRecord,
  tableExists,
  ensureTable,
  sanitizeColumnName,
};
