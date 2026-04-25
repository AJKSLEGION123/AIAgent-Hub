import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
import { decompress } from '../utils/decompress.ts';

// Generate the test fixture at runtime via Node's zlib so the test is
// self-validating and doesn't depend on a precomputed string that could
// drift away from the implementation contract.
const require = createRequire(import.meta.url);
const zlib = require('node:zlib');
const HELLO_WORLD_B64 = zlib
  .deflateSync(JSON.stringify({ hello: 'world' }))
  .toString('base64');

describe('decompress()', () => {
  it('decodes a valid base64 deflate blob to its original JSON', async () => {
    const result = await decompress(HELLO_WORLD_B64);
    expect(result).toEqual({ hello: 'world' });
  });

  it('reports progress 0..1 via callback', async () => {
    const progressCalls = [];
    await decompress(HELLO_WORLD_B64, (p) => progressCalls.push(p));
    expect(progressCalls.length).toBeGreaterThan(0);
    expect(progressCalls[0]).toBeGreaterThanOrEqual(0);
    expect(progressCalls[progressCalls.length - 1]).toBe(1);
  });

  it('progress is monotonically non-decreasing', async () => {
    const progressCalls = [];
    await decompress(HELLO_WORLD_B64, (p) => progressCalls.push(p));
    for (let i = 1; i < progressCalls.length; i++) {
      expect(progressCalls[i]).toBeGreaterThanOrEqual(progressCalls[i - 1]);
    }
  });

  it('works without onProgress callback', async () => {
    const result = await decompress(HELLO_WORLD_B64);
    expect(result).toEqual({ hello: 'world' });
  });

  it('throws when DecompressionStream is unavailable', async () => {
    const orig = globalThis.DecompressionStream;
    // @ts-expect-error stubbing for fallback-path coverage
    globalThis.DecompressionStream = undefined;
    try {
      await expect(decompress(HELLO_WORLD_B64)).rejects.toThrow(/Browser too old/);
    } finally {
      globalThis.DecompressionStream = orig;
    }
  });

  it('throws on invalid base64 (atob throws)', async () => {
    await expect(decompress('not-valid-base64-!!!')).rejects.toThrow();
  });
});
