import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Bundle embeds 10k+ prompts as compressed Z blob for offline-first PWA —
    // single-chunk delivery is the intended trade-off over code-splitting.
    chunkSizeWarningLimit: 1500,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
