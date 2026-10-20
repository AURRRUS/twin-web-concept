import { test, expect } from '@playwright/test';

test('panoramas reach both viewport edges at all supported widths', async ({ page }) => {
  for (const width of [390, 768, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    for (const selector of ['.hero', '.journey', '.channels']) {
      const bounds = await page.locator(selector).evaluate(el => {
        const rect = el.getBoundingClientRect();
        return { left: rect.left, right: rect.right, viewport: document.documentElement.clientWidth };
      });
      expect(bounds.left).toBeCloseTo(0, 0);
      expect(bounds.right).toBeCloseTo(bounds.viewport, 0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('scene photographs are separated, share a baseline and fade over an opaque image', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.journey')).toHaveAttribute('data-enhanced', 'true');
  const geometry = await page.evaluate(() => {
    const facade = document.querySelector('.cinematic-facade')!.getBoundingClientRect();
    const stage = document.querySelector('.scene-materials')!.getBoundingClientRect();
    return { gap: stage.left - facade.right, baselineDifference: Math.abs(stage.bottom - facade.bottom) };
  });
  expect(geometry.gap).toBeGreaterThanOrEqual(15.5);
  expect(geometry.baselineDifference).toBeLessThan(1);
  for (const [progress, scene] of [[0.3, 'project'], [0.5, 'space'], [0.88, 'lot'], [0.5, 'space'], [0.12, 'project']] as const) {
    await page.evaluate(value => {
      const node = document.querySelector('.journey')!;
      window.scrollTo({ top: node.getBoundingClientRect().top + scrollY + (node.clientHeight - innerHeight) * value, behavior: 'instant' });
    }, progress);
    await expect(page.locator('.journey')).toHaveAttribute('data-scene', scene);
    expect(await page.locator('.scene-material-project').evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.journey')).toHaveAttribute('data-enhanced', 'false');
  await expect(page.locator('.journey-static')).toBeVisible();
});

test('reveals finish when reached and stay readable with reduced motion', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/has-js/);
  await page.locator('.contact-copy').scrollIntoViewIfNeeded();
  await expect(page.locator('.contact-copy')).toHaveCSS('opacity', '1');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const selector of ['.section-heading', '.center-heading', '.channels-heading', '.contact-copy', '.contact form']) {
    const elements = page.locator(selector);
    for (let i = 0; i < await elements.count(); i++) await expect(elements.nth(i)).toHaveCSS('opacity', '1');
  }
});
