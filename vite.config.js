import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Bundle embeds ~3.3k prompts as compressed Z blob for offline-first PWA —
    // single-chunk delivery is the intended trade-off over code-splitting.
    // (Tested terser w/ passes:2 — yielded +460 B gzip and 18× slower build,
    // because Z is already deflate+base64 and React fits esbuild minify well.)
    chunkSizeWarningLimit: 2000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
