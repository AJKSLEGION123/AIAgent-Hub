// One-shot: launch dev server via vite preview, capture React console warnings
// with full stack trace via Playwright. Used to find missing-key culprits.
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  page.on('console', msg => {
    if (msg.type() === 'warning' || msg.type() === 'error') {
      const text = msg.text();
      if (text.includes('key') || text.includes('Key')) {
        console.log('---WARNING---');
        console.log(text);
        const loc = msg.location();
        console.log('at', loc.url + ':' + loc.lineNumber + ':' + loc.columnNumber);
      }
    }
  });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  // Click through major sections to trigger more renders
  await page.click('role=tab >> text=/Комбо|Combos/').catch(() => {});
  await page.waitForTimeout(500);
  await page.click('role=tab >> text=/Шпаргалки|Cheat/').catch(() => {});
  await page.waitForTimeout(500);
  await page.click('role=tab >> text=/CLI/').catch(() => {});
  await page.waitForTimeout(500);
  await page.click('role=tab >> text=/Настройка|Setup/').catch(() => {});
  await page.waitForTimeout(500);
  await browser.close();
  console.log('---done---');
})();
