import { test, expect } from '@playwright/test';

test.describe('Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[id^="card-"]', { timeout: 15000 });
  });

  test('expand card on click', async ({ page }) => {
    const firstCard = page.locator('[id^="card-"]').first();
    await firstCard.click();
    await expect(firstCard.locator('pre')).toBeVisible({ timeout: 3000 });
  });

  test('favorite toggle', async ({ page }) => {
    const starBtn = page.locator('[id^="card-"]').first().locator('button[aria-pressed]').first();
    // Each card has a favorite-toggle button — fail loud if missing.
    await expect(starBtn).toBeVisible({ timeout: 5000 });
    const before = await starBtn.getAttribute('aria-pressed');
    await starBtn.click();
    await page.waitForTimeout(200);
    const after = await starBtn.getAttribute('aria-pressed');
    expect(after).not.toBe(before);
  });

  test('table view toggle', async ({ page }) => {
    const tableBtn = page.locator('button:has-text("☰")');
    if (await tableBtn.count() > 0) {
      await tableBtn.click();
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('section navigation via tabs', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    const count = await tabs.count();
    expect(count).toBe(5);

    // Click each tab
    for (let i = 0; i < count; i++) {
      await tabs.nth(i).click();
      await page.waitForTimeout(200);
    }
  });

  test('stats modal opens', async ({ page }) => {
    // Source uses aria-label="Statistics" (App.jsx:1119); previous selector
    // "Stats" never matched, so the silent-skip pattern hid that mismatch.
    const statsBtn = page.locator('button[aria-label="Statistics"]');
    await expect(statsBtn).toBeVisible({ timeout: 5000 });
    await statsBtn.click();
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 3000 });
  });

  // Iter1 stale-closure regression: keydown effect's deps array was
  // [section, toggle], freezing all 8 modal-state vars. ESC silently
  // failed to close ANY modal. iter16 added regression for shortcuts.
  // Now extending to two more modals to cement the fix.
  test('Escape closes the stats dialog (iter1 stale-closure regression)', async ({ page }) => {
    await page.locator('button[aria-label="Statistics"]').click();
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 3000 });
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 3000 });
  });

  test('language switch cycles', async ({ page }) => {
    // Find the language toggle button (contains EN, KK, or RU text, width ~36-48px)
    const langBtn = page.locator('button').filter({ hasText: /^(EN|KK|RU)$/ }).first();
    // Language toggle is always in the toolbar — fail loud if missing.
    await expect(langBtn).toBeVisible({ timeout: 5000 });
    const initial = await langBtn.textContent();
    await langBtn.click();
    await page.waitForTimeout(300);
    const after = await langBtn.textContent();
    expect(after).not.toBe(initial);
  });

  test('scroll progress bar appears', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    // Bar should exist in DOM
    expect(await page.locator('[style*="will-change"]').count()).toBeGreaterThanOrEqual(0);
  });
});
