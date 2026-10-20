import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
const base = 'https://aurrrus.github.io/twin-web-concept/';
const expected = process.env.TWIN_EXPECTED_COMMIT;
const result = { site: base, expectedSourceCommit: expected || null, status: 'RUNNING', checkedAt: new Date().toISOString(), checks: [], pageErrors: [] };
mkdirSync('artifacts', { recursive: true });
let browser;
try {
  let version;
  const attempts = expected ? 30 : 1;
  for (let n = 0; n < attempts; n++) {
    try {
      const response = await fetch(base + 'build-version.json?check=' + Date.now(), { cache: 'no-store', signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error('Build manifest HTTP ' + response.status);
      version = await response.json();
      if (!expected || version.sourceCommit === expected) break;
    } catch (error) { if (n === attempts - 1) throw error; }
    if (n === attempts - 1) throw new Error('The expected build was not published before timeout');
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
  if (expected) assert.equal(version.sourceCommit, expected);
  result.deployedVersion = version;
  result.checks.push('Exact source commit matches the published build manifest');
  const media = JSON.parse(readFileSync(new URL('../src/lib/media.json', import.meta.url), 'utf8'));
  for (const name of ['hero', 'facade', 'project', 'interior', 'lot']) {
    const file = name === 'hero' ? 'hero-1672' : name;
    const response = await fetch(`${base}media/${file}.webp?v=${media[name].revision}`, { signal: AbortSignal.timeout(15000) });
    assert.equal(response.status, 200);
    assert.equal(createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex').slice(0, 12), media[name].revision, `Wrong published image: ${name}`);
  }
  result.checks.push('All five published architectural image bytes match the reviewed local files');
  const executablePath = process.env.TWIN_CHROMIUM_PATH || ['/usr/bin/chromium', '/usr/bin/google-chrome', '/opt/google/chrome/chrome'].find(existsSync);
  browser = await chromium.launch({ ...(executablePath ? { executablePath } : {}), args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', error => result.pageErrors.push(error.message));
  const home = await page.goto(base, { waitUntil: 'networkidle' });
  assert.equal(home.status(), 200);
  await page.locator('html.has-js').waitFor();
  await page.evaluate(() => document.fonts.ready);
  assert.match(await page.locator('h1').innerText(), /Цифровая/);
  assert.match(await page.locator('h1').evaluate(el => getComputedStyle(el).fontFamily), /RF Dewi/);
  assert.match(await page.locator('body').evaluate(el => getComputedStyle(el).fontFamily), /Inter Tight/);
  assert(await page.evaluate(() => document.fonts.check('400 48px "RF Dewi"', 'ЦифроваяЁё') && document.fonts.check('400 16px "Inter Tight"', 'КириллицаЁё')));
  assert(await page.evaluate(() => ['RF Dewi', 'Inter Tight'].every(name => [...document.fonts].some(face => face.family.replace(/["']/g, '') === name && face.status === 'loaded'))));
  result.checks.push('Provided RF Dewi and Inter Tight webfonts are actually loaded');
  await page.locator('.hero').screenshot({ path: 'artifacts/online-first-screen.png', animations: 'disabled' });
  await page.waitForFunction(() => document.querySelector('.journey')?.dataset.enhanced === 'true');
  for (const [id, progress] of [['project', 0.14], ['space', 0.5], ['lot', 0.88]]) {
    await page.locator('.journey').evaluate((el, progress) => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + (el.clientHeight - innerHeight) * progress, behavior: 'instant' }), progress);
    await page.waitForFunction(id => document.querySelector('.journey').dataset.scene === id, id);
    const material = page.locator(`.scene-material-${id}`);
    assert((await material.boundingBox()).width > 780);
    await page.waitForFunction(id => { const img = document.querySelector(`.scene-material-${id} img`); return img?.complete && img.naturalWidth > 0; }, id);
  }
  result.checks.push('Published cinematic scenes use large loaded images and preserve three states');
  await page.locator('.component-client-tools').click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await page.getByRole('tab', { name: 'Агент', exact: true }).click();
  assert.equal(await page.getByRole('tab', { name: 'Агент', exact: true }).getAttribute('aria-selected'), 'true');
  await page.getByRole('tab', { name: 'Вид', exact: true }).click();
  await page.getByRole('link', { name: 'Открыть демо', exact: true }).click();
  await page.getByText('Настоящий Twin пока не подключён.').waitFor();
  await page.locator('html.has-js').waitFor();
  assert.equal(await page.getByRole('tab', { name: 'Вид', exact: true }).getAttribute('aria-selected'), 'true');
  const failed = await page.locator('img').evaluateAll(images => images.filter(image => image.getClientRects().length > 0 && (!image.complete || !image.naturalWidth)).map(image => image.src));
  assert.deepEqual(failed, []);
  assert.deepEqual(result.pageErrors, []);
  result.checks.push('Published homepage HTTP 200 and loaded web typeface', 'Published component dialog opens and closes', 'Published channel tabs work', 'Published demo receives the selected view', 'No browser page errors or broken visible images');
  result.status = 'PASS';
} catch (error) { result.status = 'FAIL'; result.error = String(error); process.exitCode = 1; }
finally {
  if (browser) await browser.close();
  writeFileSync('artifacts/online-verification.json', JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
}
