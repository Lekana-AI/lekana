/**
 * GCP Cloud Storage Service
 * Handles file uploads and signed URL generation
 */
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { encryptBuffer, isEncryptionEnabled } = require("../utils/encryption");

// Initialize GCP Storage client
const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME;
if (!bucketName) {
  console.warn("GCS_BUCKET_NAME is not set - uploads will fail");
}
const signedUrlExpiryMinutes = parseInt(
  process.env.SIGNED_URL_EXPIRY_MINUTES || "60",
  10,
);

/**
 * Get the storage bucket
 */
function getBucket() {
  return storage.bucket(bucketName);
}

/**
 * Generate a unique filename with timestamp and UUID
 * @param {string} originalFilename - Original filename
 * @returns {string} Unique filename
 */
function generateUniqueFilename(originalFilename) {
  const ext = path.extname(originalFilename);
  const baseName = path.basename(originalFilename, ext);
  const timestamp = Date.now();
  const uuid = uuidv4().slice(0, 8);
  return `${baseName}_${timestamp}_${uuid}${ext}`;
}

/**
 * Upload a file to GCP Cloud Storage
 * @param {Buffer} buffer - File buffer
 * @param {string} originalFilename - Original filename
 * @param {string} mimeType - File MIME type
 * @param {string} folder - Optional folder path in bucket
 * @returns {Promise<{filename: string, url: string, size: number}>}
 */
async function uploadFile(
  buffer,
  originalFilename,
  mimeType,
  folder = "uploads",
) {
  const uniqueFilename = generateUniqueFilename(originalFilename);
  const filePath = `${folder}/${uniqueFilename}`;
  const bucket = getBucket();
  const file = bucket.file(filePath);

  // Encrypt the buffer if encryption is enabled
  let dataToUpload = buffer;
  if (isEncryptionEnabled()) {
    console.log(`[Storage] Encrypting file: ${originalFilename}`);
    dataToUpload = encryptBuffer(buffer);
  } else {
    console.log(
      `[Storage] Encryption not enabled, uploading plaintext: ${originalFilename}`,
    );
  }

  await file.save(dataToUpload, {
    metadata: {
      contentType: mimeType,
      metadata: {
        originalFilename: originalFilename,
        encrypted: isEncryptionEnabled() ? "true" : "false",
      },
    },
    resumable: false,
  });

  const publicUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;

  return {
    filename: uniqueFilename,
    storagePath: filePath,
    url: publicUrl,
    size: buffer.length,
    mimeType: mimeType,
  };
}

/**
 * Generate a signed URL for temporary access
 * @param {string} filePath - Path to file in bucket
 * @param {number} expiryMinutes - Expiry time in minutes (default from env)
 * @returns {Promise<string>} Signed URL
 */
async function generateSignedUrl(
  filePath,
  expiryMinutes = signedUrlExpiryMinutes,
) {
  const bucket = getBucket();
  const file = bucket.file(filePath);

  const [signedUrl] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + expiryMinutes * 60 * 1000,
  });

  return signedUrl;
}

/**
 * Upload file and return both public URL and signed URL
 * @param {Buffer} buffer - File buffer
 * @param {string} originalFilename - Original filename
 * @param {string} mimeType - File MIME type
 * @param {string} folder - Optional folder path
 * @returns {Promise<Object>} Upload result with URLs
 */
async function uploadFileWithSignedUrl(
  buffer,
  originalFilename,
  mimeType,
  folder = "uploads",
) {
  const uploadResult = await uploadFile(
    buffer,
    originalFilename,
    mimeType,
    folder,
  );
  const signedUrl = await generateSignedUrl(uploadResult.storagePath);

  return {
    ...uploadResult,
    signedUrl,
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Get bucket info for health checks
 */
async function checkBucketAccess() {
  try {
    const bucket = getBucket();
    const [exists] = await bucket.exists();
    return { accessible: exists, bucket: bucketName };
  } catch (error) {
    return { accessible: false, bucket: bucketName, error: error.message };
  }
}

module.exports = {
  uploadFile,
  generateSignedUrl,
  uploadFileWithSignedUrl,
  checkBucketAccess,
  bucketName,
};
