/**
 * Upload Service
 * Handles file validation and processing
 */
const path = require('path');
const { uploadFileWithSignedUrl } = require('./storage.service');

// MIME type mappings for allowed extensions
const MIME_TYPES = {
  'pdf': 'application/pdf',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'tiff': 'image/tiff'
};

// Default configuration
const DEFAULT_CONFIG = {
  stepName: 'File Upload',
  bulkUpload: false,
  maxFileSizeMB: 20,
  allowedFileTypes: ['pdf', 'png', 'jpg', 'jpeg', 'tiff']
};

/**
 * Validate file against configuration rules
 * @param {Object} file - File object with buffer, filename, size, mimeType
 * @param {Object} config - Upload configuration
 * @returns {{valid: boolean, error?: string}}
 */
function validateFile(file, config) {
  const maxSizeBytes = (config.maxFileSizeMB || DEFAULT_CONFIG.maxFileSizeMB) * 1024 * 1024;
  const allowedTypes = config.allowedFileTypes || DEFAULT_CONFIG.allowedFileTypes;

  // Check file size
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File "${file.filename}" exceeds maximum size of ${config.maxFileSizeMB || DEFAULT_CONFIG.maxFileSizeMB}MB`
    };
  }

  // Check file extension
  const ext = path.extname(file.filename).toLowerCase().replace('.', '');
  if (!allowedTypes.includes(ext)) {
    return {
      valid: false,
      error: `File type "${ext}" is not allowed. Allowed types: ${allowedTypes.join(', ')}`
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
  const buffer = Buffer.from(doc.base64 || doc.content, 'base64');
  return {
    buffer,
    filename: doc.filename || doc.name || 'unknown',
    mimeType: doc.mimeType || doc.type || 'application/octet-stream',
    size: buffer.length
  };
}

/**
 * Process upload request
 * @param {Object} input - Input containing documents or files
 * @param {Object} config - Upload configuration
 * @returns {Promise<Object>} Upload results
 */
async function processUpload(input, config = {}) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const startTime = Date.now();
  const results = [];
  const errors = [];

  // Get files from input (either base64 documents or multipart files)
  let files = [];

  // Handle base64 documents from workflow input
  if (input.documents && Array.isArray(input.documents)) {
    files = input.documents.map(doc => base64ToFile(doc));
  }

  // Handle multipart form data files
  if (input.files && Array.isArray(input.files)) {
    files = [...files, ...input.files.map(f => ({
      buffer: f.buffer,
      filename: f.originalname || f.filename,
      mimeType: f.mimetype || f.mimeType,
      size: f.size || f.buffer.length
    }))];
  }

  // Handle single file
  if (input.file) {
    files.push({
      buffer: input.file.buffer,
      filename: input.file.originalname || input.file.filename,
      mimeType: input.file.mimetype || input.file.mimeType,
      size: input.file.size || input.file.buffer.length
    });
  }

  // Check bulk upload constraint
  if (!mergedConfig.bulkUpload && files.length > 1) {
    throw new Error(`Bulk upload is disabled. Only one file allowed at a time.`);
  }

  // Handle passthrough mode - if documents have URLs but no base64, just pass them through
  if (files.length === 0 && input.documents && Array.isArray(input.documents)) {
    const urlDocs = input.documents.filter(doc => doc.url && !doc.base64 && !doc.content);
    if (urlDocs.length > 0) {
      // Passthrough mode - documents already have URLs (from previous upload)
      return {
        uploadedFiles: urlDocs.map(doc => ({
          filename: doc.filename || 'unknown',
          url: doc.url,
          signedUrl: doc.url,
          size: doc.size || 0,
          mimeType: doc.mimeType || 'application/octet-stream',
          uploadedAt: new Date().toISOString(),
          passthrough: true
        })),
        errors: undefined,
        processingTime: 0,
        totalFiles: urlDocs.length,
        successCount: urlDocs.length,
        errorCount: 0,
        mode: 'passthrough'
      };
    }
  }

  // If no files at all, return a mock/test response for development
  if (files.length === 0) {
    console.log('[Upload] No files provided - returning test response');
    return {
      uploadedFiles: [],
      errors: undefined,
      processingTime: 0,
      totalFiles: 0,
      successCount: 0,
      errorCount: 0,
      mode: 'no-files',
      message: 'No files provided. To upload files, send base64 encoded documents or use multipart form upload.'
    };
  }

  // Process each file
  for (const file of files) {
    // Validate file
    const validation = validateFile(file, mergedConfig);
    if (!validation.valid) {
      errors.push({
        filename: file.filename,
        error: validation.error
      });
      continue;
    }

    try {
      // Upload to GCS
      const uploadResult = await uploadFileWithSignedUrl(
        file.buffer,
        file.filename,
        file.mimeType
      );

      results.push({
        filename: file.filename,
        url: uploadResult.url,
        signedUrl: uploadResult.signedUrl,
        size: uploadResult.size,
        mimeType: uploadResult.mimeType,
        uploadedAt: uploadResult.uploadedAt
      });
    } catch (error) {
      errors.push({
        filename: file.filename,
        error: error.message
      });
    }
  }

  const processingTime = Date.now() - startTime;

  // If all files failed, throw error
  if (results.length === 0 && errors.length > 0) {
    throw new Error(`All files failed to upload: ${errors.map(e => e.error).join('; ')}`);
  }

  return {
    uploadedFiles: results,
    errors: errors.length > 0 ? errors : undefined,
    processingTime,
    totalFiles: files.length,
    successCount: results.length,
    errorCount: errors.length
  };
}

module.exports = {
  processUpload,
  validateFile,
  base64ToFile,
  DEFAULT_CONFIG
};
