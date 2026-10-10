/**
 * Export Service
 * Handles data extraction, transformation, and database insertion
 */
const schemaService = require("./schema.service");
const databaseService = require("./database.service");
const geminiService = require("./gemini.service");
const { decrypt } = require("../utils/crypto.utils");

/**
 * Extract records from input data using field mapping
 * @param {any} inputData - Raw input from previous node
 * @param {Record<string, string>} fieldMapping - Column to path mapping
 * @param {string} unmappedFieldStrategy - "store_as_json", "ignore", "error"
 * @param {Object} options - Additional options
 * @param {boolean} options.flattenFieldsMode - Auto-extract .value from OCR fields
 * @param {boolean} options.includeExtractionMetadata - Store confidence/corrected data
 * @returns {{ records: any[], inferredSchema: Record<string, string> }}
 */
function extractRecords(
  inputData,
  fieldMapping,
  unmappedFieldStrategy,
  options = {}
) {
  const { flattenFieldsMode = false, includeExtractionMetadata = false } =
    options;
  const records = [];
  let inferredSchema = {};

  // Handle OCR-style output with documents array
  if (inputData.documents && Array.isArray(inputData.documents)) {
    for (const doc of inputData.documents) {
      let result = doc.result || {};

      // If flattenFieldsMode is enabled and we have a fields object, flatten it
      if (flattenFieldsMode && result.fields) {
        result = flattenOcrFields(result, includeExtractionMetadata);
      }

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
    let data = inputData;

    // If flattenFieldsMode is enabled and we have a fields object, flatten it
    if (flattenFieldsMode && data.fields) {
      data = flattenOcrFields(data, includeExtractionMetadata);
    }

    const record = extractSingleRecord(
      data,
      fieldMapping,
      unmappedFieldStrategy
    );
    records.push(record);
    inferredSchema = schemaService.inferSchemaFromRecord(record);
  }
  // Handle array input
  else if (Array.isArray(inputData)) {
    for (const item of inputData) {
      let data = item;

      // If flattenFieldsMode is enabled and we have a fields object, flatten it
      if (flattenFieldsMode && data.fields) {
        data = flattenOcrFields(data, includeExtractionMetadata);
      }

      const record = extractSingleRecord(
        data,
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
 * Flatten OCR fields object - extract just the .value from each field
 * @param {Object} ocrResult - OCR result with fields object
 * @param {boolean} includeExtractionMetadata - Whether to store confidence data
 * @returns {Object} Flattened object with field values as top-level properties
 */
function flattenOcrFields(ocrResult, includeExtractionMetadata = false) {
  const flattened = {};
  const extractionMetadata = {};

  // Extract values from fields object
  if (ocrResult.fields && typeof ocrResult.fields === "object") {
    for (const [fieldName, fieldData] of Object.entries(ocrResult.fields)) {
      // Extract just the value
      if (fieldData && typeof fieldData === "object" && "value" in fieldData) {
        flattened[fieldName] = fieldData.value;

        // Collect metadata if requested
        if (includeExtractionMetadata) {
          extractionMetadata[fieldName] = {
            confidence: fieldData.confidence,
            corrected: fieldData.corrected,
            originalValue: fieldData.originalValue,
          };
        }
      } else {
        // If it's not a field object, use as-is
        flattened[fieldName] = fieldData;
      }
    }
  }

  // Add other top-level properties (documentType, outputMode, etc.)
  for (const [key, value] of Object.entries(ocrResult)) {
    if (key !== "fields") {
      flattened[key] = value;
    }
  }

  // Add extraction metadata if requested
  if (includeExtractionMetadata && Object.keys(extractionMetadata).length > 0) {
    flattened._extraction_metadata = extractionMetadata;
  }

  return flattened;
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
      // Ensure fieldPath is a string
      const pathStr = fieldPath != null ? String(fieldPath) : "";
      const value = getValueByPath(data, pathStr);
      record[columnName] = value;

      // Track which source keys were mapped
      if (pathStr) {
        const sourceKey = pathStr.split(".")[0].split("[")[0];
        mappedKeys.add(sourceKey);
      }
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

  // Ensure path is a string
  const pathStr = typeof path === "string" ? path : String(path);
  const parts = pathStr.split(/\.|\[|\]/).filter(Boolean);
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


/**
* Process the full export request (previously in server.js)
* @param {Object} params
* @param {string} params.executionId
* @param {string} params.nodeId
* @param {string} params.workflowId
* @param {Object} params.input
* @param {Object} params.config
* @returns {Promise<Object>} Service response data
*/
async function processExportRequest({
  executionId,
  nodeId,
  workflowId,
  input = {},
  config = {},
}) {
  const startTime = Date.now();
  const {
    databaseUrl: rawDatabaseUrl,
    tableName,
    mode = "auto", // "auto" or "existing"
    fieldMapping = {},
    includeMetadata = true,
    unmappedFieldStrategy = "store_as_json", // "store_as_json", "ignore", "error"
    onConflict = "skip", // "skip", "update", "error"
    flattenFieldsMode = false, // Auto-extract .value from OCR fields
    includeExtractionMetadata = false, // Store confidence/corrected data
    useSmartMapping = true, // Use Gemini to map fields to existing columns
  } = config;

  const databaseUrl = decrypt(rawDatabaseUrl);

  // Track Gemini token usage
  let geminiTokensUsed = null;

  console.log("=".repeat(60));
  console.log(`[Export-Service] Processing request`);
  console.log(`[Export-Service] Execution: ${executionId}`);
  console.log(`[Export-Service] Node: ${nodeId}`);
  console.log(`[Export-Service] Workflow: ${workflowId}`);
  console.log("-".repeat(60));
  console.log(`[Export-Service] CONFIG:`);
  console.log(`  - tableName: ${tableName}`);
  console.log(`  - mode: ${mode}`);
  console.log(`  - includeMetadata: ${includeMetadata}`);
  console.log(`  - unmappedFieldStrategy: ${unmappedFieldStrategy}`);
  console.log(`  - onConflict: ${onConflict}`);
  console.log(`  - flattenFieldsMode: ${flattenFieldsMode}`);

  // Convert fieldMapping from array format to object format if needed
  let normalizedFieldMapping = fieldMapping;
  if (Array.isArray(fieldMapping)) {
    normalizedFieldMapping = {};
    for (const item of fieldMapping) {
      if (!item || item === "" || typeof item !== "object") continue;

      const columnName = item.key || item.columnName;
      let fieldPath = item.value || item.fieldPath || columnName;

      if (!columnName || !fieldPath) continue;

      if (!flattenFieldsMode && !fieldPath.includes(".")) {
        fieldPath = `fields.${fieldPath}.value`;
      }

      normalizedFieldMapping[columnName] = fieldPath;
    }
    console.log(`[Export-Service] Converted fieldMapping from array to object`);
  }

  console.log(`  - includeExtractionMetadata: ${includeExtractionMetadata}`);
  console.log(
    `  - databaseUrl: ${databaseUrl ? databaseUrl.replace(/:[^:@]+@/, ":****@") : "NOT SET"
    }`
  );
  console.log("-".repeat(60));

  // Validate required config
  if (!databaseUrl) throw new Error("databaseUrl is required in config");
  if (!tableName) throw new Error("tableName is required in config");

  // Get data from input
  const inputData = input.data || input;
  console.log(`[Export-Service] INPUT DATA sample available`);

  if (!inputData || Object.keys(inputData).length === 0) {
    throw new Error("No data provided in input");
  }

  // Connect to user's database
  const client = await databaseService.connect(databaseUrl);

  try {
    // Extract records from input data
    const { records, inferredSchema } = extractRecords(
      inputData,
      normalizedFieldMapping,
      unmappedFieldStrategy,
      { flattenFieldsMode, includeExtractionMetadata }
    );

    console.log(`[Export-Service] EXTRACTED ${records.length} records`);
    console.log(
      `[Export-Service] INFERRED SCHEMA: ${JSON.stringify(inferredSchema)}`
    );

    // Smart field mapping
    let mappedRecords = records;
    let fieldMappingApplied = null;
    let finalSchema = inferredSchema;

    // Check if table exists first
    const tableAlreadyExists = await schemaService.tableExists(
      client,
      tableName
    );

    if (useSmartMapping && records.length > 0 && tableAlreadyExists) {
      const existingColumns = await schemaService.getExistingColumns(
        client,
        tableName
      );
      const existingColumnsArray = [...existingColumns];

      if (existingColumnsArray.length > 0) {
        const incomingFields = Object.keys(records[0]).filter(
          (f) => !f.startsWith("_")
        );

        console.log(
          `[Export-Service] Smart mapping: incoming fields = ${incomingFields.join(", ")}`
        );
        console.log(
          `[Export-Service] Smart mapping: existing columns = ${existingColumnsArray.join(", ")}`
        );

        // Use Gemini to map fields to columns
        const mappingResult = await geminiService.mapFieldsToColumns(
          incomingFields,
          existingColumnsArray
        );

        if (mappingResult.tokensUsed) {
          geminiTokensUsed = mappingResult.tokensUsed;
          console.log(
            `[Export-Service] Gemini tokens used: ${geminiTokensUsed.totalTokens}`
          );
        }

        if (Object.keys(mappingResult.mapping).length > 0) {
          mappedRecords = geminiService.applyFieldMapping(
            records,
            mappingResult.mapping
          );
          fieldMappingApplied = mappingResult.mapping;
          console.log(`[Export-Service] Applied smart field mapping`);

          finalSchema = schemaService.inferSchemaFromRecord(mappedRecords[0]);
          console.log(
            `[Export-Service] MAPPED SCHEMA: ${JSON.stringify(finalSchema)}`
          );
        }
      }
    }

    // Handle table creation/validation
    if (mode === "auto") {
      await schemaService.ensureTable(
        client,
        tableName,
        finalSchema,
        includeMetadata
      );
    } else {
      if (!tableAlreadyExists) {
        throw new Error(
          `Table "${tableName}" does not exist. Use mode="auto" to create it.`
        );
      }
    }

    // Add metadata
    const enrichedRecords = mappedRecords.map((record) => {
      if (includeMetadata) {
        return {
          ...record,
          _execution_id: executionId,
          _workflow_id: workflowId,
          _created_at: new Date().toISOString(),
        };
      }
      return record;
    });

    // Insert records
    const insertResult = await insertRecords(
      client,
      tableName,
      enrichedRecords,
      onConflict
    );

    const processingTime = Date.now() - startTime;
    console.log(
      `[Export-Service] Completed in ${processingTime}ms - ${insertResult.inserted} rows inserted`
    );

    return {
      success: true,
      data: {
        tableName,
        recordsProcessed: records.length,
        recordsInserted: insertResult.inserted,
        recordsSkipped: insertResult.skipped,
        schema: inferredSchema,
        fieldMappingApplied,
      },
      metadata: {
        processingTime,
        mode,
        databaseConnected: true,
        tokensUsed: geminiTokensUsed ? geminiTokensUsed.totalTokens : 0,
        smartMappingUsed: !!fieldMappingApplied,
      },
    };
  } finally {
    await databaseService.disconnect(client);
  }
}

module.exports = {
  extractRecords,
  extractSingleRecord,
  getValueByPath,
  insertRecords,
  flattenOcrFields,
  processExportRequest,
};
