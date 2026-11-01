import {chromium} from '@playwright/test';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const typography = JSON.parse(fs.readFileSync('.twin/v2/typography.json', 'utf8'));
const visualContract = JSON.parse(fs.readFileSync('.twin/tasks/VIS-005/visual-contract.json', 'utf8'));
const travel = visualContract.geometry.travel;
assert(Number.isFinite(travel) && travel > 0, 'Journey travel must come from the active visual contract');
const out = process.env.V2_QA_DIR || 'artifacts/hero-journey';
fs.mkdirSync(out, {recursive: true});
fs.copyFileSync(visualContract.reference.path, `${out}/reference-upper.jpg`);
const browser = await chromium.launch({
  ...(process.env.QA_CHROMIUM ? {executablePath: process.env.QA_CHROMIUM} : {}),
  args: ['--no-sandbox']
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const results = [];

async function naturalExit(journey, width, height) {
  // Establish a repeatable starting state; the transition out is driven ONLY by wheel input.
  await journey.evaluate(element => scrollTo({top: element.getBoundingClientRect().top + scrollY - 24, behavior: 'instant'}));
  await page.waitForTimeout(120);
  await page.mouse.move(width / 2, height / 2);
  const start = await page.evaluate(() => scrollY);
  const seen = new Set();
  const pinned = await journey.getAttribute('data-pinned') === 'true';
  const step = Math.min(300, travel / 6);
  const maxSteps = Math.ceil((await journey.evaluate(element => element.offsetHeight) + height * 2) / step) + 2;
  let exited = false;
  for (let index = 0; index < maxSteps; index++) {
    seen.add(await journey.locator('.r4-journey-options button').evaluateAll(buttons => buttons.findIndex(button => button.getAttribute('aria-expanded') === 'true')));
    const before = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(120);
    const state = await page.evaluate(() => ({
      y: scrollY,
      journeyBottom: document.querySelector('#journey').getBoundingClientRect().bottom,
      demoTop: document.querySelector('.r4-demo').getBoundingClientRect().top
    }));
    assert(state.y > before, `wheel input did not move the page at ${width}x${height}`);
    if (state.journeyBottom < height && state.demoTop < height && state.demoTop >= -step) {
      exited = true;
      break;
    }
  }
  assert(exited, `natural wheel exit into demo failed at ${width}x${height}`);
  assert(await page.evaluate(() => scrollY) > start, 'exit must involve real user scrolling');
  if (pinned) assert.deepEqual([...seen].sort(), [0, 1, 2, 3], 'wheel traversal must expose all four current ReferenceJourney states');
  return {driver: 'wheel', statesSeen: [...seen].sort(), pinned};
}

try {
  const viewports = process.env.V2_QA_COMPACT
    ? [[1440, 900], [1920, 1080], [390, 844]]
    : [[1440, 900], [1366, 768], [1920, 1080], [390, 844], [360, 800], [768, 900], [1099, 900], [1100, 900]];
  for (const [width, height] of viewports) {
    await page.setViewportSize({width, height});
    await page.goto(process.env.V2_URL || 'http://localhost:4361/twin-web-concept/v2/', {waitUntil: 'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    assert(await page.evaluate(() => scrollY < 2), 'load must stay at hero');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${width}`);
    const profile = width <= typography.breakpoints.mobileMax ? 'mobile' : width <= typography.breakpoints.tabletMax ? 'tablet' : 'desktop';
    const hero = typography.roles.hero;
    const sizes = await page.locator('.r4-hero-copy h1').evaluate(element => {
      const style = getComputedStyle(element);
      return {size: parseFloat(style.fontSize), lineHeight: parseFloat(style.lineHeight), weight: Number(style.fontWeight)};
    });
    assert.deepEqual(sizes, {size: hero[profile].size, lineHeight: hero[profile].lineHeight, weight: hero.weight});
    await page.screenshot({path: `${out}/hero-${width}.png`});
    const journey = page.locator('#journey');
    await journey.evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - 200));
    await page.screenshot({path: `${out}/join-${width}.png`});
    for (let index = 0; index < 4; index++) {
      await journey.locator('.r4-journey-options button').nth(index).click();
      await page.waitForTimeout(750);
      assert.equal(await journey.locator('.r4-journey-options button').nth(index).getAttribute('aria-expanded'), 'true');
      if (width === 1440 || width === 390) await page.screenshot({path: `${out}/state-${index}-${width}.png`});
    }
    if (await journey.getAttribute('data-pinned') === 'true') {
      // Deterministic sampling checks state stability/reverse; it does not prove natural exit.
      for (const progress of [.1, .4, .7, .95, .7, .4, .1]) {
        await journey.evaluate((element, target) => scrollTo({top: element.getBoundingClientRect().top + scrollY - 24 + target, behavior: 'instant'}), travel * progress);
        await page.waitForTimeout(400);
        const before = await journey.locator('.r4-journey-options button').evaluateAll(buttons => buttons.map(button => button.getAttribute('aria-expanded')));
        await page.waitForTimeout(180);
        assert.deepEqual(await journey.locator('.r4-journey-options button').evaluateAll(buttons => buttons.map(button => button.getAttribute('aria-expanded'))), before);
      }
    }
    const exit = await naturalExit(journey, width, height);
    await page.screenshot({path: `${out}/exit-${width}.png`});
    results.push({width, height, typographyProfile: profile, exit});
  }
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.setViewportSize({width: 1440, height: 900});
  await page.reload({waitUntil: 'networkidle'});
  await page.waitForTimeout(200);
  assert.equal(await page.locator('#journey').getAttribute('data-pinned'), 'false');
  await page.locator('.r4-journey-options button').first().focus();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.r4-journey-options button').last().getAttribute('aria-expanded'), 'true');
  assert.deepEqual(errors, []);
  fs.writeFileSync(`${out}/results.json`, JSON.stringify({status: 'PASS', scope: 'technical browser assertions', visualAcceptance: 'NOT_PERFORMED', results, errors}, null, 2));
} catch (error) {
  await page.screenshot({path: `${out}/failure.png`});
  throw error;
} finally {
  await browser.close();
}
