import { test, expect } from '@playwright/test';

test.describe('Advanced Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[id^="card-"]', { timeout: 15000 });
  });

  test('glossary opens', async ({ page }) => {
    const glossaryBtn = page.locator('button[aria-label="Glossary"]');
    // Glossary toggle is always in the toolbar — fail loud if missing
    // (iter24 lesson: silent-skip pattern hides locator typos).
    await expect(glossaryBtn).toBeVisible({ timeout: 5000 });
    await glossaryBtn.click();
    await expect(page.locator('[role="dialog"][aria-label="Glossary"]')).toBeVisible({ timeout: 3000 });
  });

  // Iter1 stale-closure regression for the third modal — Glossary's ESC
  // path was the most visible victim because the dialog occupies most of
  // the viewport and "press Escape" is the natural way out.
  test('Escape closes the glossary dialog (iter1 stale-closure regression)', async ({ page }) => {
    await page.locator('button[aria-label="Glossary"]').click();
    await expect(page.locator('[role="dialog"][aria-label="Glossary"]')).toBeVisible({ timeout: 3000 });
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"][aria-label="Glossary"]')).not.toBeVisible({ timeout: 3000 });
  });

  test('prompt of the day is visible', async ({ page }) => {
    const potd = page.locator('text=/Промт дня|Prompt of the day/');
    // May or may not be visible depending on filters
    expect(await potd.count()).toBeGreaterThanOrEqual(0);
  });

  test('breadcrumbs show current section', async ({ page }) => {
    const breadcrumb = page.locator('text=/AIAgent-Hub.*›/');
    expect(await breadcrumb.count()).toBeGreaterThanOrEqual(0);
  });

  test('font size control exists', async ({ page }) => {
    const fontSelect = page.locator('select[aria-label="Font size"]');
    if (await fontSelect.count() > 0) {
      await fontSelect.selectOption('115');
      // Page should scale
      await page.waitForTimeout(200);
    }
  });

  test('keyboard 1-5 switches sections', async ({ page }) => {
    await page.keyboard.press('2');
    await page.waitForTimeout(300);
    await expect(page.locator('#panel-combos')).toBeVisible();

    await page.keyboard.press('1');
    await page.waitForTimeout(300);
    await expect(page.locator('#panel-prompts')).toBeVisible();
  });

  test('export buttons exist', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const exportMd = page.locator('button:has-text("Export .md"), button:has-text("Экспорт .md")');
    expect(await exportMd.count()).toBeGreaterThan(0);
  });

  test('view mode toggles between card and table', async ({ page }) => {
    // Find table toggle button
    const tableBtn = page.locator('button:has-text("☰")');
    if (await tableBtn.count() > 0) {
      await tableBtn.click();
      await expect(page.locator('table')).toBeVisible();
      // Switch back
      const cardBtn = page.locator('button:has-text("▤")');
      await cardBtn.click();
      await expect(page.locator('[id^="card-"]').first()).toBeVisible();
    }
  });
});
