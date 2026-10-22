import assert from 'node:assert/strict';
export async function inspectJourneyTransition(page){
 const d=await page.evaluate(()=>{
  const host=document.querySelector('.journey'),slot=getComputedStyle(document.querySelector('.scene-title-slot')),bodySlot=getComputedStyle(document.querySelector('.scene-body-slot'));
  const styles=q=>[...document.querySelectorAll(q)].map(e=>{const s=getComputedStyle(e);return{opacity:Number(s.opacity),clip:s.clipPath,transform:s.transform,z:s.zIndex};});
  return{progress:Number(host.style.getPropertyValue('--scene-progress')),title:styles('.scene-title-group'),body:styles('.scene-body-group'),media:styles('.scene-material'),titleParent:{opacity:Number(slot.opacity),clip:slot.clipPath},bodyParent:{opacity:Number(bodySlot.opacity),clip:bodySlot.clipPath}};
 });
 assert(Math.abs(d.title.reduce((s,n)=>s+n.opacity,0)-1)<.002,'Complementary title opacity');assert(Math.abs(d.body.reduce((s,n)=>s+n.opacity,0)-1)<.002,'Complementary body opacity');
 assert.equal(d.titleParent.opacity,1);assert.equal(d.bodyParent.opacity,1);assert(['none','inset(0px 0px 0%)'].includes(d.titleParent.clip));assert.equal(d.bodyParent.clip,'none');
 assert(d.title.every(n=>n.clip==='none'));assert.equal(d.media[0].opacity,1);assert.deepEqual(d.media.map(n=>n.z),['1','2','3']);
 return d;
}
