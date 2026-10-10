import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ''; // Must be 32 bytes (64 hex chars)
const IV_LENGTH = 16; // AES block size

/**
 * Decrypt text using AES-256-CBC
 * Expects format: iv:encryptedData
 */
export function decrypt(text: string): string {
    if (!text) return text;
    if (!ENCRYPTION_KEY) return text;

    // Check if text matches encrypted format (iv:data)
    if (!text.includes(':')) return text;

    const textParts = text.split(':');
    if (textParts.length !== 2) return text; // Not encrypted or invalid format

    try {
        const iv = Buffer.from(textParts.shift()!, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const key = Buffer.from(ENCRYPTION_KEY, 'hex');

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        // Failed to decrypt (wrong key, corrupted, or plain text containing a colon)
        return text;
    }
}
