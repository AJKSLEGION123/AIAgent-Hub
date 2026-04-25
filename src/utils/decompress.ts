/* ═══════════════════════════════════════════════
   Z-blob decompression utility.
   Extracted from App.jsx in iter121.

   The catalog's Z constant is a base64-encoded deflate-compressed
   JSON blob containing all prompts/combos/configs/etc. Decoding:
     1. base64 → Uint8Array
     2. DecompressionStream("deflate") via Web Streams
     3. TextDecoder → JSON.parse

   Uses the platform-native DecompressionStream API. Reports
   progress via the callback (0..1) so callers can show a loader.

   Note: iter19 deleted an OLDER `decompress.ts` that was an unused
   chunked-decompress helper. This is a different function — the
   one App.jsx actually calls.
   ═══════════════════════════════════════════════ */

export type ProgressFn = (pct: number) => void;

/**
 * Decompress base64-encoded deflate Z blob → parsed JSON.
 * @param b - base64 string of the deflate-compressed JSON
 * @param onProgress - optional callback receiving 0..1 progress updates
 * @returns parsed catalog object
 * @throws when DecompressionStream is unavailable (very old browsers)
 */
export async function decompress(b: string, onProgress?: ProgressFn): Promise<unknown> {
  if (typeof DecompressionStream === "undefined") {
    throw new Error("Browser too old: DecompressionStream not supported. Use Chrome 80+, Firefox 113+, Safari 16.4+.");
  }
  const r = Uint8Array.from(atob(b), c => c.charCodeAt(0));
  const totalBytes = r.length;
  if (onProgress) onProgress(0.1);

  const s = new DecompressionStream("deflate");
  const w = s.writable.getWriter();
  w.write(r); w.close();
  if (onProgress) onProgress(0.3);

  const rd = s.readable.getReader();
  const ch: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await rd.read();
    if (done) break;
    ch.push(value);
    received += value.length;
    if (onProgress) onProgress(0.3 + 0.6 * Math.min(1, received / (totalBytes * 2.5)));
  }
  if (onProgress) onProgress(0.95);

  const t = new Uint8Array(ch.reduce((a, c) => a + c.length, 0));
  let o = 0;
  for (const c of ch) { t.set(c, o); o += c.length; }
  const result = JSON.parse(new TextDecoder().decode(t));
  if (onProgress) onProgress(1);
  return result;
}
