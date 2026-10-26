import assert from 'node:assert/strict';
export async function r2Geometry(page) {
 return page.evaluate(() => {
  const rect = e => e.getBoundingClientRect().toJSON();
  const j = document.querySelector('.story-journey'), frame = j.querySelector('.story-j4-frame');
  const c = document.querySelector('.story-channels'), layout = c.querySelector('.story-channel-layout');
  const canvas = document.querySelector('.quality-canvas'), svg = canvas.querySelector('svg');
  const matrix = svg.getScreenCTM(), points = matrix ? [[360,124],[110,557.013],[610,557.013]].map(([x,y]) => new DOMPoint(x,y).matrixTransform(matrix)) : [];
  const lengths = points.map((a,i) => Math.hypot(a.x-points[(i+1)%3].x,a.y-points[(i+1)%3].y));
  const text = [...canvas.querySelectorAll('article h3,article strong,article p')].filter(e => e.getClientRects().length).map(e => {const range=document.createRange();range.selectNodeContents(e);return {text:e.textContent,box:rect(e),ink:range.getBoundingClientRect().toJSON()}});
  return {viewport:[innerWidth,innerHeight],journey:{mode:j.dataset.mode,frame:rect(frame),header:rect(j.querySelector('.story-j4-header')),route:rect(j.querySelector('.story-route')),media:rect(j.querySelector('.story-media-stage')),sales:rect(j.querySelector('.story-j4-sales'))},channels:{mode:c.dataset.mode,layout:rect(layout),left:rect(c.querySelector('.story-channel-left')),art:rect(c.querySelector('.story-channel-art')),columns:getComputedStyle(layout).gridTemplateColumns,gap:parseFloat(getComputedStyle(layout).columnGap)},quality:{canvas:rect(canvas),model:rect(canvas.querySelector('.story-quality-model')),lengths,text},overflow:document.documentElement.scrollWidth>innerWidth};
 });
}
export function assertR2Geometry(g) {
 const {journey:j,channels:c,quality:q}=g;
 for(const r of [j.header,j.route,j.media,j.sales]){assert(Math.abs(r.left-j.frame.left)<2,'Shared left guide');assert(Math.abs(r.right-j.frame.right)<2,'Shared right guide')}
 if(j.mode==='pin'){assert(j.frame.width>=800);assert(j.frame.top>=0&&j.frame.bottom<=g.viewport[1]+1)}
 if(g.viewport[0]>=1100){const cols=c.columns.split(' ').map(parseFloat);assert(Math.abs(cols[0]/(cols[0]+cols[1])-.42)<.002);assert(Math.max(...q.lengths)/Math.min(...q.lengths)<1.01,'Equilateral rendered SVG');assert(Math.abs(q.model.width/q.canvas.width-.5278)<.002);assert(Math.abs(q.canvas.width/q.canvas.height-720/760)<.002);
  for(const t of q.text){assert(t.ink.left>=q.canvas.left-1&&t.ink.right<=q.canvas.right+1,'Facts inside proportional canvas');assert(t.ink.top>=q.canvas.top-1&&t.ink.bottom<=q.canvas.bottom-12+1,'Fact bottom reserve');const dx=Math.max(q.model.left-t.ink.right,t.ink.left-q.model.right,0),dy=Math.max(q.model.top-t.ink.bottom,t.ink.top-q.model.bottom,0);assert(Math.hypot(dx,dy)>=16,'Model/text gap >=16px')}
 }
 assert(!g.overflow);
}
