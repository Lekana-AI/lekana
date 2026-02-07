/**
 * Upload Service - Main Entry Point
 * File upload microservice for GCP Cloud Storage
 * Port: 4001
 */
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const {
  checkJwt,
  handleAuthError,
  extractUserInfo,
} = require("./middleware/auth.middleware");
const { processUpload, DEFAULT_CONFIG } = require("./services/upload.service");
const { checkBucketAccess, bucketName } = require("./services/storage.service");

const app = express();
const PORT = process.env.PORT || 4001;
const SERVICE_VERSION = "1.0.0";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max (validation happens in service)
  },
});

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

// ============================================
// Health Check Endpoint (Public)
// ============================================
app.get("/health", async (req, res) => {
  const bucketStatus = await checkBucketAccess();
  res.json({
    status: "ok",
    service: "upload-service",
    version: SERVICE_VERSION,
    bucket: bucketStatus,
  });
});

// ============================================
// Main Upload Endpoint (Protected)
// Follows ServiceRequest/ServiceResponse contract
// ============================================
app.post(
  "/api/v1/process",
  //checkJwt,
  handleAuthError,
  extractUserInfo,
  upload.array("files", 10),
  async (req, res) => {
    const startTime = Date.now();

    try {
      // Extract request body (ServiceRequest format)
      const {
        executionId,
        nodeId,
        workflowId,
        userId: requestUserId,
        input = {},
        config = {},
      } = req.body;

      // Log request
      console.log(
        `[Upload] Processing request from user: ${req.userId || requestUserId}`,
      );
      console.log(
        `[Upload] Execution: ${executionId}, Node: ${nodeId}, Workflow: ${workflowId}`,
      );
      console.log(`[Upload] Config:`, JSON.stringify(config));
      console.log(`[Upload] Input received:`, JSON.stringify(input, null, 2));

      // Combine input sources
      const combinedInput = {
        ...input,
        files: req.files || [],
        file: req.file || null,
      };

      // Find documents - they may be nested in different locations depending on how runtime sends them
      const docs =
        input.documents ||
        input.data?.documents ||
        input.data?.input?.documents ||
        [];

      // Check if documents are being passed through (URL references, not new uploads)
      const hasPassthroughDocs =
        docs.length > 0 &&
        docs[0].url &&
        (req.files?.length === 0 || !req.files);

      let result;

      if (hasPassthroughDocs) {
        // Pass-through mode: Forward existing URLs without re-uploading
        console.log(`[Upload] Pass-through mode: ${docs.length} document(s)`);
        result = {
          uploadedFiles: docs.map((doc) => ({
            url: doc.url,
            filename: doc.filename || "unknown",
            mimeType: doc.mimeType || "application/octet-stream",
            passthrough: true,
          })),
          totalFiles: docs.length,
          successCount: docs.length,
          errorCount: 0,
        };
      } else {
        // Normal upload mode: Process new file uploads
        // Pass userId and workflowId for folder organization
        const userId = req.userId || requestUserId || "anonymous";
        result = await processUpload(combinedInput, config, {
          userId,
          workflowId,
        });
      }

      // Build response in ServiceResponse format
      const processingTime = Date.now() - startTime;

      const response = {
        success: true,
        data: {
          uploadedFiles: result.uploadedFiles,
        },
        documents: result.uploadedFiles.map((f) => ({
          url: f.signedUrl || f.url,
          storagePath: f.storagePath, // Actual GCS path for generating signed URLs later
          filename: f.filename,
          mimeType: f.mimeType,
        })),
        metadata: {
          processingTime,
          serviceVersion: SERVICE_VERSION,
          bucket: bucketName,
          totalFiles: result.totalFiles,
          successCount: result.successCount,
          errorCount: result.errorCount,
        },
      };

      // Include errors if any files failed
      if (result.errors && result.errors.length > 0) {
        response.data.errors = result.errors;
      }

      console.log(
        `[Upload] Completed in ${processingTime}ms - ${result.successCount}/${result.totalFiles} files uploaded`,
      );
      res.json(response);
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`[Upload] Error:`, error.message);

      res.status(400).json({
        success: false,
        data: null,
        error: {
          code: "UPLOAD_ERROR",
          message: error.message,
        },
        metadata: {
          processingTime,
          serviceVersion: SERVICE_VERSION,
          bucket: bucketName,
        },
      });
    }
  },
);

// ============================================
// Direct Upload Endpoint (for multipart form data)
// ============================================
app.post(
  "/api/v1/upload",
  //checkJwt,
  handleAuthError,
  extractUserInfo,
  upload.array("files", 10),
  async (req, res) => {
    const startTime = Date.now();

    try {
      // Parse config from form data if provided
      let config = DEFAULT_CONFIG;
      if (req.body.config) {
        try {
          config = { ...DEFAULT_CONFIG, ...JSON.parse(req.body.config) };
        } catch (e) {
          // Use defaults if config parsing fails
        }
      }

      // Extract userId and workflowId from form data for folder organization
      const userId = req.body.userId || req.userId || "anonymous";
      const workflowId = req.body.workflowId;

      if (userId && workflowId) {
        console.log(`[Upload] Organizing files into: ${userId}/${workflowId}/`);
      }

      const input = {
        files: req.files || [],
        file: req.file || null,
      };

      const result = await processUpload(input, config, { userId, workflowId });
      const processingTime = Date.now() - startTime;

      res.json({
        success: true,
        data: {
          uploadedFiles: result.uploadedFiles,
        },
        documents: result.uploadedFiles.map((f) => ({
          url: f.signedUrl || f.url,
          storagePath: f.storagePath, // Actual GCS path for generating signed URLs later
          filename: f.filename,
          mimeType: f.mimeType,
        })),
        metadata: {
          processingTime,
          serviceVersion: SERVICE_VERSION,
          bucket: bucketName,
        },
      });
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`[Upload] Error:`, error.message);

      res.status(400).json({
        success: false,
        data: null,
        error: {
          code: "UPLOAD_ERROR",
          message: error.message,
        },
        metadata: {
          processingTime,
          serviceVersion: SERVICE_VERSION,
          bucket: bucketName,
        },
      });
    }
  },
);

// ============================================
// Signed URL Endpoint
// Generates fresh signed URLs for existing files
// ============================================
app.post(
  "/api/v1/signed-url",
  //checkJwt,
  handleAuthError,
  extractUserInfo,
  async (req, res) => {
    try {
      const { storagePath, expiryMinutes = 60 } = req.body;

      if (!storagePath) {
        return res.status(400).json({
          success: false,
          error: { code: "MISSING_PATH", message: "storagePath is required" },
        });
      }

      // Import generateSignedUrl from storage service
      const { generateSignedUrl } = require("./services/storage.service");

      // Handle different storage path formats
      let filePath = storagePath;

      // If it's a full GCS URL, extract the path
      if (storagePath.includes("storage.googleapis.com")) {
        const url = new URL(storagePath);
        // Remove leading slash and bucket name from path
        filePath = url.pathname.split("/").slice(2).join("/");
      } else if (storagePath.startsWith("gs://")) {
        // Handle gs:// format
        filePath = storagePath.replace(/^gs:\/\/[^\/]+\//, "");
      }

      const signedUrl = await generateSignedUrl(filePath, expiryMinutes);

      res.json({
        success: true,
        data: {
          signedUrl,
          storagePath: filePath,
          expiresIn: expiryMinutes * 60, // seconds
        },
      });
    } catch (error) {
      console.error("[Upload] Error generating signed URL:", error.message);
      res.status(400).json({
        success: false,
        error: { code: "SIGNED_URL_ERROR", message: error.message },
      });
    }
  },
);

// ============================================
// Decrypt and Stream Endpoint
// Fetches encrypted file from GCS, decrypts it, and returns content
// ============================================
app.post(
  "/api/v1/decrypt",
  handleAuthError,
  extractUserInfo,
  async (req, res) => {
    try {
      const { storagePath } = req.body;

      if (!storagePath) {
        return res.status(400).json({
          success: false,
          error: { code: "MISSING_PATH", message: "storagePath is required" },
        });
      }

      const { Storage } = require("@google-cloud/storage");
      const { decryptBuffer } = require("./utils/encryption");

      const storage = new Storage();
      const bucket = storage.bucket(bucketName);

      // Handle different storage path formats
      let filePath = storagePath;
      if (storagePath.includes("storage.googleapis.com")) {
        const url = new URL(storagePath);
        filePath = url.pathname.split("/").slice(2).join("/");
      } else if (storagePath.startsWith("gs://")) {
        filePath = storagePath.replace(/^gs:\/\/[^\/]+\//, "");
      }

      console.log(`[Decrypt] Fetching and decrypting: ${filePath}`);

      // Download encrypted file from GCS
      const file = bucket.file(filePath);
      const [exists] = await file.exists();

      if (!exists) {
        return res.status(404).json({
          success: false,
          error: { code: "FILE_NOT_FOUND", message: "File not found" },
        });
      }

      // Get file metadata to determine content type
      const [metadata] = await file.getMetadata();
      const contentType = metadata.contentType || "application/octet-stream";
      const originalFilename =
        metadata.metadata?.originalFilename || filePath.split("/").pop();

      // Download the file
      const [encryptedBuffer] = await file.download();

      // Decrypt the buffer (handles both encrypted and unencrypted files)
      const decryptedBuffer = decryptBuffer(encryptedBuffer);

      console.log(
        `[Decrypt] Successfully decrypted: ${originalFilename} (${decryptedBuffer.length} bytes)`,
      );

      // Set appropriate headers for browser display
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Length", decryptedBuffer.length);
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${encodeURIComponent(originalFilename)}"`,
      );
      res.setHeader("Cache-Control", "private, max-age=3600");

      // Send decrypted content
      res.send(decryptedBuffer);
    } catch (error) {
      console.error("[Decrypt] Error:", error.message);
      res.status(500).json({
        success: false,
        error: { code: "DECRYPT_ERROR", message: error.message },
      });
    }
  },
);

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log(`Upload service running on port ${PORT}`);
  console.log(
    `Clerk Domain: ${
      process.env.CLERK_DOMAIN || "your-app.clerk.accounts.dev"
    }`,
  );
  console.log(`GCS Bucket: ${bucketName}`);
});
