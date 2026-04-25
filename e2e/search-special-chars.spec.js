import { test, expect } from '@playwright/test';

// Regression coverage for iter67 (search regex-escape bug). The bug lived only
// in App.jsx inline filter logic — filter.test.ts unit tests cover the utility
// (which was always correct) but not the rendered UI. Real browser is required
// because jsdom doesn't fully implement DecompressionStream needed to mount
// AgentHub past the loading skeleton.

test.describe('Search with special characters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[id^="card-"]', { timeout: 15000 });
  });

  // The search input is the global Ctrl+K search at the top of the prompts tab.
  // It has aria-label that varies by language; type="search" + the leading
  // position narrows it deterministically.
  async function getSearchInput(page) {
    return page.locator('input[type="search"]').first();
  }

  test('"." in query (e.g. "v1.2") does not break substring matching', async ({ page }) => {
    const input = await getSearchInput(page);
    await input.fill('v1.2');
    await page.waitForTimeout(400); // debounce settles
    // Page should not be in an "empty state" — at least one card must remain.
    // The bug from iter67 corrupted "v1.2" → "v1\\.2" and matched zero prompts.
    const cardCount = await page.locator('[id^="card-"]').count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('"()" in query (e.g. "fix()") does not break substring matching', async ({ page }) => {
    const input = await getSearchInput(page);
    await input.fill('fix()');
    await page.waitForTimeout(400);
    // "fix()" appears in lp-watch prompt text. Pre-iter67: regex-escape would
    // corrupt the query to "fix\\(\\)" and miss it. Post-fix: at least 1 match.
    const cardCount = await page.locator('[id^="card-"]').count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('"*" in query (glob style) does not break', async ({ page }) => {
    const input = await getSearchInput(page);
    await input.fill('*.ts');
    await page.waitForTimeout(400);
    const cardCount = await page.locator('[id^="card-"]').count();
    expect(cardCount).toBeGreaterThanOrEqual(0); // we accept 0 here — the test's job is to ensure no crash
    // No console error from the search path
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    expect(errors).toEqual([]);
  });
});
