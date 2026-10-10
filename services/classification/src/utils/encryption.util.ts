/**
 * Encryption Utility - Classification Service
 * AES-256-GCM decryption for document content.
 *
 * Encrypted format: [IV (12 bytes)][AuthTag (16 bytes)][Encrypted Data]
 *
 * Environment Variables:
 * - ENCRYPTION_KEY: 32-byte hex string (64 characters)
 */
import crypto from 'crypto';
import { logger } from './logger.util';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

/**
 * Get the encryption key from environment.
 * @returns 32-byte key as Buffer
 */
function getEncryptionKey(): Buffer {
    const keyHex = process.env.ENCRYPTION_KEY;
    if (!keyHex) {
        throw new Error('ENCRYPTION_KEY environment variable is not set. Cannot decrypt files.');
    }
    if (keyHex.length !== 64) {
        throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes).');
    }
    return Buffer.from(keyHex, 'hex');
}

/**
 * Decrypts a buffer that was encrypted with AES-256-GCM.
 * Supports legacy (unencrypted) files by returning the original buffer on failure.
 * @param buffer - The encrypted buffer.
 * @returns Decrypted plaintext buffer, or original buffer if decryption fails.
 */
export function decryptBuffer(buffer: Buffer): Buffer {
    // Check minimum length for encrypted format
    const minLength = IV_LENGTH + TAG_LENGTH + 1;
    if (buffer.length < minLength) {
        logger.info('[Encryption] Buffer too short for encrypted format, treating as unencrypted.');
        return buffer;
    }

    try {
        const key = getEncryptionKey();
        const iv = buffer.subarray(0, IV_LENGTH);
        const authTag = buffer.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
        const cipherText = buffer.subarray(IV_LENGTH + TAG_LENGTH);

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]);
        logger.info('[Encryption] Successfully decrypted buffer.');
        return decrypted;
    } catch (error) {
        // Decryption failed - likely an unencrypted legacy file
        logger.info('[Encryption] Decryption failed, treating as unencrypted legacy file:', error);
        return buffer;
    }
}

/**
 * Check if encryption is enabled (ENCRYPTION_KEY is set).
 * @returns boolean
 */
export function isEncryptionEnabled(): boolean {
    return !!process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length === 64;
}
