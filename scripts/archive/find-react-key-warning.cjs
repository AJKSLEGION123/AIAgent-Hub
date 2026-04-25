// Hunt missing-key warnings: monkey-patch console.error in the page BEFORE
// React loads, capture stack traces from the patched call site so we can
// see the actual user component (not the Vite client wrapper).
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // Inject patch BEFORE any document scripts run
  await page.addInitScript(() => {
    const orig = console.error;
    console.error = (...args) => {
      const msg = args[0];
      if (typeof msg === 'string' && msg.includes('key')) {
        const e = new Error('captured');
        // Send back to Node via console.log so we get the stack
        orig.call(console, '[CAPTURED-KEY-WARNING]', msg, ...args.slice(1));
        orig.call(console, '[STACK]', e.stack);
      } else {
        orig.apply(console, args);
      }
    };
  });

  const captured = [];
  page.on('console', msg => {
    const t = msg.text();
    if (t.includes('[CAPTURED-KEY-WARNING]') || t.includes('[STACK]')) captured.push(t);
  });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await browser.close();

  console.log('===CAPTURES===');
  captured.forEach(c => console.log(c));
  console.log('---done---');
})();
