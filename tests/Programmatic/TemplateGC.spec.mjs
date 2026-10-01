import { test, expect } from '@playwright/test';

// Needs gc() exposed, which forces its own worker -- hence a separate file.
test.use({ launchOptions: { args: ['--js-flags=--expose-gc'] } });

test('Programmatic>TemplateGC: a removed template is not kept alive by the elements decked with it', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('./tests/Programmatic/TemplateGC.html');
    await page.waitForTimeout(1500);
    expect(await page.evaluate(() => document.querySelectorAll('fieldset.gc-wrapper select').length), 'both elements were decked').toBe(2);
    // The test's own WeakRef lets it observe collection without keeping the template alive.
    await page.evaluate(() => {
        const el = document.querySelector('#gcTemplate');
        globalThis.__removedRef = new WeakRef(el);
        el.remove();
    });
    // WeakRef targets survive until the current job ends, so collect across several turns.
    const collected = await page.evaluate(async () => {
        const ref = globalThis.__removedRef;
        for(let i = 0; i < 20 && ref.deref() !== undefined; i++){
            await new Promise(r => setTimeout(r, 50));
            globalThis.gc();
        }
        return ref.deref() === undefined;
    });
    expect(collected, 'the removed #gcTemplate was garbage collected, so the enhancement held no strong reference to it').toBe(true);
    // Afterwards, the enhancement keeps working, without errors.
    await page.evaluate(() => {
        document.querySelector('#later').enh.get(globalThis.emc).template = document.querySelector('#liveTemplate');
    });
    await page.waitForTimeout(300);
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => document.querySelector('#later').closest('fieldset.live-wrapper')?.querySelector('legend')?.textContent), 'a later element is still decked').toBe('Later');
});
