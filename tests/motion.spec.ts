import { test, expect } from '@playwright/test';
import { assertTwinType } from '../scripts/assert-twin-type.mjs';

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
    await page.waitForTimeout(850);
  };
  await go(.10);
  const baseline = await page.locator('.scene-materials').boundingBox();
  for (const progress of [.28, .30, .35, .50, .68, .70, .75, .90, .10]) {
    await go(progress);
    const frame = await page.locator('.scene-materials').boundingBox();
    for (const key of ['x', 'y', 'width', 'height'] as const) expect(Math.abs(frame![key] - baseline![key])).toBeLessThanOrEqual(2);
  }
  for (const [progress, next, previous] of [[.29, 1, 0], [.71, 2, 1]] as const) {
    await go(progress);
    expect(Number(await page.locator('.scene-text-group').nth(next).evaluate(el => getComputedStyle(el).opacity))).toBeCloseTo(1, 2);
    expect(await page.locator('.scene-material').nth(next).evaluate(el => parseFloat(getComputedStyle(el).clipPath.split(' ')[1]))).toBeGreaterThan(95);
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
      const G = W < 600 ? 20 : W < 1100 ? 32 : W < 1280 ? 48 : W < 1400 ? 56 : 64;
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
    if (width >= 1100) { expect(data.lines).toBeCloseTo(2, 1); expect(data.fontSize).toBeGreaterThanOrEqual(40); }

  }
});


test('full scene text survives mobile and desktop shares text space above navigation and media', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto('/');
  await expect(page.locator('.journey')).toHaveAttribute('data-enhanced', 'true');
  const facade = await page.locator('.cinematic-facade').boundingBox();
  const media = await page.locator('.scene-materials').boundingBox();
  const text = await page.locator('.scene-text-zone').boundingBox();
  expect(facade!.x).toBe(0); expect(facade!.width).toBeGreaterThanOrEqual(1440 * .35);
  expect(media!.width).toBeCloseTo(720, 0);
  expect(text!.x).toBeLessThan(media!.x); expect(text!.width).toBeGreaterThan(media!.width);
  const paragraphs = [
    'Окружение, архитектура, инфраструктура и расположение корпусов — помогите покупателю увидеть проект целиком и понять, как его преимущества связаны с выбором конкретного лота.',
    'Покажите, как устроена жизнь внутри проекта: общественные зоны, интерьеры, террасы и виды. Помогите покупателю представить пространство будущего лота и понять, что находится за пределами его планировки.',
    'Свяжите расположение лота в корпусе и на этаже с его планировкой, пространством и видом. Дайте покупателю последовательно рассмотреть детали выбранного варианта.',
  ];
  const descriptions = ['Окружение, архитектура и инфраструктура.', 'Общественные зоны, интерьеры и виды.', 'Расположение, планировка и детали выбора.'];
  await expect(page.locator('.scene-text-group > p')).toHaveText(paragraphs);
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


test('opaque mask follows the specified overlapping text entry and media phases reversibly', async ({ page }) => {
  test.setTimeout(45000);
  await page.goto('/'); await expect(page.locator('.journey')).toHaveAttribute('data-enhanced', 'true');
  for (const start of [.14, .56]) {
    for (const q of [.1, .25, .55, .75, .95, .75, .55, .25, .1]) {
      await page.evaluate(p => { const n = document.querySelector('.journey')!; window.scrollTo({ top: n.getBoundingClientRect().top + scrollY + (n.clientHeight - innerHeight) * p, behavior: 'instant' }); }, start + .30 * q);
      await page.waitForTimeout(850);
      for (const image of await page.locator('.scene-material').all()) await expect(image).toHaveCSS('opacity', '1');
      const next = start === .14 ? 1 : 2;
      if (q >= .5) {
        await expect(page.locator('.scene-navigation button').nth(next)).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('.scene-text-group').nth(next)).toHaveCSS('opacity', '1');
        await expect(page.locator('.scene-text-group').nth(next)).toHaveAttribute('aria-hidden', 'false');
      }
      if (q < .4) expect(await page.locator('.scene-material').nth(next).evaluate(el => parseFloat(getComputedStyle(el).clipPath.split(' ')[1]))).toBeGreaterThan(95);
    }
  }
});

test('image original dialog works by keyboard, restores focus and laptop scenes fit', async ({ page }) => {
  for (const [width, height] of [[1440,900], [1366,768], [1280,800], [1920,1080]]) {
    await page.setViewportSize({ width, height }); await page.goto('/'); await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.journey')).toHaveAttribute('data-enhanced', 'true');
    const size = await page.locator('.journey-right').evaluate(el => ({ height: el.clientHeight, content: el.scrollHeight }));
    expect(size.content).toBeLessThanOrEqual(size.height + 1);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  const link = page.locator('.journey-cinematic .scene-expand');
  await link.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').locator('img')).toHaveAttribute('src', /recovery-original\/project.png/);
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toBeHidden(); await expect(link).toBeFocused();
  await page.locator('.scene-navigation button').nth(2).focus(); await page.keyboard.press('Space');
  await expect(page.locator('.journey')).toHaveAttribute('data-scene', 'lot');
  await page.setViewportSize({ width: 1440, height: 500 }); await expect(page.locator('.journey')).toHaveAttribute('data-enhanced', 'false');
  expect(await page.locator('.journey').evaluate(el => el.clientHeight)).toBeLessThan(5000);
});

test('provided RF Dewi Expanded and Inter Tight render Cyrillic glyphs without fallback or compressed tracking', async ({ page }) => {
  await page.goto('/'); await page.evaluate(() => document.fonts.ready);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument');
  for (const [selector, family] of [['h1', 'RF Dewi Expanded'], ['.scene-text-group h2', 'RF Dewi Expanded'], ['.scene-text-group p', 'Inter Tight'], ['.scene-navigation strong', 'RF Dewi Expanded']] as const) {
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector });
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
    expect(fonts.length).toBeGreaterThan(0);
    for (const font of fonts) { expect(font.familyName).toMatch(family.startsWith('RF Dewi Expanded') ? /^RF Dewi Expanded/ : /^Inter Tight$/); expect(font.isCustomFont).toBe(true); expect(font.glyphCount).toBeGreaterThan(0); }
    if (selector !== '.scene-text-group p') expect(await page.locator(selector).first().evaluate(el=>getComputedStyle(el).letterSpacing)).toMatch(/^(normal|0px)$/);
  }
});


test('owner type contract: exact Expanded weights, breakpoints, clean hero and headings', async ({ page }) => {
  for (const [width, height] of [[1440,900],[1366,768],[1280,800],[1920,1080],[768,1024],[390,844],[320,844]]) {
    await page.setViewportSize({width,height}); await page.goto('/'); await assertTwinType(page);
    const h2=page.locator(width>=1280?'.scene-text-group h2':'.static-scene h2').first();
    const size=width>=1600?48:width>=1400?44:width>=1280?40:width>=600?36:width>=360?28:26;
    await expect(h2).toHaveCSS('font-size', `${size}px`); await expect(h2).toHaveCSS('font-weight','400');
    if(width>=1280) await expect(page.locator('.journey')).toHaveAttribute('data-enhanced','true');
    if(width<600) {
      const image=await page.locator('.hero-image').boundingBox(),copy=await page.locator('.hero-content').boundingBox();
      expect(image!.y).toBeGreaterThanOrEqual(copy!.y+copy!.height-1); expect(image!.height).toBe(340);
    }
  }
});


test('craft hero CTA, full height and separated navigation geometry', async ({ page }) => {
  for (const [width,height] of [[1280,800],[1366,768],[1440,900],[1920,1080]]) {
    await page.setViewportSize({width,height}); await page.goto('/');
    await expect(page.locator('.journey')).toHaveAttribute('data-enhanced','true');
    await expect(page.locator('.hero h1')).toHaveCSS('font-weight','400');
    expect((await page.locator('.hero').boundingBox())!.height).toBe(height);
    await expect(page.locator('.header-cta')).toHaveText('Обсудить проект');
    await expect(page.locator('.header-cta')).toHaveAttribute('href', '/#contact');
    await expect(page.locator('.hero .actions a')).toHaveCount(1);
    await expect(page.locator('.hero-subtitle-row').last()).toHaveCSS('white-space','nowrap');
    const media = (await page.locator('.scene-materials').boundingBox())!;
    for (const button of await page.locator('.scene-navigation button').all()) {
      const title=button.locator('strong'), description=button.locator('.scene-nav-description');
      await expect(title).toHaveCSS('display','block'); await expect(description).toHaveCSS('display','block');
      await expect(title).toHaveCSS('font-weight','400'); await expect(title).toHaveCSS('font-size','18px');
      const a=(await title.boundingBox())!,b=(await description.boundingBox())!;
      expect(b.y-a.y-a.height).toBeGreaterThanOrEqual(8);
      expect(a.x+a.width).toBeLessThan(media.x); expect(b.x+b.width).toBeLessThan(media.x);
      expect(await button.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
    }
  }
});

test('craft entrance is one-shot, focus cancels delays and reduced motion clears waiting', async ({page})=>{
  await page.goto('/'); await expect(page.locator('.journey')).toHaveAttribute('data-enhanced','true');
  const header=page.locator('.center-heading');
  await expect(header).toHaveAttribute('data-craft-waiting','');
  await header.scrollIntoViewIfNeeded(); await expect(header).not.toHaveAttribute('data-craft-waiting');
  await page.waitForTimeout(1100);
  await page.locator('.contact input').first().focus();
  expect(await page.locator('.contact form').evaluate(e=>e.getAnimations().length)).toBe(0);
  await expect(page.locator('.contact form')).toHaveCSS('opacity','1');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('[data-craft-waiting]')).toHaveCount(0);
});
