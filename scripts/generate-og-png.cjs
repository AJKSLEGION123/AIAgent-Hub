// One-shot: render public/og-image.svg → public/og-image.png at 1200×630.
// SVG og:image is rejected by Twitter/X and unreliable on LinkedIn — PNG is universal.
const fs = require('fs');
const path = require('path');

(async () => {
  const { chromium } = require('playwright');
  const svgPath = path.resolve('public/og-image.svg');
  const pngPath = path.resolve('public/og-image.png');
  const svg = fs.readFileSync(svgPath, 'utf8');

  // Wrap SVG in a fixed-viewport HTML page so the screenshot is exactly 1200×630.
  // Load Google Fonts the SVG references (Fraunces, Instrument Serif, JetBrains Mono)
  // so the rasterized PNG actually uses them instead of the Times/Georgia fallback.
  const html = `<!doctype html><html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;500&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@500;700&display=swap"><style>html,body{margin:0;padding:0;background:#0a0806}svg{display:block}</style></head><body>${svg}</body></html>`;

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.screenshot({ path: pngPath, type: 'png', fullPage: false, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await browser.close();

  const size = fs.statSync(pngPath).size;
  console.log(`✓ og-image.png written: ${size} bytes (${(size / 1024).toFixed(0)} KB)`);
})();
