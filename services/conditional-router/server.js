/**
 * Conditional Router Service
 * Routes data based on configurable field conditions
 * Works with any upstream node (Classification, OCR, etc.)
 * Port: 4010
 */
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4010;
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
    service: "conditional-router",
    version: SERVICE_VERSION,
  });
});

// ============================================
// Main Routing Endpoint
// Follows ServiceRequest/ServiceResponse contract
// ============================================
app.post("/api/v1/process", async (req, res) => {
  const startTime = Date.now();

  try {
    const {
      executionId,
      nodeId,
      workflowId,
      input = {},
      config = {},
    } = req.body;

    const {
      stepName,
      routeByField = "label",
      operator = "equals",
      routeValue = "",
      outputMode = "documents_only",
      skipIfEmpty = true,
    } = config;

    console.log("=".repeat(60));
    console.log(
      `[Router] Processing - Execution: ${executionId}, Node: ${nodeId}`
    );
    console.log(`[Router] Config:`);
    console.log(`  - routeByField: ${routeByField}`);
    console.log(`  - operator: ${operator}`);
    console.log(`  - routeValue: ${routeValue}`);
    console.log(`  - outputMode: ${outputMode}`);
    console.log(`  - skipIfEmpty: ${skipIfEmpty}`);
    console.log("-".repeat(60));

    // Get data from input - support multiple upstream formats
    const inputData = input.data || input;
    const classifications = inputData?.classifications || [];
    const ocrDocuments = inputData?.documents || [];
    const directDocuments = input?.documents || [];

    console.log(`[Router] Input analysis:`);
    console.log(`  - Classifications: ${classifications.length}`);
    console.log(`  - OCR Documents: ${ocrDocuments.length}`);
    console.log(`  - Direct Documents: ${directDocuments.length}`);

    // Determine what to filter based on input type
    let itemsToFilter = [];
    let sourceType = "unknown";

    if (classifications.length > 0) {
      // Classification output - filter classifications
      itemsToFilter = classifications;
      sourceType = "classification";
    } else if (ocrDocuments.length > 0 && ocrDocuments[0]?.result) {
      // OCR output - filter based on extracted fields
      itemsToFilter = ocrDocuments.map((doc) => ({
        ...doc.result,
        url: doc.url,
        filename: doc.filename,
        mimeType: doc.mimeType,
      }));
      sourceType = "ocr";
    } else if (directDocuments.length > 0) {
      // Direct documents with possible classification data
      itemsToFilter = directDocuments;
      sourceType = "documents";
    }

    console.log(
      `[Router] Source type: ${sourceType}, Items to filter: ${itemsToFilter.length}`
    );

    // Filter items based on conditions
    const matchedItems = filterItems(
      itemsToFilter,
      routeByField,
      operator,
      routeValue
    );
    console.log(`[Router] Matched items: ${matchedItems.length}`);

    // Check if we should skip (no matches and skipIfEmpty is true)
    if (matchedItems.length === 0 && skipIfEmpty) {
      console.log(
        `[Router] No matches and skipIfEmpty=true, marking as skipped`
      );
      const processingTime = Date.now() - startTime;

      return res.json({
        success: true,
        data: {
          matchedCount: 0,
          skipped: true,
          routeByField,
          operator,
          routeValue,
        },
        documents: [],
        metadata: {
          processingTime,
          serviceVersion: SERVICE_VERSION,
          sourceType,
          skipped: true,
        },
      });
    }

    // Build output based on outputMode
    const output = buildOutput(matchedItems, input, outputMode, sourceType);

    const processingTime = Date.now() - startTime;
    console.log(`[Router] Completed in ${processingTime}ms`);
    console.log(`[Router] Output mode: ${outputMode}`);
    console.log(`[Router] Output documents: ${output.documents?.length || 0}`);

    res.json({
      success: true,
      data: {
        matchedCount: matchedItems.length,
        routeByField,
        operator,
        routeValue,
        ...output.data,
      },
      documents: output.documents,
      metadata: {
        processingTime,
        serviceVersion: SERVICE_VERSION,
        sourceType,
        outputMode,
      },
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`[Router] Error:`, error.message);

    res.status(400).json({
      success: false,
      data: null,
      error: {
        code: "ROUTER_ERROR",
        message: error.message,
      },
      metadata: {
        processingTime,
        serviceVersion: SERVICE_VERSION,
      },
    });
  }
});

/**
 * Get nested value from object using dot notation
 * e.g., getNestedValue({a: {b: 1}}, "a.b") => 1
 */
function getNestedValue(obj, path) {
  if (!path || !obj) return undefined;

  const parts = path.split(".");
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }

  return current;
}

/**
 * Filter items based on field, operator, and value
 */
function filterItems(items, field, operator, value) {
  if (!items || items.length === 0) return [];
  if (!field || value === undefined || value === "") return items; // No filter = pass all

  return items.filter((item) => {
    const fieldValue = getNestedValue(item, field);

    if (fieldValue === undefined || fieldValue === null) {
      return false;
    }

    switch (operator) {
      case "equals":
        return String(fieldValue).toLowerCase() === String(value).toLowerCase();

      case "not_equals":
        return String(fieldValue).toLowerCase() !== String(value).toLowerCase();

      case "contains":
        return String(fieldValue)
          .toLowerCase()
          .includes(String(value).toLowerCase());

      case "greater_than":
        const numFieldGt = parseFloat(fieldValue);
        const numValueGt = parseFloat(value);
        return (
          !isNaN(numFieldGt) && !isNaN(numValueGt) && numFieldGt > numValueGt
        );

      case "less_than":
        const numFieldLt = parseFloat(fieldValue);
        const numValueLt = parseFloat(value);
        return (
          !isNaN(numFieldLt) && !isNaN(numValueLt) && numFieldLt < numValueLt
        );

      default:
        console.warn(`[Router] Unknown operator: ${operator}`);
        return false;
    }
  });
}

/**
 * Build output based on outputMode
 */
function buildOutput(matchedItems, input, outputMode, sourceType) {
  switch (outputMode) {
    case "documents_only":
      // For OCR - just document URLs
      return {
        data: {},
        documents: matchedItems
          .map((item) => ({
            url: item.documentUrl || item.url,
            filename: item.filename,
            mimeType: item.mimeType || "application/pdf",
          }))
          .filter((doc) => doc.url), // Only include items with URLs
      };

    case "filtered_data":
      // For DB Export - include all matched data in data section
      const documents = matchedItems.map((item) => ({
        url: item.documentUrl || item.url,
        filename: item.filename,
        mimeType: item.mimeType || "application/pdf",
        // Include all item data for DB Export
        ...item,
      }));

      return {
        data: {
          items: matchedItems,
          documents: documents,
        },
        documents: documents.filter((doc) => doc.url),
      };

    case "full_data":
      // Pass through everything from input
      return {
        data: input.data || input,
        documents: input.documents || [],
      };

    default:
      console.warn(
        `[Router] Unknown outputMode: ${outputMode}, defaulting to documents_only`
      );
      return {
        data: {},
        documents: matchedItems
          .map((item) => ({
            url: item.documentUrl || item.url,
            filename: item.filename,
            mimeType: item.mimeType || "application/pdf",
          }))
          .filter((doc) => doc.url),
      };
  }
}

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log(`Conditional Router service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Process endpoint: POST http://localhost:${PORT}/api/v1/process`);
});
