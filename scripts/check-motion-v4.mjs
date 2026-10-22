import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:900}});
const page=await context.newPage();
const base=process.env.TWIN_QA_URL||'http://127.0.0.1:4328';
const entrances=[];
for(const selector of ['[data-craft-reveal="product-title"]','[data-craft-reveal="workspace"]','.map-core','.component-client-tools','.channel-image-reveal','.contact-copy','.contact form']){
 await page.goto(base);await page.waitForSelector('.delivery-host[data-enhanced=true]');const target=page.locator(selector);
 await target.evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-innerHeight*.88,behavior:'instant'}));
 const samples=[];
 const sample=async phase=>samples.push({phase,...await target.evaluate(e=>{const s=getComputedStyle(e);return {opacity:s.opacity,transform:s.transform,clip:s.clipPath,waiting:e.hasAttribute('data-craft-waiting'),animations:e.getAnimations().length}})});
 await sample('before');
 for(let i=0;i<5;i++){await page.mouse.wheel(0,12);await page.waitForTimeout(45)}
 await sample('entry');await page.waitForTimeout(200);await sample('middle');await page.waitForTimeout(1100);await sample('final');
 entrances.push({selector,samples});
}
await page.goto(base);await page.waitForSelector('.delivery-host[data-enhanced=true]');
const seek=async p=>{await page.locator('.delivery-host').evaluate((h,v)=>scrollTo({top:h.getBoundingClientRect().top+scrollY+(h.clientHeight-innerHeight)*v,behavior:'instant'}),p);await page.waitForTimeout(70)};
const states=[];
for(const p of [.05,.35,.68,.84,.98,.84,.68]){await seek(p);states.push(await page.locator('.delivery-host').evaluate(h=>({p:h.dataset.progress,label:h.dataset.word,ivWidth:getComputedStyle(h.querySelector('.delivery-copy .iv-window')).width,prefix:h.querySelector('.delivery-copy .effect-row>span').getBoundingClientRect().x,answer:getComputedStyle(h.querySelector('.delivery-answer')).opacity})));}
await page.screenshot({path:'/tmp/twin-v4-final-word.png'});
await seek(.84);await page.screenshot({path:'/tmp/twin-v4-insertion.png'});
const visibility=[];
page.on('console',()=>{});
await page.evaluate(()=>{window.__v4Visibility=[];document.addEventListener('visibilitychange',()=>window.__v4Visibility.push(document.visibilityState))});
const other=await page.context().newPage();await other.goto('about:blank');await other.bringToFront();await page.waitForTimeout(100);visibility.push(await page.evaluate(()=>document.visibilityState));await page.bringToFront();await page.waitForTimeout(100);visibility.push(await page.evaluate(()=>document.visibilityState));
const events=await page.evaluate(()=>window.__v4Visibility);
// Exercise resume explicitly when headless Chromium keeps both tabs visible.
await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))});await seek(.68);
await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))});await page.waitForTimeout(100);
const resumed=await page.locator('.delivery-host').getAttribute('data-word');
const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');const before=await cdp.send('Performance.getMetrics');
await page.evaluate(()=>{window.__v4Long=[];window.__v4Frames=[];window.__v4Running=true;let last=performance.now();new PerformanceObserver(l=>window.__v4Long.push(...l.getEntries().map(e=>e.duration))).observe({type:'longtask',buffered:false});function tick(n){window.__v4Frames.push(n-last);last=n;if(window.__v4Running)requestAnimationFrame(tick)}requestAnimationFrame(tick)});
for(const dy of [40,40,40,40,40,-40,-40,-40,-40,-40]){await page.mouse.wheel(0,dy);await page.waitForTimeout(60)}
const performance=await page.evaluate(()=>{window.__v4Running=false;const f=window.__v4Frames.slice(1).sort((a,b)=>a-b);return {samples:f.length,medianFrameMs:f[Math.floor(f.length*.5)],p95FrameMs:f[Math.floor(f.length*.95)],longTasksMs:window.__v4Long}});const after=await cdp.send('Performance.getMetrics');
const report={environment:'Headless Chromium in shared cloud; native wheel input',entrances,states,visibility:{actualTabStates:visibility,actualEvents:events,explicitVisibilityResumeWord:resumed},performance,metrics:{before:before.metrics.filter(m=>['LayoutDuration','RecalcStyleDuration','ScriptDuration','TaskDuration'].includes(m.name)),after:after.metrics.filter(m=>['LayoutDuration','RecalcStyleDuration','ScriptDuration','TaskDuration'].includes(m.name))},limits:'Not physical trackpad or Safari/iOS. Headless tab visibility may remain visible; explicit visibility event exercises resume separately.'};
await writeFile('artifacts/motion-v4-browser-check.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({entrances:entrances.map(e=>({selector:e.selector,samples:e.samples})),states,visibility:report.visibility,performance},null,2));await browser.close();
