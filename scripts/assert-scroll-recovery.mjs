import assert from 'node:assert/strict';
import{inspectJourneyTransition}from'./assert-journey-transition.mjs';
export const scrollViewports=[[1920,1080],[1920,900],[1440,900],[1366,768],[1366,700],[1280,800],[1024,768]];
export async function seekJourney(page,p){await page.locator('.journey').evaluate((n,p)=>scrollTo({top:n.getBoundingClientRect().top+scrollY+(n.clientHeight-innerHeight)*p,behavior:'instant'}),p);await page.waitForFunction(p=>Math.abs(Number(document.querySelector('.journey').style.getPropertyValue('--scene-progress'))-p)<.001,p);}
export async function assertJourneyScroll(page){
 await page.waitForFunction(()=>document.querySelector('.journey').dataset.motionEnabled==='true');
 const host=page.locator('.journey');await seekJourney(page,.1);await page.waitForTimeout(1700);
 const geometry=await page.locator('.journey-cinematic').evaluate(n=>{const panel=n.getBoundingClientRect(),get=q=>{const r=n.querySelector(q).getBoundingClientRect();return{x:r.x,y:r.y-panel.y,width:r.width,height:r.height,bottom:r.bottom-panel.y};};return{width:innerWidth,height:innerHeight,panel:panel.height,position:getComputedStyle(n).position,needed:n.parentElement.dataset.neededHeight,media:get('.scene-materials'),caption:get('.scene-caption'),navigation:get('.scene-navigation'),text:get('.scene-text-zone'),buttons:[...n.querySelectorAll('.scene-navigation button')].map(b=>({height:b.clientHeight,scroll:b.scrollHeight})),fit:getComputedStyle(n.querySelector('.scene-material img')).objectFit};});
 assert.equal(geometry.position,'sticky');assert.equal(geometry.panel,geometry.height);assert(Math.abs(geometry.media.width/geometry.media.height-16/9)<.01);assert.equal(geometry.fit,'contain');for(const k of['media','caption','navigation','text']){assert(geometry[k].y>=-1,k);assert(geometry[k].bottom<=geometry.height+1,k+' must fit viewport');}assert(geometry.buttons.every(b=>b.scroll<=b.height+1),'Navigation text must fit its buttons');
 const cycle=await host.getAttribute('data-entry-cycle');
 for(const[p,id]of[[.30,'space'],[.525,'space'],[.925,'lot'],[.525,'space'],[.1,'project']]){await seekJourney(page,p);assert.equal(await host.getAttribute('data-scene'),id);await inspectJourneyTransition(page);assert.equal(await host.getAttribute('data-entry-cycle'),cycle);}
 await host.evaluate(n=>scrollTo({top:n.getBoundingClientRect().bottom+scrollY+80,behavior:'instant'}));await page.waitForFunction(()=>document.querySelector('.journey').dataset.entryArmed==='true');await seekJourney(page,.925);assert.equal(await host.getAttribute('data-scene'),'lot');assert.equal(Number(await host.getAttribute('data-entry-cycle')),Number(cycle)+1);
 for(const[i,p,id]of[[0,.10,'project'],[1,.525,'space'],[2,.925,'lot']]){await page.locator('.scene-navigation button').nth(i).click();await page.waitForFunction(p=>Math.abs(Number(document.querySelector('.journey').style.getPropertyValue('--scene-progress'))-p)<.001,p);assert.equal(await host.getAttribute('data-scene'),id);}
 return geometry;
}
export async function assertTriangleScroll(page){
 const host=page.locator('.delivery-host');await page.waitForFunction(()=>document.querySelector('.delivery-host').dataset.motionType==='scroll-once');
 const geometry=await host.boundingBox();assert.equal(await page.locator('.delivery-panel').evaluate(n=>getComputedStyle(n).position),'static');
 const snapshot=()=>host.evaluate(n=>({progress:Number(n.dataset.progress),state:n.dataset.motionState,word:n.dataset.word,values:Object.fromEntries(['lead','answer','qualities','model','time','budget','proof'].map(k=>[k,Number(n.style.getPropertyValue('--delivery-'+k))])),insert:Number(n.style.getPropertyValue('--iv-reveal'))}));
 const samples=[];for(const f of[.86,.80,.60,.40,.14,.60,.85]){await host.evaluate((n,f)=>scrollTo({top:n.getBoundingClientRect().top+scrollY-innerHeight*f,behavior:'instant'}),f);await page.waitForTimeout(80);samples.push(await snapshot());}
 for(let i=1;i<samples.length;i++){assert(samples[i].progress>=samples[i-1].progress);for(const key of Object.keys(samples[i].values))assert(samples[i].values[key]>=samples[i-1].values[key]);assert(samples[i].insert>=samples[i-1].insert);}
 // Native tall layouts reveal their lower facts only when those groups reach the viewport.
 await page.locator('.delivery-quality').evaluate(n=>scrollTo({top:n.getBoundingClientRect().top+scrollY-innerHeight*.14,behavior:'instant'}));await page.waitForTimeout(80);const final=await snapshot();assert.equal(final.state,'complete');assert.equal(final.word,'Эффективно');assert(Object.values(final.values).every(v=>v===1));assert.equal((await host.boundingBox()).height,geometry.height);
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await host.evaluate(n=>scrollTo({top:n.getBoundingClientRect().top+scrollY-innerHeight*.85,behavior:'instant'}));await page.waitForTimeout(80);assert.deepEqual(await snapshot(),final);
 return{geometry,samples,final};
}
export async function assertLaunchAnchor(page){
 const mobile=page.viewportSize().width<=950;
 if(mobile){const menu=page.locator('.mobile-navigation');if(!await menu.evaluate(n=>n.open))await menu.locator('summary').click();}
 const nav=page.getByRole('navigation',{name:mobile?'Мобильная навигация':'Основная навигация'});await nav.getByRole('link',{name:'Запуск',exact:true}).click();await page.waitForURL('**/#launch');
 await page.waitForFunction(()=>{const n=document.getElementById('launch'),expected=parseFloat(getComputedStyle(n).scrollMarginTop)+parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);return Math.abs(n.getBoundingClientRect().top-expected)<2;});
 return page.locator('#launch').evaluate(n=>({url:location.href,top:n.getBoundingClientRect().top,first:n.querySelector('li').getBoundingClientRect().toJSON()}));
}
