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
async function ensureTable(client, tableName, schema, includeMetadata = true) {
  const exists = await tableExists(client, tableName);

  if (exists) {
    console.log(`[Schema] Table "${tableName}" already exists`);
    // TODO: Could add ALTER TABLE logic here to add missing columns
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

  // Add metadata columns if enabled
  if (includeMetadata) {
    columns.push(`"_source_filename" TEXT`);
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
  // Replace special characters with underscores
  return name
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/^_+/, "")
    .toLowerCase();
}

module.exports = {
  inferSqlType,
  inferSchemaFromRecord,
  tableExists,
  ensureTable,
  sanitizeColumnName,
};
