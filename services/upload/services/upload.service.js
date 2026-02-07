/**
 * Upload Service
 * Handles file validation, ZIP extraction, and processing
 */
const path = require("path");
const AdmZip = require("adm-zip");
const { uploadFileWithSignedUrl } = require("./storage.service");

// MIME type mappings for allowed extensions
const MIME_TYPES = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  tiff: "image/tiff",
};

// Document AI supported file types
const DOCUMENT_AI_TYPES = ["pdf", "png", "jpg", "jpeg", "tiff"];

// Default configuration
const DEFAULT_CONFIG = {
  stepName: "File Upload",
  bulkUpload: false,
  maxFileSizeMB: 20,
  allowedFileTypes: DOCUMENT_AI_TYPES,
};

/**
 * Check if a file is a ZIP archive
 * @param {Object} file - File object with buffer, filename, mimeType
 * @returns {boolean}
 */
function isZipFile(file) {
  if (!file) return false;
  const mimeType = file.mimeType || file.mimetype || "";
  const filename = file.filename || file.originalname || "";
  return (
    mimeType === "application/zip" ||
    mimeType === "application/x-zip-compressed" ||
    filename.toLowerCase().endsWith(".zip")
  );
}

/**
 * Extract files from a ZIP archive
 * @param {Buffer} zipBuffer - ZIP file buffer
 * @returns {Array} Array of file objects with buffer, filename, mimeType, size
 */
function extractZipFiles(zipBuffer) {
  const zip = new AdmZip(zipBuffer);
  const entries = zip.getEntries();
  const files = [];

  for (const entry of entries) {
    // Skip directories
    if (entry.isDirectory) continue;

    // Skip macOS hidden files and __MACOSX folder
    const entryName = entry.entryName;
    if (
      entryName.startsWith("__MACOSX/") ||
      entryName.startsWith("._") ||
      path.basename(entryName).startsWith("._") ||
      path.basename(entryName).startsWith(".")
    ) {
      console.log(`[Upload] Skipping hidden/system file in ZIP: ${entryName}`);
      continue;
    }

    const ext = path.extname(entryName).toLowerCase().replace(".", "");
    const mimeType = MIME_TYPES[ext] || "application/octet-stream";

    files.push({
      buffer: entry.getData(),
      filename: path.basename(entryName),
      mimeType,
      size: entry.header.size,
      fromZip: true,
    });
  }

  return files;
}

/**
 * Validate file against configuration rules
 * @param {Object} file - File object with buffer, filename, size, mimeType
 * @param {Object} config - Upload configuration
 * @returns {{valid: boolean, error?: string, skip?: boolean}}
 */
function validateFile(file, config) {
  // Skip macOS hidden/metadata files (they're not real documents)
  const basename = path.basename(file.filename);
  if (basename.startsWith("._") || basename.startsWith(".")) {
    return {
      valid: false,
      skip: true, // Silently skip, don't treat as error
      error: `Skipping hidden file: ${file.filename}`,
    };
  }

  const maxSizeBytes =
    (config.maxFileSizeMB || DEFAULT_CONFIG.maxFileSizeMB) * 1024 * 1024;
  const allowedTypes =
    config.allowedFileTypes || DEFAULT_CONFIG.allowedFileTypes;

  // Expand "images" keyword to specific extensions
  let expandedAllowedTypes = [...allowedTypes];
  if (expandedAllowedTypes.includes("images")) {
    expandedAllowedTypes = expandedAllowedTypes.filter((t) => t !== "images");
    expandedAllowedTypes.push("png", "jpg", "jpeg", "tiff");
  }

  // Check file size
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File "${file.filename}" exceeds maximum size of ${
        config.maxFileSizeMB || DEFAULT_CONFIG.maxFileSizeMB
      }MB`,
    };
  }

  // Check file extension
  const ext = path.extname(file.filename).toLowerCase().replace(".", "");
  if (!expandedAllowedTypes.includes(ext)) {
    return {
      valid: false,
      error: `File type "${ext}" is not allowed. Allowed types: ${expandedAllowedTypes.join(
        ", ",
      )}`,
    };
  }

  return { valid: true };
}

/**
 * Convert base64 document to file object
 * @param {Object} doc - Document with base64 content
 * @returns {Object} File object with buffer
 */
function base64ToFile(doc) {
  const buffer = Buffer.from(doc.base64 || doc.content, "base64");
  return {
    buffer,
    filename: doc.filename || doc.name || "unknown",
    mimeType: doc.mimeType || doc.type || "application/octet-stream",
    size: buffer.length,
  };
}

/**
 * Process upload request
 * @param {Object} input - Input containing documents or files
 * @param {Object} config - Upload configuration
 * @param {Object} context - Context containing userId and workflowId for folder organization
 * @returns {Promise<Object>} Upload results with uploadedFiles and skippedFiles
 */
async function processUpload(input, config = {}, context = {}) {
  const { userId, workflowId } = context;
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const startTime = Date.now();
  const results = [];
  const errors = [];
  const skippedFiles = [];

  // Build folder path based on userId and workflowId
  let folderPath = "uploads";
  if (userId && workflowId) {
    folderPath = `${userId}/${workflowId}`;
    console.log(`[Upload] Organizing files into folder: ${folderPath}`);
  } else if (userId) {
    folderPath = `${userId}/uploads`;
    console.log(`[Upload] Organizing files into user folder: ${folderPath}`);
  }

  // Get files from input (either base64 documents or multipart files)
  let rawFiles = [];

  // Handle base64 documents from workflow input
  if (input.documents && Array.isArray(input.documents)) {
    rawFiles = input.documents.map((doc) => base64ToFile(doc));
  }

  // Handle multipart form data files
  if (input.files && Array.isArray(input.files)) {
    rawFiles = [
      ...rawFiles,
      ...input.files.map((f) => ({
        buffer: f.buffer,
        filename: f.originalname || f.filename,
        mimeType: f.mimetype || f.mimeType,
        size: f.size || f.buffer.length,
      })),
    ];
  }

  // Handle single file
  if (input.file) {
    rawFiles.push({
      buffer: input.file.buffer,
      filename: input.file.originalname || input.file.filename,
      mimeType: input.file.mimetype || input.file.mimeType,
      size: input.file.size || input.file.buffer.length,
    });
  }

  // Check for ZIP files
  const zipFiles = rawFiles.filter((f) => isZipFile(f));
  const nonZipFiles = rawFiles.filter((f) => !isZipFile(f));

  // If bulkUpload is disabled, reject ZIP files and multiple files
  if (!mergedConfig.bulkUpload) {
    if (zipFiles.length > 0) {
      throw new Error(
        "ZIP files require bulk upload to be enabled. Enable 'Bulk Upload' in your Upload node configuration.",
      );
    }
    if (rawFiles.length > 1) {
      throw new Error(
        "Bulk upload is disabled. Only one file allowed at a time.",
      );
    }
  }

  // Process files: extract ZIPs and collect all files
  let files = [...nonZipFiles];

  for (const zipFile of zipFiles) {
    try {
      console.log(`[Upload] Extracting ZIP file: ${zipFile.filename}`);
      const extractedFiles = extractZipFiles(zipFile.buffer);
      console.log(`[Upload] Extracted ${extractedFiles.length} files from ZIP`);
      files = [...files, ...extractedFiles];
    } catch (err) {
      throw new Error(
        `Failed to extract ZIP file "${zipFile.filename}": ${err.message}`,
      );
    }
  }

  // Final check: if bulk disabled but somehow still multiple files
  if (!mergedConfig.bulkUpload && files.length > 1) {
    throw new Error(
      "Bulk upload is disabled. Only one file allowed at a time.",
    );
  }

  // Handle passthrough mode - if documents have URLs but no base64, just pass them through
  if (files.length === 0 && input.documents && Array.isArray(input.documents)) {
    const urlDocs = input.documents.filter(
      (doc) => doc.url && !doc.base64 && !doc.content,
    );
    if (urlDocs.length > 0) {
      // Passthrough mode - documents already have URLs (from previous upload)
      return {
        uploadedFiles: urlDocs.map((doc) => ({
          filename: doc.filename || "unknown",
          url: doc.url,
          signedUrl: doc.url,
          size: doc.size || 0,
          mimeType: doc.mimeType || "application/octet-stream",
          uploadedAt: new Date().toISOString(),
          passthrough: true,
        })),
        errors: undefined,
        processingTime: 0,
        totalFiles: urlDocs.length,
        successCount: urlDocs.length,
        errorCount: 0,
        mode: "passthrough",
      };
    }
  }

  // If no files at all, return a mock/test response for development
  if (files.length === 0) {
    console.log("[Upload] No files provided - returning test response");
    return {
      uploadedFiles: [],
      errors: undefined,
      processingTime: 0,
      totalFiles: 0,
      successCount: 0,
      errorCount: 0,
      mode: "no-files",
      message:
        "No files provided. To upload files, send base64 encoded documents or use multipart form upload.",
    };
  }

  // Process each file
  for (const file of files) {
    // Validate file
    const validation = validateFile(file, mergedConfig);
    if (!validation.valid) {
      if (validation.skip) {
        // Silently skip hidden files (e.g., macOS ._files)
        console.log(`[Upload] ${validation.error}`);
        continue;
      }
      // Track as skipped file (not a hard error, workflow can continue)
      console.log(
        `[Upload] Skipping invalid file: ${file.filename} - ${validation.error}`,
      );
      skippedFiles.push({
        filename: file.filename,
        reason: validation.error,
        fromZip: file.fromZip || false,
      });
      continue;
    }

    try {
      // Upload to GCS with folder path for organization
      const uploadResult = await uploadFileWithSignedUrl(
        file.buffer,
        file.filename,
        file.mimeType,
        folderPath,
      );

      results.push({
        filename: file.filename,
        storagePath: uploadResult.storagePath, // The GCS path for generating signed URLs later
        url: uploadResult.url,
        signedUrl: uploadResult.signedUrl,
        size: uploadResult.size,
        mimeType: uploadResult.mimeType,
        uploadedAt: uploadResult.uploadedAt,
        fromZip: file.fromZip || false,
      });
    } catch (error) {
      // Upload failed - add to errors (hard failures)
      errors.push({
        filename: file.filename,
        error: error.message,
      });
    }
  }

  const processingTime = Date.now() - startTime;

  // If all files failed (no valid uploads and we had files to process), throw error
  if (results.length === 0 && files.length > 0 && errors.length > 0) {
    throw new Error(
      `All files failed to upload: ${errors.map((e) => e.error).join("; ")}`,
    );
  }

  // If we had files but none were valid (all skipped), throw error
  if (results.length === 0 && skippedFiles.length > 0 && errors.length === 0) {
    throw new Error(
      `No valid files found. All ${skippedFiles.length} file(s) were skipped: ${skippedFiles.map((s) => `${s.filename} (${s.reason})`).join("; ")}`,
    );
  }

  return {
    uploadedFiles: results,
    skippedFiles: skippedFiles.length > 0 ? skippedFiles : undefined,
    errors: errors.length > 0 ? errors : undefined,
    processingTime,
    totalFiles: files.length,
    successCount: results.length,
    skippedCount: skippedFiles.length,
    errorCount: errors.length,
  };
}

module.exports = {
  processUpload,
  validateFile,
  base64ToFile,
  isZipFile,
  extractZipFiles,
  DEFAULT_CONFIG,
  DOCUMENT_AI_TYPES,
};
