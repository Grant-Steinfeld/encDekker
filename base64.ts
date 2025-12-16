/**
 * Base64 encoding and decoding utilities with validation
 */

export type StringType = 'plain-text' | 'base64' | 'invalid';

// Helper functions to safely access globals
function getBuffer(): any {
    return typeof globalThis !== 'undefined' && 'Buffer' in globalThis
        ? (globalThis as any).Buffer
        : undefined;
}

function getBtoa(): ((data: string) => string) | undefined {
    return typeof globalThis !== 'undefined' && 'btoa' in globalThis
        ? (globalThis as any).btoa
        : undefined;
}

function getAtob(): ((data: string) => string) | undefined {
    return typeof globalThis !== 'undefined' && 'atob' in globalThis
        ? (globalThis as any).atob
        : undefined;
}

/**
 * Encodes a string to base64
 * @param text - The plain text string to encode
 * @returns Base64 encoded string
 */
export function encode(text: string): string {
    if (typeof text !== 'string') {
        throw new TypeError('Input must be a string');
    }

    // Convert string to base64
    const Buffer = getBuffer();
    if (Buffer) {
        // Node.js environment
        return Buffer.from(text, 'utf8').toString('base64');
    } else {
        // Browser environment
        const btoaFn = getBtoa();
        if (!btoaFn) {
            throw new Error('Base64 encoding not available in this environment');
        }
        return btoaFn(unescape(encodeURIComponent(text)));
    }
}

/**
 * Decodes a base64 string to plain text
 * @param base64 - The base64 encoded string to decode
 * @returns Decoded plain text string
 * @throws Error if the input is not valid base64
 */
export function decode(base64: string): string {
    if (typeof base64 !== 'string') {
        throw new TypeError('Input must be a string');
    }

    // Remove whitespace and padding inconsistencies
    const cleaned = base64.trim().replace(/\s/g, '');

    if (!isBase64(cleaned)) {
        throw new Error('Input is not valid base64');
    }

    try {
        const Buffer = getBuffer();
        if (Buffer) {
            // Node.js environment
            return Buffer.from(cleaned, 'base64').toString('utf8');
        } else {
            // Browser environment
            const atobFn = getAtob();
            if (!atobFn) {
                throw new Error('Base64 decoding not available in this environment');
            }
            return decodeURIComponent(escape(atobFn(cleaned)));
        }
    } catch (error) {
        throw new Error(`Failed to decode base64: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Validates if a string is valid base64 encoded
 * @param str - The string to validate
 * @returns true if the string is valid base64, false otherwise
 */
export function isBase64(str: string): boolean {
    if (typeof str !== 'string' || str.length === 0) {
        return false;
    }

    // Remove whitespace for validation
    const cleaned = str.trim().replace(/\s/g, '');

    // Base64 strings should only contain: A-Z, a-z, 0-9, +, /, and = (padding)
    // Length should be a multiple of 4 (after padding)
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

    if (!base64Regex.test(cleaned)) {
        return false;
    }

    // Check length is multiple of 4 (or has proper padding)
    const length = cleaned.length;
    if (length % 4 !== 0) {
        return false;
    }

    // Check padding: if present, should be at the end and max 2 '=' characters
    const paddingIndex = cleaned.indexOf('=');
    if (paddingIndex !== -1) {
        // Padding should only be at the end
        if (paddingIndex < length - 2) {
            return false;
        }
        // Max 2 padding characters
        if (cleaned.slice(paddingIndex).length > 2) {
            return false;
        }
    }

    // Try to decode to verify it's actually valid base64
    try {
        const Buffer = getBuffer();
        if (Buffer) {
            Buffer.from(cleaned, 'base64');
        } else {
            const atobFn = getAtob();
            if (!atobFn) {
                return false;
            }
            atobFn(cleaned);
        }
        return true;
    } catch {
        return false;
    }
}

/**
 * Validates if a string is plain text (not base64 encoded)
 * @param str - The string to validate
 * @returns true if the string appears to be plain text, false otherwise
 */
export function isPlainText(str: string): boolean {
    if (typeof str !== 'string') {
        return false;
    }

    // If it's valid base64, it's not plain text
    if (isBase64(str)) {
        return false;
    }

    // Check if string contains only printable characters and common whitespace
    // This includes letters, numbers, punctuation, and common symbols
    // Exclude control characters except common whitespace (space, tab, newline, etc.)
    const plainTextRegex = /^[\x20-\x7E\r\n\t\u00A0-\uFFFF]*$/;

    return plainTextRegex.test(str);
}

/**
 * Determines the type of a string: plain text, base64 encoded, or invalid
 * @param str - The string to analyze
 * @returns The type of the string: 'plain-text', 'base64', or 'invalid'
 */
export function getStringType(str: string): StringType {
    if (typeof str !== 'string') {
        return 'invalid';
    }

    if (isBase64(str)) {
        return 'base64';
    }

    if (isPlainText(str)) {
        return 'plain-text';
    }

    return 'invalid';
}

/**
 * Validates and normalizes a base64 string (removes whitespace, validates format)
 * @param base64 - The base64 string to normalize
 * @returns Normalized base64 string
 * @throws Error if the input is not valid base64
 */
export function normalizeBase64(base64: string): string {
    if (!isBase64(base64)) {
        throw new Error('Input is not valid base64');
    }

    return base64.trim().replace(/\s/g, '');
}

