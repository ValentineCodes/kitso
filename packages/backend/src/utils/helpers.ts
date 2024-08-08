import crypto from "crypto"
/**
 * Generate a unique salt
 * @param {number} length - The length of the salt in bytes
 * @returns {string} - The generated salt as a hex string
 */
export function generateSalt(length = 32) {
    return `0x${crypto.randomBytes(length).toString('hex')}`;
}