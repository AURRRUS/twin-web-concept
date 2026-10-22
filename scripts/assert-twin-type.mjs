import assert from 'node:assert/strict';
export async function assertTwinType(page){
 await page.evaluate(async()=>{for(const w of[400,600,700,900])await document.fonts.load(`${w} 24px "Twin Dewi Expanded"`,'ЦифроваяЁё');await document.fonts.ready;});
 const data=await page.evaluate(()=>{const h=document.querySelector('h1'),s=getComputedStyle(h);return{width:innerWidth,family:s.fontFamily.split(',')[0].replace(/["']/g,'').trim(),weight:s.fontWeight,size:parseFloat(s.fontSize),leading:parseFloat(s.lineHeight),tracking:parseFloat(s.letterSpacing)||0,wash:!!document.querySelector('.hero-wash'),headings:[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim()),faces:[...document.fonts].filter(f=>f.family.replace(/["']/g,'')==='Twin Dewi Expanded').map(f=>({weight:f.weight,status:f.status})),overflow:document.documentElement.scrollWidth>innerWidth+1}});
 assert.equal(data.family,'Twin Dewi Expanded');assert.equal(data.weight,'900');assert.equal(data.wash,false);assert.equal(data.overflow,false);
 for(const w of['400','600','700','900'])assert(data.faces.some(f=>f.weight===w&&f.status==='loaded'));
 assert(data.headings.every(s=>!/[.。．]$/.test(s)));
 const size=data.width>=1280?Math.max(44,Math.min(60,48+(data.width-1440)/40)):data.width>=600?40:data.width>=360?Math.max(26,Math.min(30,30+(data.width-390)*4/30)):25;
 assert(Math.abs(data.size-size)<.1);assert(Math.abs(data.leading-size*1.14)<.1);assert(Math.abs(data.tracking)<.01);
 const cdp=await page.context().newCDPSession(page);try{await cdp.send('DOM.enable');await cdp.send('CSS.enable');const{root}=await cdp.send('DOM.getDocument');const{nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'h1'});const{fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});assert(fonts.some(f=>f.isCustomFont&&f.postScriptName==='RFDewiExpanded-Black'&&f.glyphCount>0));assert(fonts.filter(f=>f.glyphCount>0).every(f=>f.isCustomFont&&f.postScriptName==='RFDewiExpanded-Black'));}finally{await cdp.detach();}return data;
}
