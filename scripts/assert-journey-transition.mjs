import assert from 'node:assert/strict';
/** Inspect actual clipped bands, not just opacity: there must be no overlapping readable copies. */
export async function inspectJourneyTransition(page){
 const d=await page.evaluate(()=>{
  const host=document.querySelector('.journey');
  const bands=q=>[...document.querySelectorAll(q)].map(n=>{const s=getComputedStyle(n),r=n.getBoundingClientRect(),tokens=(s.clipPath.match(/inset\(([^)]+)\)/)?.[1]||'0').split(/\s+/),px=t=>t?.endsWith('%')?parseFloat(t)*r.height/100:parseFloat(t||'0');const top=px(tokens[0]),bottom=px(tokens.length>2?tokens[2]:tokens[0]);return{opacity:Number(s.opacity),clip:s.clipPath,z:s.zIndex,top:r.top+top,bottom:r.bottom-bottom,height:r.height,visible:Number(s.opacity)>.01?Math.max(0,r.height-top-bottom):0};});
  return{progress:Number(host.style.getPropertyValue('--scene-progress')),title:bands('.scene-title-group'),body:bands('.scene-body-group'),media:bands('.scene-material'),parents:['.scene-title-slot','.scene-body-slot'].map(q=>Number(getComputedStyle(document.querySelector(q)).opacity))};
 });
 for(const key of['title','body']){const visible=d[key].filter(n=>n.visible>.1).sort((a,b)=>a.top-b.top);assert(visible.length>0,key+' must remain visible');for(let i=1;i<visible.length;i++)assert(visible[i-1].bottom<=visible[i].top+1,key+' readable masks must not overlap');assert(Math.abs(d[key].reduce((sum,n)=>sum+n.visible,0)-d[key][0].height)<1,key+' masks cover the slot');assert(d[key].every(n=>n.opacity===0||n.opacity===1),key+' must not crossfade full-size copies');}
 assert(d.parents.every(n=>n===1));assert.equal(d.media[0].opacity,1);assert.deepEqual(d.media.map(n=>n.z),['1','2','3']);return d;
}
