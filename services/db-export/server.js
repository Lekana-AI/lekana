/**
 * DB Export Service - Main Entry Point
 * Exports workflow data to SQL databases
 * Port: 4005
 */
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const {
  checkJwt,
  handleAuthError,
  extractUserInfo,
} = require("./middleware/auth.middleware");
const databaseService = require("./services/database.service");
const schemaService = require("./services/schema.service");
const exportService = require("./services/export.service");
const geminiService = require("./services/gemini.service");

const app = express();
const PORT = process.env.PORT || 4005;
const SERVICE_VERSION = "1.0.0";

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cors());

// ============================================
// Health Check Endpoint (Public)
// ============================================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "db-export-service",
    version: SERVICE_VERSION,
  });
});

// ============================================
// Test Connection Endpoint (for config validation)
// ============================================
app.post("/api/v1/test-connection", async (req, res) => {
  const { databaseUrl } = req.body;

  if (!databaseUrl) {
    return res.status(400).json({
      success: false,
      message: "databaseUrl is required",
    });
  }

  console.log("[DB-Export] Testing connection...");
  const result = await databaseService.testConnection(databaseUrl);

  res.json(result);
});

// ============================================
// Main Export Processing Endpoint
// Follows ServiceRequest/ServiceResponse contract
// ============================================
app.post(
  "/api/v1/process",
  //checkJwt, // Uncomment for production
  handleAuthError,
  extractUserInfo,
  async (req, res) => {
    const startTime = Date.now();

    try {
      const {
        executionId,
        nodeId,
        workflowId,
        userId,
        input = {},
        config = {},
      } = req.body;

      const {
        databaseUrl,
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

      // Track Gemini token usage
      let geminiTokensUsed = null;

      console.log("=".repeat(60));
      console.log(`[DB-Export] Processing request`);
      console.log(`[DB-Export] Execution: ${executionId}`);
      console.log(`[DB-Export] Node: ${nodeId}`);
      console.log(`[DB-Export] Workflow: ${workflowId}`);
      console.log("-".repeat(60));
      console.log(`[DB-Export] CONFIG:`);
      console.log(`  - tableName: ${tableName}`);
      console.log(`  - mode: ${mode}`);
      console.log(`  - includeMetadata: ${includeMetadata}`);
      console.log(`  - unmappedFieldStrategy: ${unmappedFieldStrategy}`);
      console.log(`  - onConflict: ${onConflict}`);
      console.log(`  - flattenFieldsMode: ${flattenFieldsMode}`);
      // Convert fieldMapping from array format to object format if needed
      // UI sends [{key: "dob", value: "dob"}] but we need {"dob": "fields.dob.value"}
      let normalizedFieldMapping = fieldMapping;
      if (Array.isArray(fieldMapping)) {
        normalizedFieldMapping = {};
        for (const item of fieldMapping) {
          // Skip empty strings or invalid items in the array
          if (!item || item === "" || typeof item !== "object") {
            continue;
          }

          const columnName = item.key || item.columnName;
          let fieldPath = item.value || item.fieldPath || columnName;

          // Skip if we don't have valid columnName or fieldPath
          if (!columnName || !fieldPath) {
            continue;
          }

          // If flattenFieldsMode is false and path doesn't include 'fields.',
          // auto-prepend the path to extract from OCR result structure
          if (!flattenFieldsMode && !fieldPath.includes(".")) {
            fieldPath = `fields.${fieldPath}.value`;
          }

          normalizedFieldMapping[columnName] = fieldPath;
        }
        console.log(`[DB-Export] Converted fieldMapping from array to object:`);
        console.log(`  - Original: ${JSON.stringify(fieldMapping)}`);
        console.log(
          `  - Normalized: ${JSON.stringify(normalizedFieldMapping)}`,
        );
      }

      console.log(
        `  - includeExtractionMetadata: ${includeExtractionMetadata}`,
      );
      console.log(
        `  - fieldMapping: ${JSON.stringify(normalizedFieldMapping)}`,
      );
      console.log(
        `  - databaseUrl: ${
          databaseUrl ? databaseUrl.replace(/:[^:@]+@/, ":****@") : "NOT SET"
        }`,
      );
      console.log("-".repeat(60));

      // Validate required config
      if (!databaseUrl) {
        throw new Error("databaseUrl is required in config");
      }
      if (!tableName) {
        throw new Error("tableName is required in config");
      }

      // Get data from input
      const inputData = input.data || input;
      console.log(`[DB-Export] INPUT DATA:`);
      console.log(
        JSON.stringify(inputData, null, 2).split("\n").slice(0, 30).join("\n"),
      );
      if (JSON.stringify(inputData).length > 2000) {
        console.log("  ... (truncated)");
      }
      console.log("-".repeat(60));

      if (!inputData || Object.keys(inputData).length === 0) {
        throw new Error("No data provided in input");
      }

      // Connect to user's database
      const client = await databaseService.connect(databaseUrl);

      try {
        // Extract records from input data
        const { records, inferredSchema } = exportService.extractRecords(
          inputData,
          normalizedFieldMapping,
          unmappedFieldStrategy,
          { flattenFieldsMode, includeExtractionMetadata },
        );

        console.log(`[DB-Export] EXTRACTED ${records.length} records`);
        console.log(
          `[DB-Export] INFERRED SCHEMA: ${JSON.stringify(inferredSchema)}`,
        );
        if (records.length > 0) {
          console.log(`[DB-Export] SAMPLE RECORD:`);
          console.log(JSON.stringify(records[0], null, 2));
        }

        // Handle table creation/validation based on mode
        if (mode === "auto") {
          // Auto-create table if it doesn't exist
          await schemaService.ensureTable(
            client,
            tableName,
            inferredSchema,
            includeMetadata,
          );
        } else {
          // Validate that table exists
          const exists = await schemaService.tableExists(client, tableName);
          if (!exists) {
            throw new Error(
              `Table "${tableName}" does not exist. Use mode="auto" to create it.`,
            );
          }
        }

        // Smart field mapping: use Gemini to match incoming fields to existing columns
        let mappedRecords = records;
        let fieldMappingApplied = null;

        if (useSmartMapping && records.length > 0) {
          // Get existing columns from the table
          const existingColumns = await schemaService.getExistingColumns(
            client,
            tableName,
          );
          const existingColumnsArray = [...existingColumns];

          if (existingColumnsArray.length > 0) {
            // Get incoming field names from first record
            const incomingFields = Object.keys(records[0]).filter(
              (f) => !f.startsWith("_"),
            );

            // Use Gemini to map fields to columns
            const mappingResult = await geminiService.mapFieldsToColumns(
              incomingFields,
              existingColumnsArray,
            );

            if (mappingResult.tokensUsed) {
              geminiTokensUsed = mappingResult.tokensUsed;
            }

            if (Object.keys(mappingResult.mapping).length > 0) {
              mappedRecords = geminiService.applyFieldMapping(
                records,
                mappingResult.mapping,
              );
              fieldMappingApplied = mappingResult.mapping;
              console.log(`[DB-Export] Applied smart field mapping`);
            }
          }
        }

        // Add metadata to records if enabled
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
        const insertResult = await exportService.insertRecords(
          client,
          tableName,
          enrichedRecords,
          onConflict,
        );

        const processingTime = Date.now() - startTime;
        console.log(
          `[DB-Export] Completed in ${processingTime}ms - ${insertResult.inserted} rows inserted`,
        );

        // Build ServiceResponse
        res.json({
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
            serviceVersion: SERVICE_VERSION,
            mode,
            databaseConnected: true,
            tokensUsed: geminiTokensUsed ? geminiTokensUsed.totalTokens : 0,
            smartMappingUsed: !!fieldMappingApplied,
          },
        });
      } finally {
        // Always release the connection
        await databaseService.disconnect(client);
      }
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`[DB-Export] Error:`, error.message);

      res.status(400).json({
        success: false,
        data: null,
        error: {
          code: "DB_EXPORT_ERROR",
          message: error.message,
          details: error.stack,
        },
        metadata: {
          processingTime,
          serviceVersion: SERVICE_VERSION,
        },
      });
    }
  },
);

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log(`DB Export service running on port ${PORT}`);
  console.log(`Service version: ${SERVICE_VERSION}`);
});
