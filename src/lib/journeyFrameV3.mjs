// FINAL R2: four readable stops and three scroll-controlled masked cascades.
export const clamp=x=>Math.max(0,Math.min(1,x));
export const smoothstep=x=>{const t=clamp(x);return t*t*(3-2*t);};
const phase=(q,a,b)=>smoothstep((q-a)/(b-a));
export const journeyTravel=373;
const hold=42,first=56,transition=(journeyTravel-first-3*hold)/3;
export const journeyStops=Array.from({length:4},(_,i)=>{const a=i===0?0:first+i*transition+(i-1)*hold,b=a+(i===0?first:hold);return[a/journeyTravel,b/journeyTravel];});
export const sceneTargets=journeyStops.map(([a,b])=>(a+b)/2);
export function journeyFrame(progress){
 const p=clamp(progress),n=4;
 let from=3,to=3,q=0,moving=false;
 for(let i=0;i<3;i++){const start=journeyStops[i][1],end=journeyStops[i+1][0];if(p<start){from=to=i;break;}if(p<end){from=i;to=i+1;q=(p-start)/(end-start);moving=true;break;}}
 const arr=()=>Array(n).fill(0),titleOpacity=arr(),titleY=arr(),titleClip=arr(),titleClipTop=arr(),titleClipBottom=arr(),bodyOpacity=arr(),bodyY=arr(),bodyClipTop=arr(),bodyClipBottom=arr(),mediaOpacity=arr(),mediaScale=Array(n).fill(1),mediaY=arr(),mediaClipBottom=arr();
 titleOpacity[from]=bodyOpacity[from]=1;for(let i=0;i<=from;i++)mediaOpacity[i]=1;
 if(moving){
  const out=phase(q,0,.20),title=phase(q,.15,.40),body=phase(q,.30,.55),sheet=phase(q,.45,1);
  titleOpacity[from]=bodyOpacity[from]=out<1?1:0;titleClipBottom[from]=bodyClipBottom[from]=100*out;
  titleOpacity[to]=title>0?1:0;titleClipTop[to]=100*(1-title);bodyOpacity[to]=body>0?1:0;bodyClipTop[to]=100*(1-body);
  mediaOpacity[to]=sheet>0?1:0;mediaClipBottom[to]=100*(1-sheet);mediaScale[to]=1+.07*(1-sheet);mediaY[to]=-32*(1-sheet);
 }
 return{titleOpacity,titleY,titleClip,titleClipTop,titleClipBottom,bodyOpacity,bodyY,bodyClipTop,bodyClipBottom,mediaOpacity,mediaScale,mediaY,mediaClipBottom,active:moving&&q>=.6?to:from,title:moving&&q>=.275?to:from,explanation:moving&&q>=.425?to:from};
}
export function createProgressDriver(read,write){
 let current=clamp(read()),raf=0,last=0,disposed=false;
 const tick=now=>{raf=0;if(disposed||document.hidden)return;const target=clamp(read()),dt=last?Math.min(48,now-last):16.67;last=now;current+=(target-current)*(1-Math.exp(-dt/220));if(Math.abs(target-current)<.0001)current=target;write(journeyFrame(current),current);if(current!==target)raf=requestAnimationFrame(tick);else last=0;};
 const request=()=>{if(!disposed&&!raf&&!document.hidden)raf=requestAnimationFrame(tick);};
 const snap=()=>{cancelAnimationFrame(raf);raf=0;last=0;current=clamp(read());write(journeyFrame(current),current);};
 return{request,snap,destroy(){disposed=true;cancelAnimationFrame(raf);}};
}
