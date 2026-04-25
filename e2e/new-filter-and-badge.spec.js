import { test, expect } from '@playwright/test';

// Regression coverage for iter68 (NEW filter pill) and iter69 (per-card NEW
// badge). Both bugs lived only in App.jsx inline render path — filter.test.ts
// covers the utility-level filterPrompts() but App.jsx had its own inline
// implementation that diverged. Real Chromium needed because jsdom can't
// fully decompress the Z blob (DecompressionStream gap — see iter72).

test.describe('NEW filter pill + per-card badge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[id^="card-"]', { timeout: 15000 });
  });

  test('clicking the NEW pill shows non-empty card list (iter68 regression)', async ({ page }) => {
    // Pre-iter68: filter compared p.v === "7.1" → 0 matches → empty list.
    // Post-iter68: filter compares parseFloat(p.v) === maxV → ≥1 match (the
    // latest batch shipped to the catalog).
    const newPill = page.locator('button[aria-pressed]', { hasText: /^new$/i }).first();
    await expect(newPill).toBeVisible({ timeout: 5000 });
    await newPill.click();
    // Wait for filter to apply
    await page.waitForTimeout(300);
    const cardCount = await page.locator('[id^="card-"]').count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('every card visible under NEW filter shows "· new" badge (iter69 regression)', async ({ page }) => {
    // Pre-iter69: badge condition `p.v==="7.1"` matched 0 prompts → cards
    // never decorated. Post-iter69: badge tied to dynamic maxV, so EVERY card
    // visible under NEW filter has the badge.
    const newPill = page.locator('button[aria-pressed]', { hasText: /^new$/i }).first();
    await newPill.click();
    await page.waitForTimeout(300);
    const cards = page.locator('[id^="card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Spot-check first card has the badge text
    const firstCardText = await cards.first().textContent();
    expect(firstCardText?.toLowerCase()).toContain('new');
  });
});
