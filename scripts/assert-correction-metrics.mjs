import assert from 'node:assert/strict';
/** Read the browser's computed contract, including component overrides, not just root tokens. */
export async function assertCorrectionMetrics(page){
 const d=await page.evaluate(()=>{
  const style=selector=>{const n=document.querySelector(selector),s=getComputedStyle(n);return{selector,family:s.fontFamily,weight:Number(s.fontWeight),size:parseFloat(s.fontSize),leading:parseFloat(s.lineHeight),tracking:parseFloat(s.letterSpacing)||0,transform:s.transform,synthesis:s.fontSynthesis};};
  const journey=document.querySelector('.journey'),host=document.querySelector('.delivery-host'),panel=document.querySelector('.delivery-panel'),form=getComputedStyle(document.querySelector('.contact form'));
  const paragraphs=['.hero-description','.hero-channels',journey.dataset.layoutMode==='desktop'?'.scene-body-group':'.static-scene>p','.center-heading>p','.map-component p','.channels-heading>p','.channel-story p','.delivery-lead','.contact-copy>p'];
  return {viewport:{width:innerWidth,height:innerHeight},h1:style('h1'),h2:['.product h2','.center-heading h2','.channels-heading h2','.delivery-answer','.contact-copy h2',journey.dataset.layoutMode==='desktop'?'.scene-title-group h2':'.static-scene h2'].map(style),paragraphs:paragraphs.map(style),steps:{heading:style('.launch-steps h3'),body:style('.launch-steps p')},journey:{layout:journey.dataset.layoutMode,motion:journey.dataset.motionEnabled,staticVisible:!!document.querySelector('.journey-static').getClientRects().length},triangle:{active:host.dataset.enhanced==='true',host:host.getBoundingClientRect().height,panel:panel.getBoundingClientRect().height},contact:{background:getComputedStyle(document.querySelector('.contact')).backgroundColor,color:getComputedStyle(document.querySelector('.contact')).color,formBackground:form.backgroundColor,formShadow:form.boxShadow,formBorder:form.borderTopWidth}};
 });
 const bodySize=d.viewport.width>=1280?Math.min(20,Math.max(18,18+(d.viewport.width-1440)/240)):d.viewport.width>=600?18:17;
 assert.equal(d.h1.weight,700);assert.equal(d.h1.tracking,0);assert(Math.abs(d.h1.leading/d.h1.size-1.18)<.001);assert.equal(d.h1.synthesis,'none');
 for(const h of d.h2){assert(h.family.includes('Twin Dewi Expanded'),h.selector);assert.equal(h.weight,700,h.selector);assert.equal(h.tracking,0,h.selector);assert(Math.abs(h.leading/h.size-1.22)<.001,h.selector);assert.equal(h.synthesis,'none');}
 for(const p of d.paragraphs){assert(p.family.includes('Twin Inter Tight'),p.selector);assert.equal(p.weight,450,p.selector);assert(Math.abs(p.size-bodySize)<.02,p.selector);assert(Math.abs(p.leading/p.size-1.55)<.001,p.selector);assert(Math.abs(p.tracking/p.size-.01)<.001,p.selector);}
 assert(d.steps.heading.family.includes('Twin Inter Tight'));assert.equal(d.steps.heading.weight,600);assert.equal(d.steps.heading.size,20);assert.equal(d.steps.body.weight,450);assert.equal(d.steps.body.size,16);
 assert.equal(d.journey.layout,d.viewport.width>=1024?'desktop':'mobile');assert.equal(d.journey.staticVisible,d.viewport.width<1024);
 if(d.triangle.active){assert(Math.abs(d.triangle.host/d.viewport.height-4.2)<.001);assert(Math.abs(d.triangle.panel/d.viewport.height-1)<.001);}
 assert.equal(d.contact.background,'rgb(32, 39, 47)');assert.equal(d.contact.formBackground,'rgba(0, 0, 0, 0)');assert.equal(d.contact.formShadow,'none');assert.equal(d.contact.formBorder,'0px');
 return d;
}
