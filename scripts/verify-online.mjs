import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { assertTwinType } from './assert-twin-type.mjs';
const base = 'https://aurrrus.github.io/twin-web-concept/';
const expected = process.env.TWIN_EXPECTED_COMMIT;
const result = { site: base, expectedSourceCommit: expected || null, status: 'RUNNING', checkedAt: new Date().toISOString(), checks: [], pageErrors: [], failedResponses: [] };
mkdirSync('artifacts', { recursive: true });
let browser;
try {
  let version;
  for (let n = 0; n < (expected ? 30 : 1); n++) {
    const response = await fetch(base + 'build-version.json?check=' + Date.now(), { cache: 'no-store', signal: AbortSignal.timeout(15000) });
    assert.equal(response.status, 200, 'Build manifest HTTP'); version = await response.json();
    if (!expected || version.sourceCommit === expected) break;
    if (n === 29) throw new Error('Expected source commit has not reached GitHub Pages');
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
  if (expected) assert.equal(version.sourceCommit, expected);
  result.deployedVersion = version;
  result.checks.push('Published manifest matches exact source commit');
  const media = JSON.parse(readFileSync(new URL('../src/lib/media.json', import.meta.url), 'utf8'));
  await Promise.all(['topHero', 'topFacade', 'sceneProject', 'sceneSpace', 'sceneLot'].map(async name => {
    const file = media[name];
    const response = await fetch(`${base}media/${file.file}?v=${file.revision}`, { signal: AbortSignal.timeout(15000) });
    assert.equal(response.status, 200);
    assert.equal(createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex').slice(0, 12), file.revision, `Published asset differs: ${name}`);
  }));
  result.checks.push('All five current top-screen images match local checksums');
  const executablePath = process.env.TWIN_CHROMIUM_PATH || ['/usr/bin/chromium', '/usr/bin/google-chrome', '/opt/google/chrome/chrome'].find(existsSync);
  browser = await chromium.launch({ ...(executablePath ? { executablePath } : {}), args: ['--no-sandbox'], ...(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {}) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const loadedFonts = new Set();
  page.on('pageerror', error => result.pageErrors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400) result.failedResponses.push({ url: response.url(), status: response.status() });
    if (/RFDewiExpanded-.*\.ttf|inter-tight-variable.*\.woff2/.test(response.url()) && response.status() === 200) loadedFonts.add(response.url());
  });
  assert.equal((await page.goto(`${base}?v=${(expected || version.sourceCommit).slice(0, 7)}`, { waitUntil: 'networkidle' })).status(), 200);
  await page.locator('html.has-js').waitFor();
  result.typography = await assertTwinType(page);
  for (const role of ['Regular', 'Semibold', 'Bold']) assert([...loadedFonts].some(url => url.includes(`RFDewiExpanded-${role}`)), `Font HTTP 200 missing: ${role}`);
  assert([...loadedFonts].some(url => url.includes('inter-tight-variable')));
  assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim()), 'Inter Tight');
  result.checks.push('Expanded 400/600/700 and Inter Tight HTTP 200; exact H1 metrics and rendered custom Expanded glyphs; no terminal heading dots or hero overlay');
  await page.waitForFunction(() => document.querySelector('.journey')?.dataset.enhanced === 'true');
  let frame;
  for (const [id, progress] of [['project', .09], ['space', .5], ['lot', .91], ['space', .5], ['project', .09]]) {
    await page.locator('.journey').evaluate((el, p) => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + (el.clientHeight - innerHeight) * p, behavior: 'instant' }), progress);
    await page.waitForFunction(id => document.querySelector('.journey').dataset.scene === id, id);
    const box = await page.locator('.scene-materials').boundingBox();
    const viewport = page.viewportSize().width, sceneWidth = Math.min(viewport, 1920);
    const gutter = viewport >= 1400 ? 64 : 56;
    const inset = Math.max(gutter, (sceneWidth - 1408) / 2);
    const expectedWidth = sceneWidth * .62 + 64 - 224 - 24 - inset;
    assert(Math.abs(box.width - expectedWidth) <= 1, `Media geometry ${box.width} != ${expectedWidth}`);
    if (frame) for (const key of ['x', 'y', 'width', 'height']) assert(Math.abs(frame[key] - box[key]) <= 1);
    frame = box;
    await page.locator(`.scene-material-${id} img`).evaluate(async img => { img.loading = 'eager'; await img.decode(); });
  }
  result.checks.push('Three reversible scenes have stable frames at the specified geometry');
  await page.locator('.journey-cinematic .scene-expand').click();
  await page.getByRole('dialog').locator('img').evaluate(async img => await img.decode());
  await page.keyboard.press('Escape');
  await page.locator('.component-client-tools').click(); await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape'); await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await page.getByRole('tab', { name: 'Агент', exact: true }).click();
  assert.equal(await page.getByRole('tab', { name: 'Агент', exact: true }).getAttribute('aria-selected'), 'true');
  await page.getByRole('tab', { name: 'Вид', exact: true }).click();
  await page.getByRole('link', { name: 'Открыть демо', exact: true }).click();
  await page.getByText('Настоящий Twin пока не подключён.').waitFor();
  assert.equal(await page.getByRole('tab', { name: 'Вид', exact: true }).getAttribute('aria-selected'), 'true');
  assert((await page.url()).includes('/twin-web-concept/demo'));
  result.checks.push('Original dialog, component dialog, channel tabs and selected view handoff to /demo work');
  for (const [width, height] of [[1366,768], [1280,800], [1920,1080], [768,1024], [390,844], [320,844]]) {
    await page.setViewportSize({ width, height }); await page.goto(base, { waitUntil: 'networkidle' }); await assertTwinType(page);
    if (width >= 1280) await page.waitForFunction(() => document.querySelector('.journey').dataset.enhanced === 'true');
    else assert.equal(await page.locator('.static-scene').count(), 3);
  }
  result.checks.push('Published laptop, wide, tablet and phone breakpoints match owner contract');
  assert.deepEqual(result.pageErrors, []); assert.deepEqual(result.failedResponses, []);
  result.status = 'PASS';
} catch (error) { result.status = 'FAIL'; result.error = String(error); process.exitCode = 1; }
finally {
  if (browser) await browser.close();
  writeFileSync('artifacts/online-verification.json', JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
}
