import { test, expect } from '@playwright/test';
test('local', async ({ page }) => {
    await page.goto('./tests/local.html');
    // wait for 3 seconds
    await page.waitForTimeout(3000);
    const editor = page.locator('#target');
    await expect(editor).toHaveAttribute('mark', 'good');
});

test('dynamic attributes', async ({ page }) => {
    await page.goto('./tests/dynamicAttrs.html');
    // wait for 3 seconds
    await page.waitForTimeout(3000);
    const target = page.locator('#target');
    await expect(target).toHaveAttribute('mark', 'good');
    const select = page.locator('select');
    await expect(select).toHaveAttribute('aria-label', 'Country');
});
