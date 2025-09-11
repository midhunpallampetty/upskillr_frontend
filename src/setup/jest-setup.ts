// jest-setup.ts
globalThis.import = { meta: { env: process.env } };  // Map to process.env for compatibility

// Add TextEncoder and TextDecoder polyfill
import { TextEncoder, TextDecoder } from 'util';

declare global {
  var TextEncoder: typeof TextEncoder;
  var TextDecoder: typeof TextDecoder;
}

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
