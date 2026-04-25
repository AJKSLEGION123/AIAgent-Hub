// One-shot: navigate to live, capture console errors/warnings.
// Production build strips React dev warnings; only real runtime issues remain.
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const errors = [];
  const warnings = [];
  page.on('console', msg => {
    const t = msg.text();
    if (msg.type() === 'error') errors.push(t);
    else if (msg.type() === 'warning') warnings.push(t);
  });
  page.on('pageerror', e => errors.push('[pageerror] ' + e.message));

  await page.goto('https://ai-agent-hub.net/', { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(2000);

  // Click through tabs to trigger more code paths
  for (const label of [/Комбо|Combos/, /Шпаргалки|Cheat/, /CLI/, /Настройка|Setup/]) {
    try {
      await page.locator('role=tab').filter({ hasText: label }).first().click({ timeout: 3000 });
      await page.waitForTimeout(800);
    } catch {}
  }

  // Open + close modals
  try { await page.keyboard.press('?'); await page.waitForTimeout(500); await page.keyboard.press('Escape'); } catch {}

  await browser.close();

  console.log('===CONSOLE ERRORS===', errors.length);
  errors.forEach(e => console.log('  ' + e));
  console.log('===CONSOLE WARNINGS===', warnings.length);
  warnings.slice(0, 5).forEach(w => console.log('  ' + w));
})();
