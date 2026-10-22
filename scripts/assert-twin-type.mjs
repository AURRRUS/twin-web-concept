// Integrate in the existing Playwright QA; no screenshots or approval stage.
import assert from 'node:assert/strict';
export async function assertTwinType(page) {
  await page.evaluate(async () => {
    for (const weight of [400,600,700]) await document.fonts.load(`${weight} 24px "RF Dewi Expanded"`, 'ЦифроваяЁё');
    await document.fonts.ready;
  });
  const data=await page.evaluate(() => {
    const h1=document.querySelector('h1'); const s=getComputedStyle(h1);
    return {width:innerWidth,family:s.fontFamily.split(',')[0].replace(/["']/g,'').trim(),weight:s.fontWeight,size:parseFloat(s.fontSize),leading:parseFloat(s.lineHeight),wash:!!document.querySelector('.hero-wash'),headings:[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim()),faces:[...document.fonts].filter(f=>f.family.replace(/["']/g,'')==='RF Dewi Expanded').map(f=>({weight:f.weight,status:f.status})),overflow:document.documentElement.scrollWidth>innerWidth+1};
  });
  assert.equal(data.family,'RF Dewi Expanded'); assert.equal(data.weight,'400'); assert.equal(data.wash,false); assert.equal(data.overflow,false);
  for(const weight of ['400','600','700']) assert(data.faces.some(f=>f.weight===weight&&f.status==='loaded'),`Font ${weight} missing`);
  assert(data.headings.every(s=>!/[.。．]$/.test(s)),'Heading has terminal full stop');
  const expected=data.width>=1600?[56,66]:data.width>=1400?[48,56]:data.width>=1280?[44,52]:data.width>=1100?[40,48]:data.width>=600?[36,44]:data.width>=360?[28,34]:[24,30];
  assert(Math.abs(data.size-expected[0])<.1);assert(Math.abs(data.leading-expected[1])<.1);
  // Check the physical rendered custom font in Chromium, not just the CSS alias.
  const cdp=await page.context().newCDPSession(page);
  try {await cdp.send('DOM.enable');await cdp.send('CSS.enable');const {root}=await cdp.send('DOM.getDocument');const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'h1'});const {fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});assert(fonts.some(f=>f.isCustomFont&&/^RF Dewi Expanded/.test(f.familyName)&&f.glyphCount>0),'Expanded is not the rendered H1 font');assert(fonts.filter(f=>f.glyphCount>0).every(f=>f.isCustomFont&&/^RF Dewi Expanded/.test(f.familyName)),'H1 uses fallback glyphs');} finally {await cdp.detach();}
  return data;
}
