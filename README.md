# Base64 Encoding/Decoding Module

A TypeScript module for base64 encoding, decoding, and string type validation.

## Features

- **Encode**: Convert plain text strings to base64
- **Decode**: Convert base64 strings back to plain text
- **Validate**: Check if a string is base64 encoded, plain text, or invalid
- **Type Detection**: Automatically determine the type of a string

## Installation

```bash
npm install
npm run build
```

## Usage

```typescript
import { encode, decode, isBase64, isPlainText, getStringType } from './base64';

// Encode a string to base64
const encoded = encode('Hello, World!');
console.log(encoded); // "SGVsbG8sIFdvcmxkIQ=="

// Decode base64 back to plain text
const decoded = decode('SGVsbG8sIFdvcmxkIQ==');
console.log(decoded); // "Hello, World!"

// Check if a string is base64 encoded
console.log(isBase64('SGVsbG8sIFdvcmxkIQ==')); // true
console.log(isBase64('Hello, World!')); // false

// Check if a string is plain text
console.log(isPlainText('Hello, World!')); // true
console.log(isPlainText('SGVsbG8sIFdvcmxkIQ==')); // false

// Get the type of a string
console.log(getStringType('Hello, World!')); // "plain-text"
console.log(getStringType('SGVsbG8sIFdvcmxkIQ==')); // "base64"
console.log(getStringType('\x00\x01\x02')); // "invalid"
```

## API

### `encode(text: string): string`
Encodes a plain text string to base64.

### `decode(base64: string): string`
Decodes a base64 string to plain text. Throws an error if the input is not valid base64.

### `isBase64(str: string): boolean`
Returns `true` if the string is valid base64 encoded, `false` otherwise.

### `isPlainText(str: string): boolean`
Returns `true` if the string appears to be plain text (not base64), `false` otherwise.

### `getStringType(str: string): StringType`
Returns the type of the string: `'plain-text'`, `'base64'`, or `'invalid'`.

### `normalizeBase64(base64: string): string`
Normalizes a base64 string by removing whitespace and validating the format. Throws an error if invalid.

## License

MIT

