import { test, expect } from '@playwright/test';

test('desktop: real content, assets, anchors and screenshots', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Цифровая инфраструктура продаж девелоперского проекта.');
  await page.evaluate(async () => { await document.fonts.ready; for (let y = 0; y < document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 70)); } });
  await expect.poll(() => page.locator('img').evaluateAll(images => images.filter(image => image.getClientRects().length > 0).every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ animations: 'disabled', path: 'artifacts/desktop-1440.png', fullPage: true });
  await page.locator('.hero').screenshot({ animations: 'disabled', path: 'artifacts/first-screen.png' });
  await page.locator('.composition').screenshot({ animations: 'disabled', path: 'artifacts/composition-desktop.png' });
  await page.locator('.delivery').scrollIntoViewIfNeeded();
  await expect(page.locator('.delivery')).toHaveClass(/in-view/);
  await page.evaluate(() => Promise.all([...document.querySelectorAll('.triangle-edge')].flatMap(element => element.getAnimations()).map(animation => animation.finished)));
  await page.locator('.delivery').screenshot({ animations: 'disabled', path: 'artifacts/delivery-desktop.png' });
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('navigation', { name: 'Основная навигация' }).getByRole('link', { name: 'Сценарии' }).click();
  await expect(page).toHaveURL(/#channels$/);
});

test('all seven dialogs, keyboard focus, history, direct URL and contact topic', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/has-js/);
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
  await page.screenshot({ animations: 'disabled', path: 'artifacts/component-dialog.png' });
  await page.getByRole('button', { name: 'Обсудить конфигурацию' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('#contact-topic')).toHaveValue('Управление и аналитика');
  await page.goto('/?component=core#composition');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Закрыть описание компонента' }).click();
  await expect(page).not.toHaveURL(/component=/);
});

test('channel tabs support all four states and keyboard', async ({ page }) => {
  await page.goto('/#channels');
  const tabs = page.getByRole('tablist', { name: 'Каналы продаж' });
  await expect(tabs.getByRole('tab', { name: 'Офис продаж' })).toHaveAttribute('aria-selected', 'true');
  for (const label of ['Сайт', 'Онлайн-показ', 'Агент', 'Офис продаж']) {
    await tabs.getByRole('tab', { name: label, exact: true }).click();
    await expect(tabs.getByRole('tab', { name: label, exact: true })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.channel-scene img')).toHaveAttribute('alt', new RegExp(label));
  }
  await page.keyboard.press('Home');
  await expect(tabs.getByRole('tab', { name: 'Сайт', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.getByRole('tab', { name: 'Онлайн-показ' })).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(tabs.getByRole('tab', { name: 'Офис продаж' })).toBeFocused();
});

test('shared selection, parent resets, direct demo and invalid IDs', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/has-js/);
  await page.getByRole('tab', { name: 'Вид', exact: true }).click();
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
  await page.screenshot({ animations: 'disabled', path: 'artifacts/demo-desktop.png', fullPage: true });
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

test('broken image preserves text and channel navigation', async ({ page }) => {
  await page.route('**/media/online.webp', route => route.abort());
  await page.goto('/#channels');
  await page.getByRole('tab', { name: 'Онлайн-показ' }).click();
  await expect(page.locator('.channel-scene')).toHaveClass(/media-failed/);
  await expect(page.getByText('Совместный просмотр выбранного лота с менеджером', { exact: false })).toBeVisible();
  await page.getByRole('tab', { name: 'Агент', exact: true }).click();
  await expect(page.locator('.channel-scene')).not.toHaveClass(/media-failed/);
});

test('desktop widths and reduced motion retain visible content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.screenshot({ animations: 'disabled', path: 'artifacts/desktop-1920.png', fullPage: true });
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

test('desktop typeface loads and architectural scenes reverse without losing content', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.locator('h1').evaluate(element => getComputedStyle(element).fontFamily)).toContain('Manrope Variable');
  expect(await page.evaluate(() => document.fonts.check('450 48px "Manrope Variable"', 'Цифровая инфраструктура'))).toBe(true);
  await expect(page.locator('.journey')).toHaveAttribute('data-enhanced', 'true');
  for (const [progress, scene] of [[0.14, 'project'], [0.5, 'space'], [0.88, 'lot'], [0.5, 'space']] as const) {
    await page.evaluate(p => { const node = document.querySelector('.journey')!; window.scrollTo({ top: node.getBoundingClientRect().top + scrollY + (node.clientHeight - innerHeight) * p, behavior: 'instant' }); }, progress);
    await expect(page.locator('.journey')).toHaveAttribute('data-scene', scene);
    await expect(page.locator('.scene-navigation button[aria-pressed="true"]')).toContainText(scene === 'project' ? 'Проект' : scene === 'space' ? 'Пространство' : 'Лот');
    await page.locator('.journey-cinematic').screenshot({ animations: 'disabled', path: `artifacts/journey-${scene}.png` });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.journey')).toHaveAttribute('data-enhanced', 'false');
  await expect(page.locator('.journey-static')).toBeVisible();
  await expect(page.locator('#lot')).toContainText('Планировка, положение и вид');
});

test('a foreign project cannot retain the known child lot', async ({ page }) => {
  await page.goto('/demo?projectId=foreign-project&buildingId=building-1&floorId=floor-4&lotId=lot-4-2');
  await expect(page.getByText('Часть выбора из ссылки недоступна.', { exact: false })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Корпус' })).toHaveValue('');
  await expect(page.getByRole('combobox', { name: 'Этаж' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Лот 4.2' })).toBeDisabled();
});
