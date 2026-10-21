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

test('scene title leads media, frame stays fixed and progress reverses without a queue', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.journey')).toHaveAttribute('data-enhanced', 'true');
  const go = async (progress: number) => {
    await page.evaluate(value => {
      const node = document.querySelector('.journey')!;
      const panel = node.querySelector('.journey-cinematic')!;
      window.scrollTo({ top: node.getBoundingClientRect().top + scrollY + (node.clientHeight - panel.clientHeight) * value, behavior: 'instant' });
    }, progress);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  };
  await go(.10);
  const baseline = await page.locator('.scene-materials').boundingBox();
  for (const progress of [.28, .30, .35, .50, .68, .70, .75, .90, .10]) {
    await go(progress);
    const frame = await page.locator('.scene-materials').boundingBox();
    for (const key of ['x', 'y', 'width', 'height'] as const) expect(Math.abs(frame![key] - baseline![key])).toBeLessThanOrEqual(2);
  }
  for (const [progress, next, previous] of [[.28, 1, 0], [.68, 2, 1]] as const) {
    await go(progress);
    expect(Number(await page.locator('.scene-headings > [data-layer]').nth(next).evaluate(el => getComputedStyle(el).opacity))).toBeCloseTo(1, 3);
    expect(Number(await page.locator('.scene-material').nth(next).evaluate(el => getComputedStyle(el).opacity))).toBeCloseTo(0, 3);
    expect(Number(await page.locator('.scene-material').nth(previous).evaluate(el => getComputedStyle(el).opacity))).toBeCloseTo(1, 3);
  }
  await go(.30);
  const opacity = await page.locator('.scene-material-space').evaluate(el => getComputedStyle(el).opacity);
  await page.waitForTimeout(150);
  expect(await page.locator('.scene-material-space').evaluate(el => getComputedStyle(el).opacity)).toBe(opacity);
  await page.locator('.scene-navigation button').nth(2).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.journey')).toHaveAttribute('data-scene', 'lot');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.journey')).toHaveAttribute('data-enhanced', 'false');
  await expect(page.locator('.journey-static')).toBeVisible();
  await expect(page.locator('.static-scene')).toHaveCount(3);
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

test('hero line breaks and shared content guides follow the layout viewport', async ({ page }) => {
  for (const [width, height] of [[390,844],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080],[1440,700]]) {
    await page.setViewportSize({ width, height }); await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const data = await page.evaluate(() => {
      const W = document.documentElement.clientWidth;
      const G = W <= 600 ? 20 : W <= 950 ? 32 : Math.max(40, Math.min(64, W * 4.444444 / 100));
      const C = Math.min(1408, W - 2 * G), L = (W - C) / 2;
      const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
      const h = box('h1'), logo = box('.brand .media');
      const scale = Math.min(logo.width / 1200, logo.height / 600);
      return { L, R: L + C, hero: box('.hero-copy').x, cta: box('.header-cta').right,
        logo: logo.x + (logo.width - 1200 * scale) / 2 + 128 * scale,
        lines: h.height / parseFloat(getComputedStyle(document.querySelector('h1')!).lineHeight),
        fontSize: parseFloat(getComputedStyle(document.querySelector('h1')!).fontSize) };
    });
    for (const x of [data.hero, data.logo]) expect(Math.abs(x - data.L)).toBeLessThanOrEqual(2);
    expect(Math.abs(data.cta - data.R)).toBeLessThanOrEqual(2);
    if (width >= 1280) { expect(data.lines).toBeCloseTo(2, 1); expect(data.fontSize).toBeGreaterThanOrEqual(44); }
    if (width === 1024) expect(data.lines).toBeCloseTo(3, 1);
  }
});


test('full scene text survives mobile and desktop uses the specified 1440 grid', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto('/');
  await expect(page.locator('.journey')).toHaveAttribute('data-enhanced', 'true');
  for (const [selector, x, width] of [['.cinematic-facade > .media', 0, 360], ['.scene-navigation', 392, 184], ['.journey-right', 616, 760]] as const) {
    const box = await page.locator(selector).boundingBox();
    expect(box!.x).toBeCloseTo(x, 0); expect(box!.width).toBeCloseTo(width, 0);
  }
  const paragraphs = [
    'Окружение, архитектура, инфраструктура и расположение корпусов — помогите покупателю увидеть проект целиком и понять, как его преимущества связаны с выбором конкретного лота.',
    'Покажите, как устроена жизнь внутри проекта: общественные зоны, интерьеры, террасы и виды. Помогите покупателю представить пространство будущего лота и понять, что находится за пределами его планировки.',
    'Свяжите расположение лота в корпусе и на этаже с его планировкой, пространством и видом. Дайте покупателю последовательно рассмотреть детали выбранного варианта.',
  ];
  const descriptions = ['Окружение, архитектура и инфраструктура.', 'Общественные зоны, интерьеры и виды.', 'Расположение, планировка и детали выбора.'];
  await expect(page.locator('.scene-explanations p')).toHaveText(paragraphs);
  await expect(page.locator('.scene-navigation .scene-nav-description')).toHaveText(descriptions);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.journey')).toHaveAttribute('data-enhanced', 'false');
  await expect(page.locator('.static-scene > p')).toHaveText(paragraphs);
  await expect(page.locator('.static-scene-nav .scene-nav-description')).toHaveText(descriptions);
  for (const paragraph of await page.locator('.static-scene > p').all()) {
    await expect(paragraph).toBeVisible();
    expect(await paragraph.evaluate(el => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
  }
});
