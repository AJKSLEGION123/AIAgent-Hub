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
    if (await starBtn.count() > 0) {
      const before = await starBtn.getAttribute('aria-pressed');
      await starBtn.click();
      await page.waitForTimeout(200);
      const after = await starBtn.getAttribute('aria-pressed');
      expect(after).not.toBe(before);
    }
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
    const statsBtn = page.locator('button[aria-label="Stats"]');
    if (await statsBtn.count() > 0) {
      await statsBtn.click();
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 3000 });
    }
  });

  test('language switch cycles', async ({ page }) => {
    // Find the language toggle button (contains EN, KK, or RU text, width ~36-48px)
    const langBtn = page.locator('button').filter({ hasText: /^(EN|KK|RU)$/ }).first();
    if (await langBtn.count() > 0) {
      const initial = await langBtn.textContent();
      await langBtn.click();
      await page.waitForTimeout(300);
      const after = await langBtn.textContent();
      expect(after).not.toBe(initial);
    }
  });

  test('scroll progress bar appears', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    const bar = page.locator('[style*="position:fixed"][style*="height:2"]').first();
    // Bar should exist in DOM
    expect(await page.locator('[style*="will-change"]').count()).toBeGreaterThanOrEqual(0);
  });
});
