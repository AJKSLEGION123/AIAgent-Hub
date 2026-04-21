import { test, expect } from '@playwright/test';

test.describe('AIAgent-Hub', () => {
  test('loads and shows title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
  });

  test('shows prompts after loading', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[id^="card-"]', { timeout: 15000 });
    const cards = await page.locator('[id^="card-"]').count();
    expect(cards).toBeGreaterThan(0);
  });

  test('search filters prompts', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[id^="card-"]', { timeout: 15000 });
    const before = await page.locator('[id^="card-"]').count();
    await page.fill('input[type="search"]', 'frontend');
    await page.waitForTimeout(300);
    const after = await page.locator('[id^="card-"]').count();
    expect(after).toBeLessThan(before);
  });

  test('theme toggle works', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-theme]', { timeout: 15000 });
    const initial = await page.getAttribute('[data-theme]', 'data-theme');
    await page.click('button[aria-label*="тема"], button[aria-label*="theme"]');
    const after = await page.getAttribute('[data-theme]', 'data-theme');
    expect(after).not.toBe(initial);
  });

  test('section tabs navigate', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[role="tab"]', { timeout: 15000 });
    await page.click('role=tab >> text=/Комбо|Combos/');
    await expect(page.locator('#panel-combos')).toBeVisible();
  });

  test('copy button works', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[id^="card-"]', { timeout: 15000 });
    const firstCard = page.locator('[id^="card-"]').first();
    const copyBtn = firstCard.locator('button:has-text("Копировать"), button:has-text("Copy")');
    if (await copyBtn.count() > 0) {
      await copyBtn.first().click();
      // Toast renders at top of viewport (.toast class), not inside the card
      await expect(page.locator('.toast')).toBeVisible({ timeout: 3000 });
    }
  });

  test('keyboard shortcut ? opens overlay', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-theme]', { timeout: 15000 });
    await page.keyboard.press('?');
    await expect(page.locator('role=dialog')).toBeVisible({ timeout: 3000 });
  });

  test('mobile viewport renders', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
  });
});
