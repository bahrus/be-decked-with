# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\local.spec.mjs >> dynamic attributes
- Location: tests\local.spec.mjs:10:1

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('#target')
Expected: "good"
Received: ""
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('#target')
    9 × locator resolved to <div id="target"></div>
      - unexpected value "null"

```

# Page snapshot

```yaml
- combobox [ref=e2]:
  - option "Select a country" [selected]
  - option "United States"
  - option "United Kingdom"
  - option "Canada"
  - option "Australia"
  - option "Germany"
  - option "France"
  - option "Japan"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | test('local', async ({ page }) => {
  3  |     await page.goto('./tests/local.html');
  4  |     // wait for 3 seconds
  5  |     await page.waitForTimeout(3000);
  6  |     const editor = page.locator('#target');
  7  |     await expect(editor).toHaveAttribute('mark', 'good');
  8  | });
  9  | 
  10 | test('dynamic attributes', async ({ page }) => {
  11 |     await page.goto('./tests/dynamicAttrs.html');
  12 |     // wait for 3 seconds
  13 |     await page.waitForTimeout(3000);
  14 |     const target = page.locator('#target');
> 15 |     await expect(target).toHaveAttribute('mark', 'good');
     |                          ^ Error: expect(locator).toHaveAttribute(expected) failed
  16 |     const select = page.locator('select');
  17 |     await expect(select).toHaveAttribute('aria-label', 'Country');
  18 | });
  19 | 
```