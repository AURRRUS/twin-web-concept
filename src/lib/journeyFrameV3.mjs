// Pure scene state. DOM integration stays in the existing Journey component.
export const clamp = x => Math.max(0, Math.min(1, x));
const phase = (q,a,b) => { const t=clamp((q-a)/(b-a));return t*t*(3-2*t); };
export const sceneTargets = [.10,.525,.925];
export function journeyFrame(progress) {
  const p=clamp(progress),from=p<.45?0:p<.85?1:2,start=from===0?.20:.60;
  const moving=from<2&&p>=start&&p<start+.25,q=moving?clamp((p-start)/.25):0,to=moving?from+1:from;
  const titleOpacity=[0,0,0],titleY=[0,0,0],titleClip=[0,0,0],bodyOpacity=[0,0,0],bodyY=[0,0,0];
  const titleClipTop=[0,0,0],titleClipBottom=[0,0,0],bodyClipTop=[0,0,0],bodyClipBottom=[0,0,0];
  const mediaOpacity=[0,0,0],mediaScale=[1,1,1],mediaY=[0,0,0];
  titleOpacity[from]=bodyOpacity[from]=1;
  for(let i=0;i<=from;i++)mediaOpacity[i]=1;
  if(moving){
    const title=phase(q,.08,.30),body=phase(q,.32,.58),sheet=phase(q,.60,1);
    // A shared spatial boundary replaces text; readable lines never alpha-blend.
    for(const [t,opacity,top,bottom] of [[title,titleOpacity,titleClipTop,titleClipBottom],[body,bodyOpacity,bodyClipTop,bodyClipBottom]]){
      opacity[from]=t<1?1:0;opacity[to]=t>0?1:0;bottom[from]=100*t;top[to]=100*(1-t);
    }
    mediaOpacity[to]=phase(q,.60,.76);
    mediaScale[to]=1+.08*(1-sheet);mediaY[to]=-32*(1-sheet);
  }
  const active=moving&&q>=.10?to:from;
  return {titleOpacity,titleY,titleClip,titleClipTop,titleClipBottom,bodyOpacity,bodyY,bodyClipTop,bodyClipBottom,mediaOpacity,mediaScale,mediaY,
    active,title:moving&&q>=.16?to:from,explanation:moving&&q>=.44?to:from};
}
export function createProgressDriver(read,write){
  let current=clamp(read()),raf=0,last=0,disposed=false;
  const tick=now=>{
    raf=0;if(disposed||document.hidden)return;
    const target=clamp(read()),dt=last?Math.min(48,now-last):16.67;last=now;
    current+=(target-current)*(1-Math.exp(-dt/220));
    if(Math.abs(target-current)<.0001)current=target;
    write(journeyFrame(current),current);
    if(current!==target)raf=requestAnimationFrame(tick);else last=0;
  };
  const request=()=>{if(!disposed&&!raf&&!document.hidden)raf=requestAnimationFrame(tick);};
  const snap=()=>{cancelAnimationFrame(raf);raf=0;last=0;current=clamp(read());write(journeyFrame(current),current);};
  return {request,snap,destroy(){disposed=true;cancelAnimationFrame(raf);}};
}
