# Base64 Encoding/Decoding Module

A TypeScript module providing base64 encoding, decoding, and string type validation utilities for Node.js environments.

## Features

- Encode plain text strings to base64
- Decode base64 strings to plain text
- Validate base64 and plain text strings
- Detect string types automatically
- Designed for Node.js (local or remote server installations)

## Requirements

- Node.js 18+ (for running tests)
- TypeScript 5.0+

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

## Running Examples

```bash
npm run example
```

This will run a comprehensive example script demonstrating all features of the module.

## Usage

### Basic Encoding and Decoding

```typescript
import { encode, decode } from './base64.js';

const encoded = encode('Hello, World!');
// 'SGVsbG8sIFdvcmxkIQ=='

const decoded = decode('SGVsbG8sIFdvcmxkIQ==');
// 'Hello, World!'
```

### Validation

```typescript
import { isBase64, isPlainText, getStringType } from './base64.js';

isBase64('SGVsbG8sIFdvcmxkIQ==');  // true
isPlainText('Hello, World!');       // true
getStringType('Hello, World!');     // 'plain-text'
getStringType('SGVsbG8sIFdvcmxkIQ=='); // 'base64'
```

### Normalization

```typescript
import { normalizeBase64 } from './base64.js';

normalizeBase64('SGVsbG8sIFdvcmxkIQ==\n');
// 'SGVsbG8sIFdvcmxkIQ=='
```

## API Reference

### encode(text: string): string

Encodes a plain text string to base64.

**Parameters:**
- `text` - The plain text string to encode

**Returns:** Base64 encoded string

**Throws:** `TypeError` if input is not a string

### decode(base64: string): string

Decodes a base64 string to plain text.

**Parameters:**
- `base64` - The base64 encoded string to decode

**Returns:** Decoded plain text string

**Throws:** 
- `TypeError` if input is not a string
- `Error` if input is not valid base64

### isBase64(str: string): boolean

Validates if a string is valid base64 encoded.

**Parameters:**
- `str` - The string to validate

**Returns:** `true` if valid base64, `false` otherwise

### isPlainText(str: string): boolean

Validates if a string is plain text (not base64 encoded).

**Parameters:**
- `str` - The string to validate

**Returns:** `true` if plain text, `false` otherwise

### getStringType(str: string): StringType

Determines the type of a string.

**Parameters:**
- `str` - The string to analyze

**Returns:** `'plain-text'`, `'base64'`, or `'invalid'`

### normalizeBase64(base64: string): string

Normalizes a base64 string by removing whitespace and validating format.

**Parameters:**
- `base64` - The base64 string to normalize

**Returns:** Normalized base64 string

**Throws:** `Error` if input is not valid base64

## Testing

```bash
npm test
```

## Documentation

For a detailed explanation of Base64 encoding, including how it works, advantages, disadvantages, and use cases, see [BASE64_OVERVIEW.md](./BASE64_OVERVIEW.md).

## License

MIT
