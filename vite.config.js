import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// iter126: inject `<link rel="modulepreload">` for the data chunk emitted by
// the dynamic `import("./data.js")` introduced in iter125. Without this, the
// browser only learns about the data chunk after parsing+executing the main
// JS, costing ~50–100ms on the critical path. With it, both chunks download
// in parallel from the initial HTML response.
function preloadDataChunk() {
  return {
    name: 'preload-data-chunk',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html; // dev / SSR — bundle only exists at build
        const dataFile = Object.entries(ctx.bundle).find(([, chunk]) =>
          chunk.type === 'chunk' && chunk.facadeModuleId?.endsWith('/data.js')
        )?.[0];
        if (!dataFile) return html;
        const tag = `<link rel="modulepreload" crossorigin href="/${dataFile}">`;
        return html.replace('</head>', `    ${tag}\n  </head>`);
      },
    },
  };
}

// iter129: emit sitemap.xml at build time so <lastmod> always reflects the
// build date (was hardcoded `2026-04-25`, going stale every iter). Also drops
// the 5 fragment URLs (#prompts, #combos, …) — Google treats them as the
// same canonical URL as `/`, so they were SEO noise. Single canonical entry
// is the correct shape for a SPA.
export function buildSitemapXml(today = new Date().toISOString().slice(0, 10)) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ai-agent-hub.net/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}

function generateSitemap() {
  return {
    name: 'generate-sitemap',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemapXml() });
    },
  };
}

export default defineConfig({
  plugins: [react(), preloadDataChunk(), generateSitemap()],
  build: {
    // iter125 split the catalog Z blob into a separate `data-*.js` chunk via
    // dynamic import — main chunk dropped from 977KB to 380KB raw (-61%).
    // iter126 added a modulepreload hint so both chunks fetch in parallel.
    // (Tested terser w/ passes:2 — yielded +460 B gzip and 18× slower build,
    // because Z is already deflate+base64 and React fits esbuild minify well.)
    chunkSizeWarningLimit: 2000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      // Ratchet thresholds for actively-tested modules. Keeps iter62 +
      // iter97/98 coverage work from regressing. App.jsx is intentionally
      // covered by e2e (jsdom can't run DecompressionStream).
      thresholds: {
        'src/utils/**': { lines: 100, statements: 100, functions: 100 },
        'src/hooks/**': { lines: 100, statements: 100, functions: 100 },
      },
    },
  },
})
