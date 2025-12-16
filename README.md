# Base64 Encoding/Decoding Module

A TypeScript module providing base64 encoding, decoding, and string type validation utilities for Node.js environments.

## Features

- Encode plain text strings to base64
- Decode base64 strings to plain text
- Validate base64 and plain text strings
- Detect string types automatically
- Designed for Node.js (local or remote server installations)
- Built-in security features: input size limits, DoS protection, generic error messages

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

## Security Configuration

The module includes security features to prevent DoS attacks and information disclosure:

```typescript
import { configureSecurity } from './base64.js';

// Set custom maximum input size (default: 10MB)
configureSecurity({ maxInputSize: 5 * 1024 * 1024 }); // 5MB

// Disable size limits (not recommended for production)
configureSecurity({ maxInputSize: 0 });
```

**Security Features:**
- Input size validation (default: 10MB maximum)
- Generic error messages to prevent information disclosure
- DoS protection via size limits
- Input validation before processing

See [SECURITY.md](./SECURITY.md) for detailed security information.

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

**Throws:** 
- `TypeError` if input is not a string
- `Error` if input exceeds maximum size limit
- `Error` if input is not valid base64

### configureSecurity(config: SecurityConfig): void

Configures security settings for the module.

**Parameters:**
- `config` - Security configuration object
  - `maxInputSize` - Maximum input size in bytes (default: 10MB, set to 0 to disable)

**Throws:** `Error` if configuration is invalid

## Testing

```bash
npm test
```

## Documentation

For a detailed explanation of Base64 encoding, including how it works, advantages, disadvantages, and use cases, see [BASE64_OVERVIEW.md](./BASE64_OVERVIEW.md).

## License

MIT
