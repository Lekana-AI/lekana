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
    try {
      const result = await exportService.processExportRequest(req.body);
      res.json({
        ...result,
        metadata: {
          ...result.metadata,
          serviceVersion: SERVICE_VERSION,
        },
      });
    } catch (error) {
      console.error(`[DB-Export] Error:`, error.message);

      const processingTime = req.body._startTime ? Date.now() - req.body._startTime : 0;

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
