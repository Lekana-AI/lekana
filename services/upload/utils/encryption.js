/**
 * Encryption Utility - Upload Service
 * AES-256-GCM encryption for document content.
 *
 * Encrypted format: [IV (12 bytes)][AuthTag (16 bytes)][Encrypted Data]
 *
 * Environment Variables:
 * - ENCRYPTION_KEY: 32-byte hex string (64 characters)
 */
const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

/**
 * Get the encryption key from environment.
 * @returns {Buffer} 32-byte key
 */
function getEncryptionKey() {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex) {
    throw new Error(
      "ENCRYPTION_KEY environment variable is not set. Cannot encrypt files.",
    );
  }
  if (keyHex.length !== 64) {
    throw new Error(
      "ENCRYPTION_KEY must be a 64-character hex string (32 bytes).",
    );
  }
  return Buffer.from(keyHex, "hex");
}

/**
 * Encrypts a buffer using AES-256-GCM.
 * @param {Buffer} buffer - The plaintext buffer to encrypt.
 * @returns {Buffer} Encrypted buffer: [IV][AuthTag][CipherText]
 */
function encryptBuffer(buffer) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Format: IV + AuthTag + EncryptedData
  return Buffer.concat([iv, authTag, encrypted]);
}

/**
 * Decrypts a buffer that was encrypted with encryptBuffer.
 * Supports legacy (unencrypted) files by returning the original buffer on failure.
 * @param {Buffer} buffer - The encrypted buffer.
 * @returns {Buffer} Decrypted plaintext buffer, or original buffer if decryption fails.
 */
function decryptBuffer(buffer) {
  // Check minimum length for encrypted format
  const minLength = IV_LENGTH + TAG_LENGTH + 1;
  if (buffer.length < minLength) {
    console.log(
      "[Encryption] Buffer too short for encrypted format, treating as unencrypted.",
    );
    return buffer;
  }

  try {
    const key = getEncryptionKey();
    const iv = buffer.subarray(0, IV_LENGTH);
    const authTag = buffer.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const cipherText = buffer.subarray(IV_LENGTH + TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(cipherText),
      decipher.final(),
    ]);
    console.log("[Encryption] Successfully decrypted buffer.");
    return decrypted;
  } catch (error) {
    // Decryption failed - likely an unencrypted legacy file
    console.log(
      "[Encryption] Decryption failed, treating as unencrypted legacy file:",
      error.message,
    );
    return buffer;
  }
}

/**
 * Check if encryption is enabled (ENCRYPTION_KEY is set).
 * @returns {boolean}
 */
function isEncryptionEnabled() {
  return (
    !!process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length === 64
  );
}

module.exports = {
  encryptBuffer,
  decryptBuffer,
  isEncryptionEnabled,
};
