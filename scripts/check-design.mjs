import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import {assertTwinType} from './assert-twin-type.mjs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
const base=process.env.TWIN_QA_URL||'http://127.0.0.1:4329';const errors=[];page.on('pageerror',e=>errors.push(e.message));
const ready=async()=>{await page.waitForFunction(()=>document.querySelector('.journey')?.dataset.enhanced!=='pending');await page.evaluate(()=>document.fonts.ready);};
const report={viewports:[],journey:[],delivery:[],entrances:[],errors};
for(const[width,height]of[[1920,1080],[1440,900],[1440,800],[1280,800],[1024,900],[768,900],[390,844],[360,844],[320,844]]){
 await page.setViewportSize({width,height});await page.goto(base);await ready();await assertTwinType(page);
 report.viewports.push(await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,journey:document.querySelector('.journey').dataset.enhanced,delivery:document.querySelector('.delivery-host').dataset.enhanced,frame:document.querySelector('.scene-materials').getBoundingClientRect().toJSON(),h1:getComputedStyle(document.querySelector('h1')).font,channels:document.querySelector('.hero-channels').textContent})));
 if(width===390){await page.waitForTimeout(1000);await page.screenshot({path:'/tmp/twin-handoff-phone.png'});}
}
await page.setViewportSize({width:1440,height:900});await page.goto(base);await ready();await page.waitForTimeout(1000);await page.screenshot({path:'/tmp/twin-handoff-hero.png'});
const seek=async(selector,p)=>{await page.locator(selector).evaluate((n,v)=>scrollTo({top:n.getBoundingClientRect().top+scrollY+(n.clientHeight-innerHeight)*v,behavior:'instant'}),p);await page.waitForTimeout(650);};
for(const p of[.1,.2,.26,.325,.4,.45,.525,.6,.725,.85,.925,.725,.325,.1]){
 await seek('.journey',p);report.journey.push(await page.locator('.journey').evaluate(n=>({progress:n.style.getPropertyValue('--scene-progress'),active:n.dataset.scene,titles:[...n.querySelectorAll('.scene-title-group')].map(e=>({opacity:getComputedStyle(e).opacity,transform:getComputedStyle(e).transform})),bodies:[...n.querySelectorAll('.scene-body-group')].map(e=>getComputedStyle(e).opacity),sheets:[...n.querySelectorAll('.scene-material')].map(e=>({opacity:getComputedStyle(e).opacity,transform:getComputedStyle(e).transform,z:getComputedStyle(e).zIndex,bounds:e.getBoundingClientRect().toJSON()}))})));
 if([.1,.325,.4,.525,.925].includes(p))await page.screenshot({path:`/tmp/twin-handoff-journey-${p}.png`});
}
for(const p of[.05,.15,.35,.55,.64,.74,.84,.95,.74,.55]){await seek('.delivery-host',p);report.delivery.push(await page.locator('.delivery-host').evaluate(n=>({p:n.dataset.progress,word:n.dataset.word,ivWidth:n.querySelector('.iv-window').getBoundingClientRect().width,prefixX:n.querySelector('.effect-row>span').getBoundingClientRect().x,answer:getComputedStyle(n.querySelector('.delivery-answer')).opacity})));if(p===.95)await page.screenshot({path:'/tmp/twin-handoff-delivery.png'});}
for(const selector of['.product h2','.product-workspace','.map-core','.component-client-tools','.channel-image-motion','.contact-copy h2','.contact form']){
 await page.goto(base);await ready();const target=page.locator(selector),samples=[];
 const sample=async phase=>samples.push({phase,...await target.evaluate(e=>{const s=getComputedStyle(e);return{opacity:s.opacity,transform:s.transform,clip:s.clipPath,waiting:e.hasAttribute('data-craft-waiting')}})});
 await target.evaluate(e=>{const g=e.closest('.section-heading,.center-heading,.channels-heading,.contact-copy,.composition-map')||e;scrollTo({top:g.getBoundingClientRect().top+scrollY-innerHeight*.85,behavior:'instant'});});await sample('before');
 for(let i=0;i<5;i++){await page.mouse.wheel(0,12);await page.waitForTimeout(35);}await sample('entry');await page.waitForTimeout(350);await sample('middle');await page.waitForTimeout(1300);await sample('final');report.entrances.push({selector,samples});
}
for(const selector of['.product-workspace','.composition-map','.channels','.contact']){await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(1400);await page.screenshot({path:`/tmp/twin-handoff-${selector.slice(1)}.png`});}
await page.evaluate(()=>{window.__designTasks=[];new PerformanceObserver(l=>window.__designTasks.push(...l.getEntries().map(e=>e.duration))).observe({type:'longtask',buffered:false})});await seek('.journey',.325);for(const dy of[80,80,80,-80,-80,-80]){await page.mouse.wheel(0,dy);await page.waitForTimeout(60);}report.longTasks=await page.evaluate(()=>window.__designTasks);
await writeFile('artifacts/design-browser-check.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({viewports:report.viewports,errors,entrances:report.entrances.map(e=>({selector:e.selector,final:e.samples.at(-1)})),longTasks:report.longTasks},null,2));await browser.close();
