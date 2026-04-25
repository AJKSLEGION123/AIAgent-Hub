// One-shot: render public/favicon.svg → public/icon-192.png + icon-512.png
// for proper PWA home-screen installs. SVG-only icons rasterize poorly for
// Android launcher / iOS Add-to-Home-Screen — every modern PWA checklist
// (Lighthouse, PWA Builder) requires explicit 192 and 512 PNGs.
const fs = require('fs');
const path = require('path');

(async () => {
  const { chromium } = require('playwright');
  const svg = fs.readFileSync(path.resolve('public/favicon.svg'), 'utf8');

  const sizes = [192, 512];
  const browser = await chromium.launch();

  for (const size of sizes) {
    const html = `<!doctype html><html><head><style>html,body{margin:0;padding:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style></head><body>${svg}</body></html>`;
    const ctx = await browser.newContext({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    const out = path.resolve(`public/icon-${size}.png`);
    await page.screenshot({ path: out, type: 'png', omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
    const bytes = fs.statSync(out).size;
    console.log(`✓ icon-${size}.png written: ${bytes} bytes (${(bytes / 1024).toFixed(0)} KB)`);
    await ctx.close();
  }
  await browser.close();
})();
