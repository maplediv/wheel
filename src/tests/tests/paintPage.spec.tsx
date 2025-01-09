
import { test, expect } from '@playwright/test';


test('PaintPage palette save test', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Analyze Image');

  const savedPalette = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('savedPalette') || 'null')
  );
  expect(savedPalette).not.toBeNull();
});
