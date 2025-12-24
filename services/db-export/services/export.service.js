/**
 * Export Service
 * Handles data extraction, transformation, and database insertion
 */
const schemaService = require("./schema.service");
const databaseService = require("./database.service");

/**
 * Extract records from input data using field mapping
 * @param {any} inputData - Raw input from previous node
 * @param {Record<string, string>} fieldMapping - Column to path mapping
 * @param {string} unmappedFieldStrategy - "store_as_json", "ignore", "error"
 * @returns {{ records: any[], inferredSchema: Record<string, string> }}
 */
function extractRecords(inputData, fieldMapping, unmappedFieldStrategy) {
  const records = [];
  let inferredSchema = {};

  // Handle OCR-style output with documents array
  if (inputData.documents && Array.isArray(inputData.documents)) {
    for (const doc of inputData.documents) {
      const result = doc.result || {};
      const record = extractSingleRecord(
        result,
        fieldMapping,
        unmappedFieldStrategy
      );
      records.push({
        ...record,
        _source_filename: doc.filename || null,
      });

      // Merge schema from all records
      const recordSchema = schemaService.inferSchemaFromRecord(record);
      inferredSchema = { ...inferredSchema, ...recordSchema };
    }
  }
  // Handle direct object input
  else if (typeof inputData === "object" && !Array.isArray(inputData)) {
    const record = extractSingleRecord(
      inputData,
      fieldMapping,
      unmappedFieldStrategy
    );
    records.push(record);
    inferredSchema = schemaService.inferSchemaFromRecord(record);
  }
  // Handle array input
  else if (Array.isArray(inputData)) {
    for (const item of inputData) {
      const record = extractSingleRecord(
        item,
        fieldMapping,
        unmappedFieldStrategy
      );
      records.push(record);

      const recordSchema = schemaService.inferSchemaFromRecord(record);
      inferredSchema = { ...inferredSchema, ...recordSchema };
    }
  }

  // Add schema for _source_filename if we added it
  if (records.length > 0 && records[0]._source_filename !== undefined) {
    inferredSchema._source_filename = "TEXT";
  }

  return { records, inferredSchema };
}

/**
 * Extract a single record using field mapping
 * @param {Record<string, any>} data
 * @param {Record<string, string>} fieldMapping
 * @param {string} unmappedFieldStrategy
 * @returns {Record<string, any>}
 */
function extractSingleRecord(data, fieldMapping, unmappedFieldStrategy) {
  const record = {};
  const mappedKeys = new Set();

  // If fieldMapping is provided, use it
  if (fieldMapping && Object.keys(fieldMapping).length > 0) {
    for (const [columnName, fieldPath] of Object.entries(fieldMapping)) {
      const value = getValueByPath(data, fieldPath);
      record[columnName] = value;

      // Track which source keys were mapped
      const sourceKey = fieldPath.split(".")[0].split("[")[0];
      mappedKeys.add(sourceKey);
    }
  } else {
    // No field mapping - use all top-level fields
    for (const [key, value] of Object.entries(data)) {
      // Flatten simple objects, store complex ones as JSON
      if (isPrimitive(value)) {
        record[key] = value;
      } else {
        record[key] = JSON.stringify(value);
      }
      mappedKeys.add(key);
    }
  }

  // Handle unmapped fields
  const unmappedData = {};
  for (const [key, value] of Object.entries(data)) {
    if (!mappedKeys.has(key)) {
      unmappedData[key] = value;
    }
  }

  if (Object.keys(unmappedData).length > 0) {
    switch (unmappedFieldStrategy) {
      case "store_as_json":
        record._extra_data = JSON.stringify(unmappedData);
        break;
      case "error":
        throw new Error(
          `Unmapped fields found: ${Object.keys(unmappedData).join(", ")}`
        );
      case "ignore":
      default:
        // Do nothing
        break;
    }
  }

  return record;
}

/**
 * Get value from object by dot-notation path
 * Supports array notation like "documents[0].result.field"
 * @param {any} obj
 * @param {string} path
 * @returns {any}
 */
function getValueByPath(obj, path) {
  if (!path) return obj;

  const parts = path.split(/\.|\[|\]/).filter(Boolean);
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[part];
  }

  return current;
}

/**
 * Check if value is a primitive type
 * @param {any} value
 * @returns {boolean}
 */
function isPrimitive(value) {
  return (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

/**
 * Insert records into database
 * @param {Client} client
 * @param {string} tableName
 * @param {any[]} records
 * @param {string} onConflict - "skip", "update", "error"
 * @returns {Promise<{ inserted: number, skipped: number }>}
 */
async function insertRecords(client, tableName, records, onConflict) {
  let inserted = 0;
  let skipped = 0;

  for (const record of records) {
    try {
      const columns = Object.keys(record).map(
        (k) => `"${schemaService.sanitizeColumnName(k)}"`
      );
      const placeholders = columns.map((_, i) => `$${i + 1}`);
      const values = Object.values(record).map((v) =>
        typeof v === "object" && v !== null ? JSON.stringify(v) : v
      );

      let query = `INSERT INTO "${tableName}" (${columns.join(
        ", "
      )}) VALUES (${placeholders.join(", ")})`;

      // Handle conflict strategy
      if (onConflict === "skip") {
        query += " ON CONFLICT DO NOTHING";
      } else if (onConflict === "update") {
        // Update all non-id columns on conflict
        const updateCols = columns
          .filter((c) => c !== '"id"')
          .map((c) => `${c} = EXCLUDED.${c.replace(/"/g, "")}`)
          .join(", ");
        if (updateCols) {
          query += ` ON CONFLICT (id) DO UPDATE SET ${updateCols}`;
        }
      }
      // "error" mode: no ON CONFLICT clause, will throw on duplicate

      await databaseService.query(client, query, values);
      inserted++;
    } catch (error) {
      if (onConflict === "skip") {
        skipped++;
        console.log(
          `[Export] Skipped record due to conflict: ${error.message}`
        );
      } else {
        throw error;
      }
    }
  }

  return { inserted, skipped };
}

module.exports = {
  extractRecords,
  extractSingleRecord,
  getValueByPath,
  insertRecords,
};
