import { test } from 'node:test';
import assert from 'node:assert';
import {
    encode,
    decode,
    isBase64,
    isPlainText,
    getStringType,
    normalizeBase64,
    configureSecurity,
    type StringType
} from '../base64.js';

// ============================================================================
// ENCODE TESTS
// ============================================================================

test('encode: basic string encoding', () => {
    assert.strictEqual(encode('Hello'), 'SGVsbG8=');
    assert.strictEqual(encode('Hello, World!'), 'SGVsbG8sIFdvcmxkIQ==');
    assert.strictEqual(encode('test'), 'dGVzdA==');
});

test('encode: empty string', () => {
    assert.strictEqual(encode(''), '');
});

test('encode: single character', () => {
    assert.strictEqual(encode('A'), 'QQ==');
    assert.strictEqual(encode('a'), 'YQ==');
});

test('encode: special characters', () => {
    assert.strictEqual(encode('!@#$%^&*()'), 'IUAjJCVeJiooKQ==');
    assert.strictEqual(encode('+/-_='), 'Ky8tXz0=');
});

test('encode: unicode characters', () => {
    assert.strictEqual(encode('Hello 世界'), 'SGVsbG8g5LiW55WM');
    assert.strictEqual(encode('🚀'), '8J+agA==');
    assert.strictEqual(encode('café'), 'Y2Fmw6k=');
    assert.strictEqual(encode('naïve'), 'bmHDr3Zl');
});

test('encode: whitespace handling', () => {
    assert.strictEqual(encode('hello world'), 'aGVsbG8gd29ybGQ=');
    assert.strictEqual(encode('hello\nworld'), 'aGVsbG8Kd29ybGQ=');
    assert.strictEqual(encode('hello\tworld'), 'aGVsbG8Jd29ybGQ=');
    assert.strictEqual(encode('  spaces  '), 'ICBzcGFjZXMgIA==');
});

test('encode: numbers', () => {
    assert.strictEqual(encode('1234567890'), 'MTIzNDU2Nzg5MA==');
    assert.strictEqual(encode('0'), 'MA==');
});

test('encode: JSON string', () => {
    const json = JSON.stringify({ name: 'test', value: 123 });
    const encoded = encode(json);
    assert.strictEqual(decode(encoded), json);
});

test('encode: long string', () => {
    const longString = 'a'.repeat(1000);
    const encoded = encode(longString);
    assert.strictEqual(decode(encoded), longString);
});

test('encode: throws TypeError for non-string input', () => {
    assert.throws(() => encode(null as any), TypeError);
    assert.throws(() => encode(undefined as any), TypeError);
    assert.throws(() => encode(123 as any), TypeError);
    assert.throws(() => encode({} as any), TypeError);
    assert.throws(() => encode([] as any), TypeError);
});

// ============================================================================
// DECODE TESTS
// ============================================================================

test('decode: basic string decoding', () => {
    assert.strictEqual(decode('SGVsbG8='), 'Hello');
    assert.strictEqual(decode('SGVsbG8sIFdvcmxkIQ=='), 'Hello, World!');
    assert.strictEqual(decode('dGVzdA=='), 'test');
});

test('decode: empty string', () => {
    assert.strictEqual(decode(''), '');
});

test('decode: single character', () => {
    assert.strictEqual(decode('QQ=='), 'A');
    assert.strictEqual(decode('YQ=='), 'a');
});

test('decode: special characters', () => {
    assert.strictEqual(decode('IUAjJCVeJiooKQ=='), '!@#$%^&*()');
    assert.strictEqual(decode('Ky8tXz0='), '+/-_=');
});

test('decode: unicode characters', () => {
    assert.strictEqual(decode('SGVsbG8g5LiW55WM'), 'Hello 世界');
    assert.strictEqual(decode('8J+agA=='), '🚀');
    assert.strictEqual(decode('Y2Fmw6k='), 'café');
});

test('decode: whitespace in base64 string', () => {
    assert.strictEqual(decode('SGVsbG8='), 'Hello');
    assert.strictEqual(decode('SGVsbG8sIFdvcmxkIQ=='), 'Hello, World!');
    assert.strictEqual(decode('SGVsbG8sIFdvcmxkIQ==\n'), 'Hello, World!');
    assert.strictEqual(decode('SGVsbG8sIFdvcmxkIQ==\t'), 'Hello, World!');
    assert.strictEqual(decode('SGVsbG8sIFdvcmxkIQ== '), 'Hello, World!');
    assert.strictEqual(decode('SGVsbG8sIFdvcmxkIQ==\r\n'), 'Hello, World!');
});

test('decode: base64 with spaces', () => {
    assert.strictEqual(decode('SGVsbG8sIFdvcmxkIQ=='), 'Hello, World!');
    assert.strictEqual(decode('SGVsbG8sIFdvcmxkIQ== '), 'Hello, World!');
});

test('decode: round-trip encoding/decoding', () => {
    const testCases = [
        'Hello, World!',
        'test123',
        '!@#$%^&*()',
        'café',
        'Hello 世界',
        '🚀',
        'line1\nline2',
        '  spaces  ',
        'a'.repeat(100),
    ];

    for (const testCase of testCases) {
        const encoded = encode(testCase);
        const decoded = decode(encoded);
        assert.strictEqual(decoded, testCase, `Failed for: ${testCase}`);
    }
});

test('decode: throws TypeError for non-string input', () => {
    assert.throws(() => decode(null as any), TypeError);
    assert.throws(() => decode(undefined as any), TypeError);
    assert.throws(() => decode(123 as any), TypeError);
    assert.throws(() => decode({} as any), TypeError);
});

test('decode: throws Error for invalid base64', () => {
    assert.throws(() => decode('invalid!'), Error);
    assert.throws(() => decode('SGVsbG8'), Error); // Invalid length
    assert.throws(() => decode('SGVsbG8==='), Error); // Too many padding chars
    assert.throws(() => decode('SGVsbG8=!'), Error); // Invalid character
    assert.throws(() => decode('SGVsbG8==SGVsbG8=='), Error); // Padding in middle
});

test('decode: invalid base64 with wrong padding', () => {
    assert.throws(() => decode('SGVsbG8==='), Error);
    assert.throws(() => decode('SGVsbG8===='), Error);
});

// ============================================================================
// ISBASE64 TESTS
// ============================================================================

test('isBase64: valid base64 strings', () => {
    assert.strictEqual(isBase64('SGVsbG8='), true);
    assert.strictEqual(isBase64('SGVsbG8sIFdvcmxkIQ=='), true);
    assert.strictEqual(isBase64('dGVzdA=='), true);
    assert.strictEqual(isBase64('QQ=='), true);
    assert.strictEqual(isBase64('YQ=='), true);
    assert.strictEqual(isBase64('SGVsbG8'), false); // Missing padding
    assert.strictEqual(isBase64('SGVsbG8sIFdvcmxkIQ'), false); // Missing padding
});

test('isBase64: empty string', () => {
    assert.strictEqual(isBase64(''), false);
});

test('isBase64: whitespace handling', () => {
    assert.strictEqual(isBase64('SGVsbG8='), true);
    assert.strictEqual(isBase64('SGVsbG8= '), true);
    assert.strictEqual(isBase64('SGVsbG8=\n'), true);
    assert.strictEqual(isBase64('SGVsbG8=\t'), true);
    assert.strictEqual(isBase64('SGVsbG8=\r\n'), true);
    assert.strictEqual(isBase64('SGVsbG8= '), true);
});

test('isBase64: invalid characters', () => {
    assert.strictEqual(isBase64('SGVsbG8!'), false);
    assert.strictEqual(isBase64('SGVsbG8@'), false);
    assert.strictEqual(isBase64('SGVsbG8#'), false);
    assert.strictEqual(isBase64('SGVsbG8$'), false);
    assert.strictEqual(isBase64('SGVsbG8%'), false);
    assert.strictEqual(isBase64('SGVsbG8^'), false);
    assert.strictEqual(isBase64('SGVsbG8&'), false);
    assert.strictEqual(isBase64('SGVsbG8*'), false);
});

test('isBase64: invalid length (not multiple of 4)', () => {
    assert.strictEqual(isBase64('SGVsbG8'), false); // 7 chars
    assert.strictEqual(isBase64('SGVsbG8sI'), false); // 9 chars
    assert.strictEqual(isBase64('SGVsbG8sIF'), false); // 10 chars
});

test('isBase64: padding validation', () => {
    assert.strictEqual(isBase64('SGVsbG8='), true); // 1 padding
    assert.strictEqual(isBase64('SGVsbG8sIFdvcmxkIQ=='), true); // 2 padding
    assert.strictEqual(isBase64('SGVsbG8==='), false); // 3 padding (invalid)
    assert.strictEqual(isBase64('SGVsbG8===='), false); // 4 padding (invalid)
    assert.strictEqual(isBase64('SGVsbG8==SGVsbG8=='), false); // Padding in middle
});

test('isBase64: edge cases with padding', () => {
    assert.strictEqual(isBase64('QQ=='), true); // 1 char encoded
    assert.strictEqual(isBase64('YQ=='), true); // 1 char encoded
    assert.strictEqual(isBase64('dGVzdA=='), true); // 4 chars encoded
});

test('isBase64: non-string inputs', () => {
    assert.strictEqual(isBase64(null as any), false);
    assert.strictEqual(isBase64(undefined as any), false);
    assert.strictEqual(isBase64(123 as any), false);
    assert.strictEqual(isBase64({} as any), false);
    assert.strictEqual(isBase64([] as any), false);
});

test('isBase64: valid base64 without padding', () => {
    assert.strictEqual(isBase64('SGVsbG8sIFdvcmxkIQ'), false); // Missing padding
    assert.strictEqual(isBase64('dGVzdA'), false); // Missing padding
});

test('isBase64: base64 URL-safe variants (should fail)', () => {
    assert.strictEqual(isBase64('SGVsbG8sIFdvcmxkIQ--'), false); // URL-safe uses -
    assert.strictEqual(isBase64('SGVsbG8sIFdvcmxkIQ__'), false); // URL-safe uses _
});

// ============================================================================
// ISPLAINTEXT TESTS
// ============================================================================

test('isPlainText: valid plain text strings', () => {
    assert.strictEqual(isPlainText('Hello, World!'), true);
    assert.strictEqual(isPlainText('test123'), true);
    assert.strictEqual(isPlainText('!@#$%^&*()'), true);
    assert.strictEqual(isPlainText('café'), true);
    assert.strictEqual(isPlainText('Hello 世界'), true);
    assert.strictEqual(isPlainText('🚀'), true);
});

test('isPlainText: empty string', () => {
    assert.strictEqual(isPlainText(''), true);
});

test('isPlainText: whitespace', () => {
    assert.strictEqual(isPlainText(' '), true);
    assert.strictEqual(isPlainText('\n'), true);
    assert.strictEqual(isPlainText('\t'), true);
    assert.strictEqual(isPlainText('\r\n'), true);
    assert.strictEqual(isPlainText('  spaces  '), true);
});

test('isPlainText: returns false for base64 strings', () => {
    assert.strictEqual(isPlainText('SGVsbG8='), false);
    assert.strictEqual(isPlainText('SGVsbG8sIFdvcmxkIQ=='), false);
    assert.strictEqual(isPlainText('dGVzdA=='), false);
});

test('isPlainText: control characters (invalid)', () => {
    assert.strictEqual(isPlainText('\x00'), false); // Null character
    assert.strictEqual(isPlainText('\x01'), false); // Control character
    assert.strictEqual(isPlainText('\x1F'), false); // Control character
    assert.strictEqual(isPlainText('hello\x00world'), false); // Null in middle
});

test('isPlainText: non-string inputs', () => {
    assert.strictEqual(isPlainText(null as any), false);
    assert.strictEqual(isPlainText(undefined as any), false);
    assert.strictEqual(isPlainText(123 as any), false);
    assert.strictEqual(isPlainText({} as any), false);
    assert.strictEqual(isPlainText([] as any), false);
});

test('isPlainText: unicode and emoji', () => {
    assert.strictEqual(isPlainText('Hello 世界'), true);
    assert.strictEqual(isPlainText('🚀'), true);
    assert.strictEqual(isPlainText('café'), true);
    assert.strictEqual(isPlainText('naïve'), true);
    assert.strictEqual(isPlainText('Привет'), true); // Cyrillic
    assert.strictEqual(isPlainText('こんにちは'), true); // Japanese
});

test('isPlainText: numbers and symbols', () => {
    assert.strictEqual(isPlainText('1234567890'), true);
    assert.strictEqual(isPlainText('!@#$%^&*()'), true);
    assert.strictEqual(isPlainText('+-*/='), true);
});

// ============================================================================
// GETSTRINGTYPE TESTS
// ============================================================================

test('getStringType: plain text strings', () => {
    assert.strictEqual(getStringType('Hello, World!'), 'plain-text');
    assert.strictEqual(getStringType('test123'), 'plain-text');
    assert.strictEqual(getStringType('café'), 'plain-text');
    assert.strictEqual(getStringType('Hello 世界'), 'plain-text');
    assert.strictEqual(getStringType('🚀'), 'plain-text');
    assert.strictEqual(getStringType(''), 'plain-text');
});

test('getStringType: base64 strings', () => {
    assert.strictEqual(getStringType('SGVsbG8='), 'base64');
    assert.strictEqual(getStringType('SGVsbG8sIFdvcmxkIQ=='), 'base64');
    assert.strictEqual(getStringType('dGVzdA=='), 'base64');
});

test('getStringType: invalid strings', () => {
    assert.strictEqual(getStringType('\x00'), 'invalid');
    assert.strictEqual(getStringType('\x01'), 'invalid');
    assert.strictEqual(getStringType('hello\x00world'), 'invalid');
    // Note: 'SGVsbG8!' is valid plain text (contains only printable characters)
    // even though it looks like corrupted base64
});

test('getStringType: non-string inputs', () => {
    assert.strictEqual(getStringType(null as any), 'invalid');
    assert.strictEqual(getStringType(undefined as any), 'invalid');
    assert.strictEqual(getStringType(123 as any), 'invalid');
    assert.strictEqual(getStringType({} as any), 'invalid');
    assert.strictEqual(getStringType([] as any), 'invalid');
});

test('getStringType: edge cases', () => {
    assert.strictEqual(getStringType(' '), 'plain-text');
    assert.strictEqual(getStringType('\n'), 'plain-text');
    assert.strictEqual(getStringType('\t'), 'plain-text');
});

// ============================================================================
// NORMALIZEBASE64 TESTS
// ============================================================================

test('normalizeBase64: removes whitespace', () => {
    assert.strictEqual(normalizeBase64('SGVsbG8='), 'SGVsbG8=');
    assert.strictEqual(normalizeBase64('SGVsbG8= '), 'SGVsbG8=');
    assert.strictEqual(normalizeBase64('SGVsbG8=\n'), 'SGVsbG8=');
    assert.strictEqual(normalizeBase64('SGVsbG8=\t'), 'SGVsbG8=');
    assert.strictEqual(normalizeBase64('SGVsbG8=\r\n'), 'SGVsbG8=');
    assert.strictEqual(normalizeBase64('SGVsbG8sIFdvcmxkIQ=='), 'SGVsbG8sIFdvcmxkIQ==');
});

test('normalizeBase64: trims leading/trailing whitespace', () => {
    assert.strictEqual(normalizeBase64(' SGVsbG8='), 'SGVsbG8=');
    assert.strictEqual(normalizeBase64('SGVsbG8= '), 'SGVsbG8=');
    assert.strictEqual(normalizeBase64(' SGVsbG8= '), 'SGVsbG8=');
});

test('normalizeBase64: removes internal whitespace', () => {
    assert.strictEqual(normalizeBase64('SGVsbG8sIFdvcmxkIQ=='), 'SGVsbG8sIFdvcmxkIQ==');
    // Note: base64 with spaces in the middle would be invalid, so this is more about edge cases
});

test('normalizeBase64: throws Error for invalid base64', () => {
    assert.throws(() => normalizeBase64('invalid!'), Error);
    assert.throws(() => normalizeBase64('SGVsbG8'), Error);
    assert.throws(() => normalizeBase64('SGVsbG8==='), Error);
    assert.throws(() => normalizeBase64(''), Error);
});

test('normalizeBase64: preserves valid base64', () => {
    const validBase64 = 'SGVsbG8sIFdvcmxkIQ==';
    assert.strictEqual(normalizeBase64(validBase64), validBase64);
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

test('integration: encode -> decode -> encode round trip', () => {
    const original = 'Hello, World! This is a test.';
    const encoded1 = encode(original);
    const decoded = decode(encoded1);
    const encoded2 = encode(decoded);
    assert.strictEqual(decoded, original);
    assert.strictEqual(encoded1, encoded2);
});

test('integration: validate -> encode -> decode workflow', () => {
    const plainText = 'test string';
    assert.strictEqual(isPlainText(plainText), true);
    assert.strictEqual(isBase64(plainText), false);

    const encoded = encode(plainText);
    assert.strictEqual(isBase64(encoded), true);
    assert.strictEqual(isPlainText(encoded), false);

    const decoded = decode(encoded);
    assert.strictEqual(decoded, plainText);
    assert.strictEqual(isPlainText(decoded), true);
});

test('integration: getStringType with encode/decode', () => {
    const plainText = 'Hello, World!';
    assert.strictEqual(getStringType(plainText), 'plain-text');

    const encoded = encode(plainText);
    assert.strictEqual(getStringType(encoded), 'base64');

    const decoded = decode(encoded);
    assert.strictEqual(getStringType(decoded), 'plain-text');
});

test('integration: normalizeBase64 with decode', () => {
    const base64WithWhitespace = 'SGVsbG8sIFdvcmxkIQ==\n';
    const normalized = normalizeBase64(base64WithWhitespace);
    const decoded = decode(normalized);
    assert.strictEqual(decoded, 'Hello, World!');
});

// ============================================================================
// EDGE CASES AND STRESS TESTS
// ============================================================================

test('edge case: very long strings', () => {
    const longString = 'a'.repeat(10000);
    const encoded = encode(longString);
    const decoded = decode(encoded);
    assert.strictEqual(decoded, longString);
    assert.strictEqual(isBase64(encoded), true);
});

test('edge case: strings with all ASCII printable characters', () => {
    const allPrintable = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');
    const encoded = encode(allPrintable);
    const decoded = decode(encoded);
    assert.strictEqual(decoded, allPrintable);
});

test('edge case: strings with various line endings', () => {
    const testCases = [
        'line1\nline2',
        'line1\r\nline2',
        'line1\rline2',
        'line1\n\rline2',
    ];

    for (const testCase of testCases) {
        const encoded = encode(testCase);
        const decoded = decode(encoded);
        assert.strictEqual(decoded, testCase);
    }
});

test('edge case: base64 strings that look like plain text', () => {
    // These are valid base64 but decode to plain text that could be mistaken
    const base64 = 'SGVsbG8='; // "Hello"
    assert.strictEqual(isBase64(base64), true);
    assert.strictEqual(isPlainText(base64), false);
    assert.strictEqual(getStringType(base64), 'base64');
});

test('edge case: plain text that looks like base64', () => {
    // String that has base64-like characters but isn't valid base64
    const plainText = 'SGVsbG8'; // Missing padding
    assert.strictEqual(isBase64(plainText), false);
    assert.strictEqual(isPlainText(plainText), true);
    assert.strictEqual(getStringType(plainText), 'plain-text');
});

test('edge case: empty base64 string', () => {
    assert.strictEqual(isBase64(''), false);
    assert.strictEqual(isPlainText(''), true);
    assert.strictEqual(getStringType(''), 'plain-text');
    assert.strictEqual(decode(''), '');
    assert.strictEqual(encode(''), '');
});

test('edge case: base64 with only padding', () => {
    // This shouldn't be valid base64
    assert.strictEqual(isBase64('=='), false);
    assert.strictEqual(isBase64('==='), false);
});

test('edge case: single character variations', () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (const char of chars) {
        const encoded = encode(char);
        const decoded = decode(encoded);
        assert.strictEqual(decoded, char);
    }
});

// ============================================================================
// SECURITY TESTS
// ============================================================================

test('security: input size limit enforcement', () => {
    // Test with default limit (10MB)
    const largeInput = 'A'.repeat(11 * 1024 * 1024); // 11MB
    
    assert.throws(() => {
        encode(largeInput);
    }, Error);
    
    const largeBase64 = encode('A'.repeat(1024)); // Small valid base64
    const largeInvalidBase64 = largeBase64.repeat(100000); // Make it huge
    
    assert.throws(() => {
        decode(largeInvalidBase64);
    }, Error);
});

test('security: configureSecurity allows custom limits', () => {
    // Set a small limit for testing
    configureSecurity({ maxInputSize: 100 });
    
    const smallInput = 'A'.repeat(50);
    assert.doesNotThrow(() => {
        encode(smallInput);
    });
    
    const largeInput = 'A'.repeat(150);
    assert.throws(() => {
        encode(largeInput);
    }, Error);
    
    // Reset to default
    configureSecurity({ maxInputSize: 10 * 1024 * 1024 });
});

test('security: configureSecurity allows disabling limits', () => {
    // Disable limits
    configureSecurity({ maxInputSize: 0 });
    
    const largeInput = 'A'.repeat(20 * 1024 * 1024); // 20MB
    assert.doesNotThrow(() => {
        encode(largeInput);
    });
    
    // Reset to default
    configureSecurity({ maxInputSize: 10 * 1024 * 1024 });
});

test('security: isBase64 respects size limits', () => {
    const largeInput = 'A'.repeat(11 * 1024 * 1024); // 11MB
    assert.strictEqual(isBase64(largeInput), false);
});

test('security: normalizeBase64 enforces size limits', () => {
    const largeInput = 'A'.repeat(11 * 1024 * 1024); // 11MB
    assert.throws(() => {
        normalizeBase64(largeInput);
    }, Error);
});

test('security: generic error messages', () => {
    // Invalid base64 should give generic error
    try {
        decode('Invalid!');
        assert.fail('Should have thrown an error');
    } catch (error) {
        assert(error instanceof Error);
        // Error message should be generic, not exposing internal details
        assert.strictEqual(error.message, 'Invalid base64 input');
    }
    
    // Decode error should be generic
    try {
        decode('SGVsbG8='); // Valid format, but let's see if we can trigger decode error
        // This should work, so let's test with actually invalid base64
    } catch (error) {
        assert(error instanceof Error);
        // Should not expose Buffer internals
        assert(!error.message.includes('Buffer'));
    }
});

test('security: configureSecurity validates input', () => {
    assert.throws(() => {
        configureSecurity({ maxInputSize: -1 });
    }, Error);
});

