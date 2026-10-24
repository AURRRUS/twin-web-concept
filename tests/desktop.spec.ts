import { test, expect } from '@playwright/test';

test('desktop: real content, assets and anchors', async ({ page }) => {
  test.setTimeout(60_000);
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Цифровая инфраструктура продаж девелоперского проекта');
  await page.evaluate(async () => { await document.fonts.ready; for (let y = 0; y < document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 70)); } });
  await expect.poll(() => page.locator('img').evaluateAll(images => images.filter(image => image.getClientRects().length > 0).every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.locator('.delivery').scrollIntoViewIfNeeded();
  await expect(page.locator('.delivery-host')).toHaveAttribute('data-enhanced','true');
  await page.evaluate(() => Promise.all([...document.querySelectorAll('.triangle-edge')].flatMap(element => element.getAnimations()).map(animation => animation.finished)));
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('navigation', { name: 'Основная навигация' }).getByRole('link', { name: 'Сценарии' }).click();
  await expect(page).toHaveURL(/#channels$/);
});

test('all seven dialogs, keyboard focus, history, direct URL and contact topic', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toHaveAttribute('data-hydrated','true');
  for (const id of ['client-tools', 'virtual-sales', 'content-system', 'management', 'integrations', 'commercial', 'core']) {
    const link = page.locator(`.composition-map a[href="?component=${id}#composition"]`);
    await link.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('#component-dialog-title')).toBeFocused();
    await expect(page).toHaveURL(new RegExp(`component=${id}`));
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(link).toBeFocused();
  }
  await page.locator('.component-management').click();
  await page.goBack();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.goForward();
  await expect(page.getByRole('dialog')).toBeVisible();
  // Native dialog traps Tab; background content is inert.
  await page.locator('.dialog-close').focus();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Обсудить конфигурацию' })).toBeFocused();
  await page.getByRole('button', { name: 'Обсудить конфигурацию' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('#contact-topic')).toHaveValue('Управление и аналитика');
  await page.goto('/?component=core#composition');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Закрыть описание компонента' }).click();
  await expect(page).not.toHaveURL(/component=/);
});

test('channel sheet navigation supports all four scenes and keyboard',async({page})=>{
 await page.goto('/#channels');await expect(page.locator('.channels')).toHaveAttribute('data-motion-enabled','true');const links=page.getByRole('navigation',{name:'Каналы продаж'}).getByRole('link');
 for(let i=0;i<4;i++){await links.nth(i).click();await expect(links.nth(i)).toHaveAttribute('aria-current','step');await expect(page.locator('.channel-card').nth(i)).not.toHaveAttribute('inert','');}
 await page.keyboard.press('Home');await expect(links.first()).toBeFocused();await expect(links.first()).toHaveAttribute('aria-current','step');await page.keyboard.press('ArrowDown');await expect(links.nth(1)).toBeFocused();await expect(links.nth(1)).toHaveAttribute('aria-current','step');await page.keyboard.press('End');await expect(links.last()).toBeFocused();
});

test('shared selection, parent resets, direct demo and invalid IDs', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toHaveAttribute('data-hydrated','true');
  await page.getByRole('tab', { name: 'Вид', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Вид', exact: true })).toHaveAttribute('aria-selected','true');
  await expect(page.getByRole('link', { name: 'Открыть демо', exact: true })).toHaveAttribute('href', /view=view/);
  await page.getByRole('link', { name: 'Открыть демо', exact: true }).click();
  await expect(page).toHaveURL(/\/demo\?.*view=view/);
  await expect(page.getByRole('tab', { name: 'Вид', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('Настоящий Twin пока не подключён.')).toBeVisible();
  await page.getByRole('combobox', { name: 'Корпус' }).selectOption('');
  await expect(page.getByRole('combobox', { name: 'Этаж' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Лот 4.2' })).toBeDisabled();
  await page.getByRole('combobox', { name: 'Корпус' }).selectOption('building-1');
  await expect(page.getByRole('button', { name: 'Лот 4.2' })).toBeDisabled();
  await page.getByRole('combobox', { name: 'Этаж' }).selectOption('floor-4');
  await page.getByRole('button', { name: 'Лот 4.2' }).click();
  await expect(page.getByRole('button', { name: 'Лот 4.2' })).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/demo?projectId=evil&buildingId=building-1&floorId=floor-4&lotId=unknown');
  await expect(page.getByText('Часть выбора из ссылки недоступна.', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Лот 4.2' })).toHaveAttribute('aria-pressed', 'false');
});

test('form validates fields, keeps input and never pretends to send', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', req => { if (req.method() === 'POST') requests.push(req.url()); });
  await page.goto('/#contact');
  const form = page.getByRole('form', { name: 'Запрос демонстрации' });
  await form.getByRole('button', { name: 'Запросить демонстрацию' }).click();
  await expect(page.locator('#contact-name')).toBeFocused();
  await expect(page.locator('#error-contact')).toContainText('корректный');
  await page.locator('#contact-name').fill('Проверка');
  await page.locator('#contact-company').fill('Демонстрационная компания');
  await page.locator('#contact-contact').fill('test@example.test');
  await page.locator('#contact-project').fill('javascript:alert(1)');
  await page.locator('#contact-consent').check();
  await form.getByRole('button', { name: 'Запросить демонстрацию' }).click();
  await expect(page.locator('#error-project')).toBeVisible();
  await page.locator('#contact-project').fill('https://example.test');
  await form.getByRole('button', { name: 'Запросить демонстрацию' }).click();
  await expect(form.getByRole('status')).toContainText('Демонстрационная форма: данные не отправлены');
  await expect(page.locator('#contact-name')).toHaveValue('Проверка');
  expect(requests).toEqual([]);
});

test('broken channel image preserves text, CTA and navigation',async({page})=>{
 await page.route(/final-r2\/channels\/online\.png/,r=>r.abort());await page.goto('/#channels');const links=page.getByRole('navigation',{name:'Каналы продаж'}).getByRole('link');await links.nth(1).click();await expect(page.locator('#channel-online .media')).toHaveClass(/media-failed/);await expect(page.locator('#channel-online p')).toBeVisible();await expect(page.locator('#channel-online .text-link')).toBeVisible();await links.nth(2).click();await expect(page.locator('#channel-agent .media')).not.toHaveClass(/media-failed/);
});

test('desktop widths and reduced motion retain visible content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test('without JavaScript: server-rendered content and honest demo remain available', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.locator('.composition-descriptions summary').click();
  await expect(page.locator('.composition-descriptions').getByRole('heading', { name: 'Интеграции', exact: true })).toBeVisible();
  await page.getByRole('navigation', { name: 'Основная навигация' }).getByRole('link', { name: 'Продукт' }).click();
  await expect(page).toHaveURL(/#product$/);
  await page.goto('/demo');
  await expect(page.getByText('Настоящий Twin пока не подключён.')).toBeVisible();
  await context.close();
});

test('real typefaces load; reduced motion provides four readable Journey scenes',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.evaluate(()=>document.fonts.ready);await expect(page.locator('h1')).toHaveCSS('font-family','"Twin Dewi Expanded", sans-serif');await expect(page.locator('h1')).toHaveCSS('font-weight','900');await expect(page.locator('.journey')).toHaveAttribute('data-enhanced','false');await expect(page.locator('.static-scene:visible')).toHaveCount(4);await expect(page.locator('.channel-card:visible')).toHaveCount(4);await expect(page.locator('.channel-card[inert]')).toHaveCount(0);
});

test('a foreign project cannot retain the known child lot', async ({ page }) => {
  await page.goto('/demo?projectId=foreign-project&buildingId=building-1&floorId=floor-4&lotId=lot-4-2');
  await expect(page.getByText('Часть выбора из ссылки недоступна.', { exact: false })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Корпус' })).toHaveValue('');
  await expect(page.getByRole('combobox', { name: 'Этаж' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Лот 4.2' })).toBeDisabled();
});
