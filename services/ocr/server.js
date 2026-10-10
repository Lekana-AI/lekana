/**
 * OCR Service - Main Entry Point
 * Hybrid Document AI + Gemini extraction microservice
 * Port: 4004
 */
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const {
  checkJwt,
  handleAuthError,
  extractUserInfo,
} = require("./middleware/auth.middleware");
const documentAiService = require("./services/document-ai.service");
const geminiService = require("./services/gemini.service");

const app = express();
const PORT = process.env.PORT || 4004;
const SERVICE_VERSION = "1.0.0";

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

// ============================================
// Health Check Endpoint (Public)
// ============================================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ocr-service",
    version: SERVICE_VERSION,
    features: {
      documentAi: {
        formParser: !!process.env.DOCUMENT_AI_FORM_PARSER_ID,
        ocrProcessor: !!process.env.DOCUMENT_AI_OCR_PROCESSOR_ID,
      },
      gemini: !!process.env.GEMINI_API_KEY,
    },
  });
});

// ============================================
// Main OCR Processing Endpoint (Protected)
// Follows ServiceRequest/ServiceResponse contract
// ============================================
app.post(
  "/api/v1/process",
  // checkJwt, // Uncomment for production
  handleAuthError,
  extractUserInfo,
  async (req, res) => {
    const startTime = Date.now();

    try {
      const {
        executionId,
        nodeId,
        workflowId,
        userId: requestUserId,
        input = {},
        config = {},
      } = req.body;

      const {
        extractFields,
        fieldPrompts,
        processorType,
        outputMode,
        isRefined,
      } = config;
      const documents = input.documents || [];

      // Parse extractFields - supports both old format (string[]) and new format ([{fieldName, fieldPrompt}])
      let targetFields = [];
      let customPrompts = fieldPrompts || {};

      if (Array.isArray(extractFields) && extractFields.length > 0) {
        if (typeof extractFields[0] === "string") {
          // Old format: ["field1", "field2"]
          targetFields = extractFields;
        } else if (typeof extractFields[0] === "object") {
          // New format: [{fieldName, fieldPrompt}] or [{key, value}] from keyValue UI
          targetFields = [];
          customPrompts = {};
          for (const field of extractFields) {
            const fieldName = field.fieldName || field.key;
            const fieldPrompt = field.fieldPrompt || field.value;
            if (fieldName) {
              targetFields.push(fieldName);
              if (fieldPrompt) {
                customPrompts[fieldName] = fieldPrompt;
              }
            }
          }
        }
      }

      console.log(`[OCR] Parsed extractFields:`);
      console.log(`  - targetFields: ${JSON.stringify(targetFields)}`);
      console.log(`  - customPrompts: ${JSON.stringify(customPrompts)}`);

      console.log(
        `[OCR] Processing request - Execution: ${executionId}, Node: ${nodeId}`,
      );
      console.log(
        `[OCR] Config: extractFields=${
          targetFields?.length || 0
        }, processorType=${processorType || "auto"}`,
      );

      if (!documents.length) {
        throw new Error("No documents provided in input.documents");
      }

      const results = [];

      for (const doc of documents) {
        console.log(`[OCR] Processing document: ${doc.filename}`);

        // Detect mimeType from filename if not provided or if incorrectly set
        let mimeType = doc.mimeType;
        const filename = doc.filename || doc.url || "";
        const ext = filename.toLowerCase().split(".").pop();

        // Map of common extensions to mimeTypes
        const mimeMap = {
          pdf: "application/pdf",
          png: "image/png",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          tiff: "image/tiff",
          tif: "image/tiff",
          gif: "image/gif",
          bmp: "image/bmp",
          webp: "image/webp",
        };

        // If mimeType is missing or is wrong (e.g., PDF for a PNG file), detect from extension
        if (
          !mimeType ||
          (mimeType === "application/pdf" &&
            ext &&
            ext !== "pdf" &&
            mimeMap[ext])
        ) {
          const detectedMime = mimeMap[ext];
          if (detectedMime) {
            console.log(
              `[OCR] Detected mimeType from extension: ${ext} -> ${detectedMime}`,
            );
            mimeType = detectedMime;
          } else {
            mimeType = "application/pdf"; // Default fallback
          }
        }

        // Fetch the document
        const fileBuffer = await geminiService.fetchFileBuffer(doc.url);

        // STEP 1: Document AI Processing
        let rawOcrData;

        // Determine processor type
        const useFormParser =
          processorType === "FORM_PARSER" ||
          (targetFields && targetFields.length > 0);

        if (useFormParser) {
          console.log(
            "[OCR] Step 1: Using Form Parser (extractFields provided)",
          );
          rawOcrData = await documentAiService.processForm(
            fileBuffer,
            mimeType,
          );
        } else {
          console.log("[OCR] Step 1: Using Enterprise OCR (no extractFields)");
          rawOcrData = await documentAiService.processOcr(fileBuffer, mimeType);
        }

        console.log(
          `[OCR] Document AI completed. Text length: ${
            rawOcrData.text?.length || 0
          }`,
        );

        // STEP 2: Gemini Refinement
        console.log("[OCR] Step 2: Gemini refinement...");
        const refinedData = await geminiService.refineExtraction({
          fileBuffer,
          mimeType,
          previousOcrData: rawOcrData,
          outputMode: outputMode || "auto",
          targetFields: targetFields,
          customPrompts: customPrompts,
        });

        // Build result based on isRefined flag
        const docResult = {
          filename: doc.filename,
          url: doc.url,
          result: refinedData,
          processorUsed: useFormParser ? "FORM_PARSER" : "OCR_PROCESSOR",
          tokensUsed: refinedData.tokensUsed || null,
        };

        // If isRefined is true, include the raw Document AI result as well
        if (isRefined) {
          docResult.documentAiResult = rawOcrData;
        }

        results.push(docResult);
      }

      const processingTime = Date.now() - startTime;
      console.log(`[OCR] Completed in ${processingTime}ms`);

      // Aggregate total tokens used across all documents
      const totalTokensUsed = results.reduce((sum, r) => {
        return sum + (r.tokensUsed?.totalTokens || 0);
      }, 0);

      // Build ServiceResponse
      res.json({
        success: true,
        data: {
          documents: results,
          summary: {
            totalDocuments: documents.length,
            processedDocuments: results.length,
            extractFields: targetFields || [],
            hasFieldPrompts: !!(
              customPrompts && Object.keys(customPrompts).length
            ),
          },
        },
        documents: documents.map((d) => ({
          url: d.url,
          filename: d.filename,
          mimeType: d.mimeType,
        })),
        metadata: {
          processingTime,
          serviceVersion: SERVICE_VERSION,
          steps: ["DOCUMENT_AI", "GEMINI_REFINEMENT"],
          tokensUsed: totalTokensUsed, // Total tokens used for billing/tracking
        },
      });
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`[OCR] Error:`, error.message);

      res.status(400).json({
        success: false,
        data: null,
        error: {
          code: "OCR_ERROR",
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
// Processor Configuration Endpoint (Protected)
// Manage Document AI processor versions
// ============================================
app.post(
  "/api/v1/configure",
  // checkJwt, // Uncomment for production
  handleAuthError,
  extractUserInfo,
  async (req, res) => {
    const startTime = Date.now();

    try {
      const {
        action,
        processorId,
        versionId,
        versionName,
        trainDataUri,
        testDataUri,
      } = req.body;

      if (!action) {
        throw new Error(
          "Action is required (train, deploy, list-versions, set-default)",
        );
      }

      let result;

      switch (action) {
        case "train":
          if (!processorId || !versionName) {
            throw new Error(
              "processorId and versionName are required for training",
            );
          }
          result = await documentAiService.trainProcessorVersion(
            processorId,
            versionName,
            trainDataUri,
            testDataUri,
          );
          break;

        case "deploy":
          if (!processorId || !versionId) {
            throw new Error(
              "processorId and versionId are required for deployment",
            );
          }
          result = await documentAiService.deployProcessorVersion(
            processorId,
            versionId,
          );
          break;

        case "list-versions":
          if (!processorId) {
            throw new Error("processorId is required");
          }
          result = await documentAiService.listProcessorVersions(processorId);
          break;

        case "set-default":
          if (!processorId || !versionId) {
            throw new Error("processorId and versionId are required");
          }
          result = await documentAiService.setDefaultVersion(
            processorId,
            versionId,
          );
          break;

        default:
          throw new Error(`Unknown action: ${action}`);
      }

      const processingTime = Date.now() - startTime;

      res.json({
        success: true,
        action,
        data: result,
        metadata: {
          processingTime,
          serviceVersion: SERVICE_VERSION,
        },
      });
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`[OCR] Configure error:`, error.message);

      res.status(400).json({
        success: false,
        action: req.body.action,
        error: {
          code: "CONFIGURE_ERROR",
          message: error.message,
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
// Check Training Operation Status (Protected)
// ============================================
app.get(
  "/api/v1/configure/status/:operationId",
  //checkJwt, // Uncomment for production
  handleAuthError,
  extractUserInfo,
  async (req, res) => {
    try {
      const { operationId } = req.params;

      if (!operationId) {
        throw new Error("operationId is required");
      }

      const result = await documentAiService.checkOperationStatus(operationId);

      res.json({
        success: true,
        data: result,
        metadata: {
          serviceVersion: SERVICE_VERSION,
        },
      });
    } catch (error) {
      console.error(`[OCR] Status check error:`, error.message);

      res.status(400).json({
        success: false,
        error: {
          code: "STATUS_CHECK_ERROR",
          message: error.message,
        },
        metadata: {
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
  console.log(`OCR service running on port ${PORT}`);
  console.log(
    `Clerk Domain: ${
      process.env.CLERK_DOMAIN || "not configured"
    }`,
  );
  console.log(
    `Document AI Project: ${process.env.DOCUMENT_AI_PROJECT_ID || "NOT SET"}`,
  );
  console.log(
    `Gemini API: ${process.env.GEMINI_API_KEY ? "Configured" : "NOT SET"}`,
  );
});
