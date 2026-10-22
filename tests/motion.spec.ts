import {test,expect,type Page} from '@playwright/test';
import {assertTwinType} from '../scripts/assert-twin-type.mjs';
import content from '../src/lib/designContent.json' with {type:'json'};
import {journeyFrame} from '../src/lib/journeyMotion';
const seek=async(page:Page,p:number)=>{
 await page.locator('.journey').evaluate((n,v)=>scrollTo({top:n.getBoundingClientRect().top+scrollY+(n.clientHeight-innerHeight)*v,behavior:'instant'}),p);
 await expect.poll(()=>page.locator('.journey').evaluate((n,v)=>Math.abs(Number((n as HTMLElement).style.getPropertyValue('--scene-progress'))-v),p)).toBeLessThan(.001);
 await page.waitForTimeout(100);
};
test('panoramas reach both viewport edges at all supported widths',async({page})=>{
 for(const width of[360,390,768,1024,1280,1440,1920]){await page.setViewportSize({width,height:900});await page.goto('/');for(const s of['.hero','.journey','.channels']){const r=await page.locator(s).boundingBox();expect(r!.x).toBe(0);expect(r!.width).toBe(width);}expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});
test('title, body and full sheet have separate phases and reversible progress',async({page})=>{
 await page.goto('/');await expect(page.locator('.journey')).toHaveAttribute('data-enhanced','true');
 await seek(page,.1);const frame=(await page.locator('.scene-materials').boundingBox())!;
 for(const p of[.2,.26,.3,.325,.4,.45,.525,.6,.725,.85,.925,.725,.325,.1]){await seek(page,p);const r=(await page.locator('.scene-materials').boundingBox())!;for(const k of['x','y','width','height'] as const)expect(r[k]).toBeCloseTo(frame[k],0);}
 await seek(page,.30);await expect(page.locator('.scene-title-group').nth(1)).toHaveCSS('opacity','1');await expect(page.locator('.scene-material').nth(1)).toHaveCSS('opacity','0');
 const body=await page.locator('.scene-body-group').nth(1).evaluate(e=>+getComputedStyle(e).opacity);expect(body).toBeGreaterThan(0);expect(body).toBeLessThan(.4);
 await seek(page,.4);const incoming=(await page.locator('.scene-material').nth(1).boundingBox())!;expect(incoming.width).toBeGreaterThan(frame.width);expect(incoming.y).toBeLessThan(frame.y);
 await page.locator('.scene-navigation button').nth(2).focus();await page.keyboard.press('Enter');await expect(page.locator('.journey')).toHaveAttribute('data-scene','lot');
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.journey')).toHaveAttribute('data-layout-mode','desktop');await expect(page.locator('.journey-static')).toBeHidden();await expect(page.locator('.journey-cinematic')).toBeVisible();
});
test('reveals finish when reached and reduced motion settles pending groups',async({page})=>{
 await page.goto('/');await page.locator('.contact-copy').scrollIntoViewIfNeeded();await expect(page.locator('#contact-heading')).toHaveCSS('opacity','1');await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('[data-craft-waiting]')).toHaveCount(0);
});
test('hero line breaks and content guides follow the viewport',async({page})=>{
 for(const[width,height]of[[390,844],[768,900],[1024,900],[1280,800],[1440,900],[1920,1080]]){await page.setViewportSize({width,height});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 const data=await page.evaluate(()=>{const n=document.querySelector<HTMLElement>('.hero-content')!,s=getComputedStyle(n),g=parseFloat(s.paddingLeft),C=Math.min(1728,innerWidth-2*g),r=document.querySelector('h1')!.getBoundingClientRect();return{left:(innerWidth-C)/2,x:r.x,lines:r.height/parseFloat(getComputedStyle(document.querySelector('h1')!).lineHeight)}});expect(data.x).toBeCloseTo(data.left,0);if(width>=1280)expect(data.lines).toBeCloseTo(2,1);
 }
});
test('complete scene content stays readable and navigation shares the media top edge',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/');await expect(page.locator('.journey')).toHaveAttribute('data-enhanced','true');
 await expect(page.locator('.scene-body-group')).toHaveText(content.journey.map(s=>s.body));
 const nav=(await page.locator('.scene-navigation').boundingBox())!,media=(await page.locator('.scene-materials').boundingBox())!;expect(media.width).toBeCloseTo(768.4,0);expect(media.x+media.width).toBeCloseTo(1440,0);expect(nav.y).toBe(media.y);
 await page.setViewportSize({width:390,height:844});await expect(page.locator('.journey')).toHaveAttribute('data-enhanced','false');await expect(page.locator('.static-scene>p')).toHaveText(content.journey.map(s=>s.body));await expect(page.locator('.static-scene-nav .scene-nav-description')).toHaveText(content.journey.map(s=>s.navigation_description_lines.join(' ')));
 for(const p of await page.locator('.static-scene>p').all())expect(await p.evaluate(e=>e.scrollHeight<=e.clientHeight+1)).toBe(true);
});
test('sheet rank stays constant while scale, position and opacity follow the absolute frame',async({page})=>{
 await page.goto('/');await expect(page.locator('.journey')).toHaveAttribute('data-enhanced','true');
 for(const p of[.20,.26,.325,.4,.45,.60,.725,.85,.925,.725,.325,.1]){await seek(page,p);const value=await page.locator('.journey').evaluate(n=>Number((n as HTMLElement).style.getPropertyValue('--scene-progress'))),f=journeyFrame(value);
 for(let i=0;i<3;i++){const style=await page.locator('.scene-material').nth(i).evaluate(e=>({opacity:+getComputedStyle(e).opacity,z:+getComputedStyle(e).zIndex}));expect(style.opacity).toBeCloseTo(f.mediaOpacity[i],3);expect(style.z).toBe(i+1);}
 }
});
test('image dialog restores keyboard focus and low screens use normal flow',async({page})=>{
 for(const[width,height]of[[1440,900],[1280,800],[1920,1080]]){await page.setViewportSize({width,height});await page.goto('/');await expect(page.locator('.journey')).toHaveAttribute('data-enhanced','true');const h=await page.locator('.journey-right').evaluate(e=>({height:e.clientHeight,scroll:e.scrollHeight}));expect(h.scroll).toBeLessThanOrEqual(h.height+1);}
 await page.setViewportSize({width:1440,height:900});const link=page.locator('.journey-cinematic .scene-expand');await link.focus();await page.keyboard.press('Enter');await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(link).toBeFocused();await page.setViewportSize({width:1440,height:700});await expect(page.locator('.journey')).toHaveAttribute('data-enhanced','false');
});
test('rendered Cyrillic uses the real Expanded700 and Inter variable files',async({page})=>{
 await page.goto('/');await page.evaluate(()=>document.fonts.ready);const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');const{root}=await cdp.send('DOM.getDocument');
 for(const[selector,pattern]of[['h1','RF Dewi Expanded'],['.scene-title-group h2','RF Dewi Expanded'],['.scene-body-group','Inter Tight'],['.scene-navigation strong','Inter Tight']] as const){const{nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector});const{fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});expect(fonts.length).toBeGreaterThan(0);for(const f of fonts){expect(f.isCustomFont).toBe(true);expect(f.familyName).toContain(pattern);expect(f.glyphCount).toBeGreaterThan(0);}}await cdp.detach();
});
test('exact correction V2 type metrics at desktop, tablet and phone sizes',async({page})=>{
 for(const[width,height]of[[1440,900],[1280,800],[1920,1080],[1024,900],[768,900],[390,844],[360,844],[320,844]]){await page.setViewportSize({width,height});await page.goto('/');await assertTwinType(page);const h2=page.locator(width>=1024?'.scene-title-group h2':'.static-scene h2').first(),size=width>=1280?Math.max(34,Math.min(46,38+(width-1440)/60)):width>=600?32:width>=360?27:25;expect(await h2.evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeCloseTo(size,1);await expect(h2).toHaveCSS('font-weight','700');}
});
test('hero has all four channels and navigation is readable without backgrounds',async({page})=>{
 for(const[width,height]of[[1280,800],[1440,900],[1920,1080]]){await page.setViewportSize({width,height});await page.goto('/');await expect(page.locator('.journey')).toHaveAttribute('data-enhanced','true');await expect(page.locator('.hero-channels')).toHaveText('на сайте, дистанционно, через агентов, в офисе продаж.');await expect(page.locator('.hero .actions a')).toHaveCount(1);
 for(const n of await page.locator('.scene-navigation button').all()){await expect(n).toHaveCSS('background-color','rgba(0, 0, 0, 0)');const a=(await n.locator('strong').boundingBox())!,b=(await n.locator('.scene-nav-description').boundingBox())!;expect(b.y).toBeGreaterThanOrEqual(a.y+a.height+7.9);await expect(n.locator('strong')).toHaveCSS('font-weight','600');}}
});
test('entrances are one-shot and focus makes contact immediately usable',async({page})=>{
 await page.goto('/');await expect(page.locator('.journey')).toHaveAttribute('data-enhanced','true');const h=page.locator('.center-heading h2');await expect(h).toHaveAttribute('data-craft-waiting','');await h.scrollIntoViewIfNeeded();await expect(h).not.toHaveAttribute('data-craft-waiting');await page.locator('#contact-name').focus();expect(await page.locator('.contact form').evaluate(e=>e.getAnimations().length)).toBe(0);
});

test('a failed scene image keeps full text and exposes the real demo link',async({page})=>{
 await page.route(/\/media\/top-v2\/project[^/]*\.webp/,route=>route.abort());await page.goto('/');await expect(page.locator('.journey')).toHaveAttribute('data-enhanced','true');await seek(page,.1);await expect(page.locator('.scene-material-project .media-failed')).toBeVisible();await expect(page.locator('.journey-cinematic .scene-demo')).toBeVisible();await expect(page.locator('.journey-cinematic .scene-demo')).toHaveAttribute('href','/demo');await expect(page.locator('.scene-body-group').first()).toHaveText(content.journey[0].body);
});
test('mobile menu retains keyboard-accessible routes',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.locator('.mobile-navigation summary').focus();await page.keyboard.press('Enter');const nav=page.getByRole('navigation',{name:'Мобильная навигация'});await expect(nav).toBeVisible();await nav.getByRole('link',{name:'Продукт',exact:true}).click();await expect(page).toHaveURL(/#product$/);
});
