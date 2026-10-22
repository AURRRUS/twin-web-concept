import { test, expect, type Page } from '@playwright/test';
import { deliveryFrame } from '../src/lib/deliveryMotion';
// Pixel-rounded scroll offsets are compared with a tolerance in the scenario below.
const seek = async (page: Page, progress: number) => {
  await page.locator('.delivery-host').evaluate((host,p)=>window.scrollTo({top:host.getBoundingClientRect().top+scrollY+(host.clientHeight-innerHeight)*p,behavior:'instant'}),progress);
  await expect.poll(async()=>Math.abs(Number(await page.locator('.delivery-host').getAttribute('data-progress'))-progress)).toBeLessThan(.002);
};

test('delivery storyboard is reversible with real glyph insertion and fixed surrounding geometry', async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/');
  const host=page.locator('.delivery-host');await expect(host).toHaveAttribute('data-enhanced','true');
  const prefix=page.locator('.delivery-copy .effect-row>span').first();
  await seek(page,.68); const effect=await prefix.boundingBox();
  const staticWidth=(await page.locator('.delivery-copy .delivery-word').boundingBox())!.width;
  for(const p of [.05,.18,.35,.5,.68,.82,.96,.82,.68,.5,.18,.96]){
    await seek(page,p);const frame=deliveryFrame(Number(await host.getAttribute('data-progress')));
    for(let i=0;i<3;i++){
      const offset=await page.locator('.triangle-edge').nth(i).evaluate(e=>Number(getComputedStyle(e).strokeDashoffset.match(/[\d.]+/)![0]));
      expect(offset).toBeCloseTo(1-frame.edges[i],2);
    }
    expect(await page.locator('.delivery-answer').evaluate(e=>Number(getComputedStyle(e).opacity))).toBeCloseTo(frame.answer,2);
    expect((await page.locator('.delivery-copy .delivery-word').boundingBox())!.width).toBeCloseTo(staticWidth,1);
    if(p>=.68){const box=(await prefix.boundingBox())!;expect(box.x).toBeCloseTo(effect!.x,1);expect(box.y).toBeCloseTo(effect!.y,1);}
  }
  await seek(page,.68);
  const suffix=page.locator('.delivery-copy .effect-row>span').last();const suffixBefore=(await suffix.boundingBox())!.x;
  const unit=await page.locator('.delivery-copy .iv-probe').evaluate(e=>e.getBoundingClientRect().width);
  expect(unit).toBeGreaterThan(0);
  await seek(page,.96);expect((await suffix.boundingBox())!.x-suffixBefore).toBeCloseTo(unit,1);
  await expect(host).toHaveAttribute('data-word','Эффективно');
  await expect(page.locator('.delivery-time strong')).toHaveText('3 месяца');await expect(page.locator('.delivery-budget strong')).toHaveText('5 млн ₽');
  const panel=(await page.locator('.delivery-panel').boundingBox())!,steps=(await page.locator('.launch-steps').boundingBox())!;
  expect(steps.y).toBeGreaterThanOrEqual(panel.y+panel.height);
  await page.setViewportSize({width:1366,height:768});await expect(host).toHaveAttribute('data-enhanced','true');
  await page.setViewportSize({width:1440,height:500});await expect(host).toHaveAttribute('data-enhanced','false');
  await expect(page.locator('.delivery-copy .delivery-word-static')).toBeVisible();
});

test('static delivery and exact subtitle survive phone, reduced motion and no JS', async({page,browser})=>{
  for(const [width,height] of [[1280,800],[1366,768],[1440,900],[1920,1080],[390,844],[320,844]]){
    await page.setViewportSize({width,height});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
    await expect(page.locator('.hero-copy p')).toHaveText('Раскрывайте преимущества проекта и помогайте покупателю выбирать — на сайте, дистанционно, через агентов и в офисе продаж.');
    if(width>=1280){await expect(page.locator('.hero-subtitle-row').last()).toHaveCSS('white-space','nowrap');await expect(page.locator('.hero-copy p')).toHaveCSS('font-size',width>=1600?'20px':'18px');}
    else{await expect(page.locator('.delivery-host')).toHaveAttribute('data-enhanced','false');await expect(page.locator('.delivery-copy .delivery-word-static')).toHaveText('Качественно · Эффектно · Эффективно');}
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await expect(page.locator('.delivery-host')).toHaveAttribute('data-enhanced','false');
  for(const edge of await page.locator('.triangle-edge').all()) await expect(edge).toHaveCSS('stroke-dashoffset','0px');
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:900}});const nojs=await context.newPage();await nojs.goto('/');
  await expect(nojs.locator('.delivery-host')).toHaveAttribute('data-enhanced','false');await expect(nojs.locator('.delivery-answer')).toBeVisible();await expect(nojs.locator('.delivery-copy .delivery-word-static')).toBeVisible();await context.close();
});

test('role entrances have distinct masks and timings; anchors and keyboard reveal immediately', async({page})=>{
  await page.goto('/');await expect(page.locator('.journey')).toHaveAttribute('data-enhanced','true');
  for(const [selector,duration] of [['[data-craft-reveal="product-title"]',800],['[data-craft-reveal="workspace"]',900],['.map-core',800],['.component-client-tools',800],['.channel-image-reveal',900],['.contact-copy',720],['.contact form',840]] as const){
    await page.goto('/'); await expect(page.locator('.delivery-host')).toHaveAttribute('data-enhanced','true');
    const target=page.locator(selector);await expect(target).toHaveAttribute('data-craft-waiting','');
    await target.evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-innerHeight*.86,behavior:'instant'}));
    await page.waitForTimeout(40);
    await page.mouse.wheel(0,40);
    await expect(target).not.toHaveAttribute('data-craft-waiting');
    const timing=await target.evaluate(el=>el.getAnimations().map(a=>({duration:a.effect!.getTiming().duration,frames:(a.effect as KeyframeEffect).getKeyframes()})));
    expect(timing.some(t=>t.duration===duration)).toBe(true);
    if(selector.includes('channel'))expect(timing[0].frames[0]).toHaveProperty('clipPath');
    await page.waitForTimeout(1200);await expect(target).toHaveCSS('opacity','1');
  }
  await expect(page.locator('.delivery [data-craft-reveal]')).toHaveCount(0);
  await page.goto('/#contact');await expect(page.locator('.contact form')).not.toHaveAttribute('data-craft-waiting');
  await page.locator('#contact-name').focus();expect(await page.locator('.contact form').evaluate(e=>e.getAnimations().length)).toBe(0);
});
