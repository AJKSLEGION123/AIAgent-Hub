/** Decompress base64-deflate data with progress callback */
export async function decompressData<T>(
  base64: string,
  onProgress?: (pct: number) => void
): Promise<T> {
  if (typeof DecompressionStream === "undefined") {
    throw new Error("Browser too old: DecompressionStream not supported. Use Chrome 80+, Firefox 113+, Safari 16.4+.");
  }

  const raw = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  onProgress?.(0.1);

  const stream = new DecompressionStream("deflate");
  const writer = stream.writable.getWriter();
  writer.write(raw);
  writer.close();
  onProgress?.(0.3);

  const reader = stream.readable.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress?.(0.3 + 0.6 * Math.min(1, received / (raw.length * 2.5)));
  }

  onProgress?.(0.95);
  const total = chunks.reduce((a, c) => a + c.length, 0);
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }

  const result = JSON.parse(new TextDecoder().decode(merged)) as T;
  onProgress?.(1);
  return result;
}
