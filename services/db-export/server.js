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
      } = config;

      console.log(
        `[DB-Export] Processing request - Execution: ${executionId}, Node: ${nodeId}`
      );
      console.log(`[DB-Export] Config: table=${tableName}, mode=${mode}`);

      // Validate required config
      if (!databaseUrl) {
        throw new Error("databaseUrl is required in config");
      }
      if (!tableName) {
        throw new Error("tableName is required in config");
      }

      // Get data from input
      const inputData = input.data || input;
      if (!inputData || Object.keys(inputData).length === 0) {
        throw new Error("No data provided in input");
      }

      // Connect to user's database
      const client = await databaseService.connect(databaseUrl);

      try {
        // Extract records from input data
        const { records, inferredSchema } = exportService.extractRecords(
          inputData,
          fieldMapping,
          unmappedFieldStrategy
        );

        console.log(`[DB-Export] Extracted ${records.length} records`);

        // Handle table creation/validation based on mode
        if (mode === "auto") {
          // Auto-create table if it doesn't exist
          await schemaService.ensureTable(
            client,
            tableName,
            inferredSchema,
            includeMetadata
          );
        } else {
          // Validate that table exists
          const exists = await schemaService.tableExists(client, tableName);
          if (!exists) {
            throw new Error(
              `Table "${tableName}" does not exist. Use mode="auto" to create it.`
            );
          }
        }

        // Add metadata to records if enabled
        const enrichedRecords = records.map((record) => {
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
          onConflict
        );

        const processingTime = Date.now() - startTime;
        console.log(
          `[DB-Export] Completed in ${processingTime}ms - ${insertResult.inserted} rows inserted`
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
          },
          metadata: {
            processingTime,
            serviceVersion: SERVICE_VERSION,
            mode,
            databaseConnected: true,
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
  }
);

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log(`DB Export service running on port ${PORT}`);
  console.log(`Service version: ${SERVICE_VERSION}`);
});
