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
    // Use a specific query that returns < 40 cards (default page size)
    // so we observe the filter narrowing rather than hitting the cap.
    await page.fill('input[type="search"]', 'godmode');
    await page.waitForTimeout(500);
    const matching = await page.locator('[id^="card-"]').count();
    expect(matching).toBeGreaterThan(0);
    expect(matching).toBeLessThan(40);
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
    const copyBtn = firstCard.locator('button:has-text("Копировать"), button:has-text("Copy")').first();
    // Every prompt card has a copy button — fail loud if not.
    await expect(copyBtn).toBeVisible({ timeout: 5000 });
    await copyBtn.click();
    // Toast renders at top of viewport (.toast class), not inside the card
    await expect(page.locator('.toast')).toBeVisible({ timeout: 3000 });
  });

  test('keyboard shortcut ? opens overlay', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-theme]', { timeout: 15000 });
    await page.keyboard.press('?');
    await expect(page.locator('role=dialog')).toBeVisible({ timeout: 3000 });
  });

  // Regression test for iter1's stale-closure bug: the global keydown effect
  // had `[section, toggle]` deps so its closure froze modal state vars and
  // ESC silently failed to close anything. Now that all 8 modal/state vars
  // are in the deps, this should be the first ESC that closes the dialog.
  test('Escape closes the shortcuts dialog (stale-closure regression)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-theme]', { timeout: 15000 });
    await page.keyboard.press('?');
    await expect(page.locator('role=dialog')).toBeVisible({ timeout: 3000 });
    await page.keyboard.press('Escape');
    await expect(page.locator('role=dialog')).not.toBeVisible({ timeout: 3000 });
  });

  test('mobile viewport renders', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
  });
});
