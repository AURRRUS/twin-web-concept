import assert from 'node:assert/strict';
export async function inspectDescriptions(page){
 const result=await page.locator('.scene-body-group').evaluateAll(nodes=>nodes.map(n=>({text:n.textContent,style:{size:parseFloat(getComputedStyle(n).fontSize),weight:getComputedStyle(n).fontWeight,leading:parseFloat(getComputedStyle(n).lineHeight),tracking:parseFloat(getComputedStyle(n).letterSpacing)},height:n.getBoundingClientRect().height,lines:[...n.querySelectorAll('.scene-body-line')].map(s=>{const r=document.createRange();r.selectNodeContents(s);return{height:r.getBoundingClientRect().height,rects:r.getClientRects().length};})})));
 for(const n of result){assert.equal(n.style.weight,'450');assert.equal(n.style.size,18);assert(Math.abs(n.style.leading-27.9)<.1);assert(Math.abs(n.height-55.8)<1);assert.equal(n.lines.length,2);for(const line of n.lines)assert.equal(line.rects,1,'Each semantic span must occupy exactly one desktop line');}
 return result;
}
export async function inspectComposition(page){
 const d=await page.locator('.composition').evaluate(section=>{const heading=section.querySelector('.center-heading').getBoundingClientRect(),map=section.querySelector('.composition-map').getBoundingClientRect(),cards=[...section.querySelectorAll('.map-component')].map(n=>{const r=n.getBoundingClientRect();return{x:r.x,y:r.y,bottom:r.bottom,right:r.right,height:r.height,width:r.width,overflow:n.scrollHeight>n.clientHeight+1};});return{viewport:{width:innerWidth,height:innerHeight},heading:heading.toJSON(),map:map.toJSON(),primaryHeight:map.bottom-heading.top,cards,paths:[...section.querySelectorAll('.composition-lines path')].map(n=>n.getAttribute('d')),core:section.querySelector('.map-core').getBoundingClientRect().toJSON()};});
 if(d.viewport.width>=1024&&d.viewport.height>=800){assert(d.primaryHeight<=d.viewport.height-64,'Heading and all six components must fit with 32px margins');assert(d.cards.every(n=>!n.overflow));for(const n of d.cards){assert(n.y>=d.map.y-1);assert(n.bottom<=d.map.bottom+1);}for(let i=0;i<6;i++)for(let j=i+1;j<6;j++){const a=d.cards[i],b=d.cards[j];assert(a.right<=b.x+1||b.right<=a.x+1||a.bottom<=b.y+1||b.bottom<=a.y+1,'Component cards must not overlap');}}
 assert.equal(d.paths.length,6);assert(d.paths.every(d=>d?.startsWith('M')));return d;
}
export async function inspectOrphans(page){
 return page.evaluate(()=>{
  const short=new Set(['и','а','в','во','к','ко','с','со','о','об','на','по','из','от','до','за','для','без','при','через']),result=[],walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while(n=walker.nextNode()){
   if(!n.parentElement?.getClientRects().length||n.parentElement.closest('script,style,noscript,textarea,input,select,svg,code,pre'))continue;
   for(const m of n.data.matchAll(/([\p{L}]+)([ \t]+)([\p{L}\p{N}]+)/gu))if(short.has(m[1].toLowerCase())){const a=document.createRange(),b=document.createRange();a.setStart(n,m.index);a.setEnd(n,m.index+m[1].length);b.setStart(n,m.index+m[1].length+m[2].length);b.setEnd(n,m.index+m[0].length);const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();if(ar.width&&br.width&&Math.abs(ar.top-br.top)>2)result.push({word:m[1],next:m[3],text:n.data.slice(0,150)});}
  }return result;
 });
}
