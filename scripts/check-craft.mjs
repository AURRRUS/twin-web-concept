import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:900}});
await page.goto((process.env.TWIN_QA_URL || 'http://127.0.0.1:4326'));
await page.waitForSelector('.journey[data-enhanced=true]');await page.evaluate(()=>document.fonts.ready);

await page.locator('.journey').evaluate(n=>window.scrollTo({top:n.getBoundingClientRect().top+scrollY,behavior:'instant'}));
await page.waitForTimeout(500);
const cdp=await page.context().newCDPSession(page);
const completed=new Promise(r=>cdp.once('Tracing.tracingComplete',r));
await cdp.send('Tracing.start',{categories:'devtools.timeline,blink.user_timing',transferMode:'ReturnAsStream'});
await page.evaluate(()=>{window.__craftFrames=[];window.__craftTasks=[];let last=performance.now();window.__craftRunning=true;new PerformanceObserver(list=>window.__craftTasks.push(...list.getEntries().map(e=>e.duration))).observe({type:'longtask',buffered:false});function tick(now){window.__craftFrames.push(now-last);last=now;if(window.__craftRunning)requestAnimationFrame(tick)}requestAnimationFrame(tick)});
for(const dy of [120,120,120,120,120,120,120,-120,-120,-120,-120]){await page.mouse.wheel(0,dy);await page.waitForTimeout(90)}
await page.waitForTimeout(500);
const perf=await page.evaluate(()=>{window.__craftRunning=false;const f=window.__craftFrames.slice(1).sort((a,b)=>a-b);return {frames:f.length,medianMs:f[Math.floor(f.length*.5)],p95Ms:f[Math.floor(f.length*.95)],longTasksMs:window.__craftTasks}});
await cdp.send('Tracing.end');const {stream}=await completed;let trace='';while(true){const r=await cdp.send('IO.read',{handle:stream});trace+=r.data;if(r.eof)break}await cdp.send('IO.close',{handle:stream});await writeFile('/tmp/twin-craft-performance-trace.json',trace);
for(const selector of ['.product-workspace','.composition-map','.channels-heading','.delivery-composition','.contact']){await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(1100);}
await page.setViewportSize({width:390,height:844});await page.goto((process.env.TWIN_QA_URL || 'http://127.0.0.1:4326'));await page.evaluate(()=>document.fonts.ready);
await writeFile('artifacts/craft-performance.json',JSON.stringify({environment:'Headless Chromium, cloud shared environment; one short native wheel forward/reverse pass',...perf,trace:'/tmp/twin-craft-performance-trace.json',limitation:'Not a measurement on owner hardware or Safari/iOS'},null,2)+'\n');
console.log(perf);await browser.close();
