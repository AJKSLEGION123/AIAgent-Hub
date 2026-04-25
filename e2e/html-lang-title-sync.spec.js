import { test, expect } from '@playwright/test';

// Regression coverage for iter40 (html lang sync) and iter41 (document.title
// sync). Both bugs were "documentation lies" patterns: index.html hardcoded
// `<html lang="ru">` while runtime SPA toggles language at runtime — screen
// readers ended up using Russian phonetic rules on English/Kazakh content
// (a serious a11y violation). axe-core checks `html-has-lang` but doesn't
// detect that the lang value DOESN'T MATCH visible content language after a
// runtime toggle. This test exercises the actual toggle flow.

test.describe('html.lang and document.title sync with runtime language', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[id^="card-"]', { timeout: 15000 });
  });

  // Initial lang depends on navigator.language (Playwright default = en-US, so
  // App init resolves to "en"). Test asserts the cycle: click → change → click
  // → change. Don't assume initial state.

  test('toggling language updates documentElement.lang (iter40 regression)', async ({ page }) => {
    const langBtn = page.locator('button[aria-label="Switch language"]');
    await expect(langBtn).toBeVisible({ timeout: 5000 });

    const before = await page.evaluate(() => document.documentElement.lang);
    expect(['ru', 'en', 'kk']).toContain(before);

    await langBtn.click();
    await page.waitForTimeout(200);
    const after = await page.evaluate(() => document.documentElement.lang);
    expect(['ru', 'en', 'kk']).toContain(after);
    expect(after).not.toBe(before); // changed via the cycle ru→en→kk→ru
  });

  test('toggling language updates document.title (iter41 + iter75 regression)', async ({ page }) => {
    // Drive a full lang cycle (ru → en → kk → ru). Post-iter75 the title-build
    // is 3-way (ru / en / kk) so the cycle produces 3 distinct titles. Pre-iter75
    // it was binary (ru / non-ru) so Kazakh fell back to English and we'd get
    // only 2 distinct titles — this assertion guards iter75's i18n completeness.
    const langBtn = page.locator('button[aria-label="Switch language"]');
    const titles = new Set();
    titles.add(await page.title());
    for (let i = 0; i < 3; i++) {
      await langBtn.click();
      await page.waitForTimeout(200);
      titles.add(await page.title());
    }
    expect(titles.size).toBe(3); // ru, en, kk all produce distinct titles
    [...titles].forEach(t => expect(t).toMatch(/AIAgent-Hub/));
  });
});
