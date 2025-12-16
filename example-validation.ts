/**
 * Example: Validating String Types
 * 
 * This example demonstrates how to determine if a string is plain text or base64 encoded,
 * and shows that base64 strings are not considered plain text.
 */

import {
    encode,
    isBase64,
    isPlainText,
    getStringType,
    type StringType
} from './base64.js';

console.log('=== String Type Validation Examples ===\n');

// ============================================================================
// Example 1: Plain Text Strings
// ============================================================================

console.log('1. Plain Text Strings');
console.log('---------------------');

const plainTextExamples = [
    'Hello, World!',
    'This is plain text with spaces',
    '12345',
    'Special chars: !@#$%',
    'Unicode: café',
    'Emoji: 🚀',
    'Text with punctuation: Hello, how are you?'
];

plainTextExamples.forEach((text) => {
    const isBase64Result = isBase64(text);
    const isPlainTextResult = isPlainText(text);
    const type = getStringType(text);

    console.log(`Text: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);
    console.log(`  isBase64():    ${isBase64Result}`);
    console.log(`  isPlainText(): ${isPlainTextResult}`);
    console.log(`  getStringType(): ${type}`);
    console.log();
});

// ============================================================================
// Example 2: Base64 Encoded Strings
// ============================================================================

console.log('2. Base64 Encoded Strings');
console.log('-------------------------');

const base64Examples = [
    'SGVsbG8sIFdvcmxkIQ==',                    // "Hello, World!"
    'VGhpcyBpcyBhIHNpbXBsZSB0ZXh0IG1lc3NhZ2U=', // "This is a simple text message"
    'MTIzNDU=',                                 // "12345"
    'U3BlY2lhbCBjaGFyczogIUAjJCU=',            // "Special chars: !@#$%"
    'VW5pY29kZTogY2Fmw6k=',                    // "Unicode: café"
];

base64Examples.forEach((base64) => {
    const isBase64Result = isBase64(base64);
    const isPlainTextResult = isPlainText(base64);
    const type = getStringType(base64);

    console.log(`Base64: "${base64}"`);
    console.log(`  isBase64():    ${isBase64Result}`);
    console.log(`  isPlainText(): ${isPlainTextResult}`);
    console.log(`  getStringType(): ${type}`);
    console.log();
});

// ============================================================================
// Example 3: Demonstrating Base64 is NOT Plain Text
// ============================================================================

console.log('3. Base64 Strings are NOT Plain Text');
console.log('-------------------------------------');

const originalText = 'Hello, World!';
const encodedBase64 = encode(originalText);

console.log(`Original text: "${originalText}"`);
console.log(`Encoded base64: "${encodedBase64}"`);
console.log();

console.log('Validation Results:');
console.log(`  Original text isBase64():    ${isBase64(originalText)}`);
console.log(`  Original text isPlainText(): ${isPlainText(originalText)}`);
console.log(`  Original text type:          ${getStringType(originalText)}`);
console.log();

console.log(`  Base64 string isBase64():    ${isBase64(encodedBase64)}`);
console.log(`  Base64 string isPlainText(): ${isPlainText(encodedBase64)}`);
console.log(`  Base64 string type:         ${getStringType(encodedBase64)}`);
console.log();

console.log('✓ Key Point: Base64 encoded strings return false for isPlainText()');
console.log('  This is by design - base64 strings are encoded data, not plain text.');
console.log();

// ============================================================================
// Example 4: Round-Trip Validation
// ============================================================================

console.log('4. Round-Trip Validation');
console.log('-------------------------');

const testStrings = [
    'Simple text',
    'Text with numbers: 12345',
    'Special: !@#$%^&*()',
    'Unicode: 世界',
    'Emoji: 🎉'
];

testStrings.forEach((text) => {
    const encoded = encode(text);

    console.log(`Original: "${text}"`);
    console.log(`  Type: ${getStringType(text)}`);
    console.log(`  Encoded: "${encoded}"`);
    console.log(`  Encoded Type: ${getStringType(encoded)}`);
    console.log(`  Encoded isPlainText(): ${isPlainText(encoded)}`);
    console.log();
});

// ============================================================================
// Example 5: Edge Cases
// ============================================================================

console.log('5. Edge Cases');
console.log('-------------');

const edgeCases = [
    { name: 'Empty string', value: '' },
    { name: 'Single space', value: ' ' },
    { name: 'Only whitespace', value: '   \n\t  ' },
    { name: 'Looks like base64 but invalid', value: 'SGVsbG8!' },
    { name: 'Valid base64 with whitespace', value: 'SGVsbG8sIFdvcmxkIQ==\n' }
];

edgeCases.forEach(({ name, value }) => {
    const displayValue = value.length > 30 ? value.substring(0, 30) + '...' : value;
    console.log(`${name}: "${displayValue}"`);
    console.log(`  isBase64():    ${isBase64(value)}`);
    console.log(`  isPlainText(): ${isPlainText(value)}`);
    console.log(`  getStringType(): ${getStringType(value)}`);
    console.log();
});

console.log('=== Examples Complete ===');

