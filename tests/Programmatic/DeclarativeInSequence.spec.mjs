import { test, expect } from '@playwright/test';
test('Programmatic>DeclarativeInSequence', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('./tests/Programmatic/DeclarativeInSequence.html');
    await page.waitForTimeout(2500);
    const target = page.locator('#target');
    await expect(target).toHaveAttribute('mark', 'good');
    expect(errors).toEqual([]);
});
