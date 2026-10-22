export const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const t=clamp(x);return clamp(t*t*t*(t*(t*6-15)+10)); };
const map=(q: number,a: number,b: number)=>ease((q-a)/(b-a));
export const sceneTargets=[.07,.50,.93];
/** Pure function. CSS --clip-i is now the RIGHT inset, not the TOP inset. */
export function journeyFrame(progress: number) {
  const p=clamp(progress);
  const start=p<.44?.14:.56;
  const from=p<.44?0:p<.86?1:2;
  const transitioning=from<2&&p>=start&&p<start+.30;
  const q=transitioning?clamp((p-start)/.30):0;
  const to=transitioning?from+1:from;
  const text=[0,0,0],textY=[0,0,0],clip=[100,100,100],stack=[0,0,0];
  text[from]=1;clip[from]=0;
  if(transitioning){
    text[from]=1-map(q,0,.20);textY[from]=-14*map(q,0,.20);
    text[to]=map(q,.20,.50);textY[to]=18*(1-map(q,.20,.50));
    clip[to]=100*(1-map(q,.40,.96));stack[to]=1;
  }
  const title=transitioning&&q>=.20?to:from;
  const active=transitioning&&q>=.50?to:from;
  return {text,textY,clip,stack,active,title,explanation:title};
}

/** Native page scroll remains untouched. Smooth only the local scene progress. */
export function createProgressDriver(read: () => number,write: (frame: ReturnType<typeof journeyFrame>, progress: number) => void) {
  let current=clamp(read()),raf=0,last=0,disposed=false;
  const tick=(now: number)=>{
    raf=0;if(disposed||document.hidden)return;
    const target=clamp(read());
    const dt=last?Math.min(48,now-last):16.67;last=now;
    if(Math.abs(target-current)>.30)current=target;
    else current+=(target-current)*(1-Math.exp(-dt/80));
    if(Math.abs(target-current)<.00005)current=target;
    write(journeyFrame(current),current);
    if(current!==target)raf=requestAnimationFrame(tick);else last=0;
  };
  const request=()=>{if(!disposed&&!raf&&!document.hidden)raf=requestAnimationFrame(tick);};
  const snap=()=>{cancelAnimationFrame(raf);raf=0;last=0;current=clamp(read());write(journeyFrame(current),current);};
  return {request,snap,destroy(){disposed=true;cancelAnimationFrame(raf);}};
}
