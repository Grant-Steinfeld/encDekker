/**
 * Example usage of the base64 encoding/decoding module
 * 
 * This script demonstrates all features of the module including:
 * - Encoding and decoding
 * - Validation functions
 * - Type detection
 * - Normalization
 */

import {
  encode,
  decode,
  isBase64,
  isPlainText,
  getStringType,
  normalizeBase64,
  type StringType
} from './base64.js';

console.log('=== Base64 Encoding/Decoding Examples ===\n');

// ============================================================================
// Basic Encoding and Decoding
// ============================================================================

console.log('1. Basic Encoding and Decoding');
console.log('--------------------------------');

const plainText = 'Hello, World!';
const encoded = encode(plainText);
console.log(`Original:  "${plainText}"`);
console.log(`Encoded:   "${encoded}"`);
console.log(`Decoded:   "${decode(encoded)}"`);
console.log();

// ============================================================================
// Encoding Different Types of Content
// ============================================================================

console.log('2. Encoding Different Content Types');
console.log('------------------------------------');

const examples = [
  'Simple text',
  'Text with numbers: 12345',
  'Special characters: !@#$%^&*()',
  'Unicode: café',
  'Emoji: 🚀',
  'Multiline:\nLine 1\nLine 2',
  'JSON: ' + JSON.stringify({ name: 'test', value: 42 })
];

examples.forEach((text, index) => {
  const enc = encode(text);
  const dec = decode(enc);
  console.log(`Example ${index + 1}:`);
  console.log(`  Original: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
  console.log(`  Encoded:  ${enc}`);
  console.log(`  Verified: ${text === dec ? '✓ Match' : '✗ Mismatch'}`);
  console.log();
});

// ============================================================================
// Validation Functions
// ============================================================================

console.log('3. Validation Functions');
console.log('----------------------');

const testStrings = [
  'SGVsbG8sIFdvcmxkIQ==',  // Valid base64
  'Hello, World!',          // Plain text
  'SGVsbG8!',               // Invalid base64 (has invalid char)
  'SGVsbG8',                // Invalid base64 (wrong length)
  'SGVsbG8sIFdvcmxkIQ==\n', // Base64 with whitespace
  '',                       // Empty string
  'café',                   // Unicode plain text
];

testStrings.forEach((str, index) => {
  console.log(`Test ${index + 1}: "${str.substring(0, 30)}${str.length > 30 ? '...' : ''}"`);
  console.log(`  isBase64():    ${isBase64(str)}`);
  console.log(`  isPlainText(): ${isPlainText(str)}`);
  console.log();
});

// ============================================================================
// Type Detection
// ============================================================================

console.log('4. String Type Detection');
console.log('------------------------');

const typeExamples = [
  'Hello, World!',
  'SGVsbG8sIFdvcmxkIQ==',
  '\x00\x01\x02',
  'SGVsbG8!',
  '  ',
  'café',
];

typeExamples.forEach((str) => {
  const type: StringType = getStringType(str);
  const display = str.length > 20 ? str.substring(0, 20) + '...' : str;
  console.log(`"${display}" -> ${type}`);
});
console.log();

// ============================================================================
// Normalization
// ============================================================================

console.log('5. Base64 Normalization');
console.log('-------------------------');

const base64WithWhitespace = [
  'SGVsbG8sIFdvcmxkIQ==\n',
  'SGVsbG8sIFdvcmxkIQ== ',
  'SGVsbG8sIFdvcmxkIQ==\t',
  ' SGVsbG8sIFdvcmxkIQ== ',
];

base64WithWhitespace.forEach((str, index) => {
  try {
    const normalized = normalizeBase64(str);
    const decoded = decode(normalized);
    console.log(`Example ${index + 1}:`);
    console.log(`  Original:   "${str}"`);
    console.log(`  Normalized: "${normalized}"`);
    console.log(`  Decoded:    "${decoded}"`);
    console.log();
  } catch (error) {
    console.log(`Example ${index + 1}: Error - ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.log();
  }
});

// ============================================================================
// Round-Trip Verification
// ============================================================================

console.log('6. Round-Trip Verification');
console.log('--------------------------');

const roundTripTests = [
  'Simple text',
  'Text with "quotes" and \'apostrophes\'',
  'Numbers: 0123456789',
  'Symbols: !@#$%^&*()_+-=[]{}|;:,.<>?',
  'Unicode: Hello 世界',
  'Emoji: 🚀🎉✨',
  'Mixed: Hello123!@#世界🚀',
];

let allPassed = true;
roundTripTests.forEach((original) => {
  const encoded = encode(original);
  const decoded = decode(encoded);
  const passed = original === decoded;
  if (!passed) {
    allPassed = false;
  }
  const status = passed ? '✓' : '✗';
  console.log(`${status} "${original.substring(0, 40)}${original.length > 40 ? '...' : ''}"`);
});

console.log(`\nAll round-trip tests: ${allPassed ? 'PASSED' : 'FAILED'}`);
console.log();

// ============================================================================
// Error Handling Examples
// ============================================================================

console.log('7. Error Handling');
console.log('-----------------');

// Invalid base64 decoding
try {
  decode('Invalid!');
  console.log('✗ Should have thrown an error');
} catch (error) {
  console.log(`✓ Caught expected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

// Invalid type for encode
try {
  encode(null as any);
  console.log('✗ Should have thrown an error');
} catch (error) {
  console.log(`✓ Caught expected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

// Invalid base64 normalization
try {
  normalizeBase64('Invalid!');
  console.log('✗ Should have thrown an error');
} catch (error) {
  console.log(`✓ Caught expected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

console.log('\n=== Examples Complete ===');

