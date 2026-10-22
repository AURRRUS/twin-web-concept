export const clamp = (x: number) => Math.max(0, Math.min(1, x));
const phase = (p: number, a: number, b: number) => { const t = clamp((p - a) / (b - a)); return t * t * (3 - 2 * t); };
export const sceneTargets = [.10, .525, .925];

/** Absolute, reversible choreography; media rank remains project -> space -> lot. */
export function journeyFrame(progress: number) {
  const p = clamp(progress);
  const from = p < .45 ? 0 : p < .85 ? 1 : 2;
  const start = from === 0 ? .20 : .60;
  const transitioning = from < 2 && p >= start && p < start + .25;
  const q = transitioning ? clamp((p - start) / .25) : 0;
  const to = transitioning ? from + 1 : from;
  const titleOpacity = [0,0,0], titleY = [0,0,0], titleClip = [0,0,0];
  const bodyOpacity = [0,0,0], bodyY = [0,0,0];
  const mediaOpacity = [0,0,0], mediaScale = [1,1,1], mediaY = [0,0,0];
  titleOpacity[from] = 1; bodyOpacity[from] = 1;
  for(let i=0;i<=from;i++) mediaOpacity[i] = 1;
  if(transitioning) {
    const out = phase(q,0,.12), enter = phase(q,.12,.40), body = phase(q,.32,.62), sheet = phase(q,.48,1);
    titleOpacity[from] = bodyOpacity[from] = 1-out;
    titleY[from] = bodyY[from] = -8*out;
    titleOpacity[to] = enter; titleY[to] = 18*(1-enter); titleClip[to] = 100*(1-enter);
    bodyOpacity[to] = body; bodyY[to] = 12*(1-body);
    mediaOpacity[to] = phase(q,.48,.62); mediaScale[to] = 1 + .08*(1-sheet); mediaY[to] = -48*(1-sheet);
  }
  const active = transitioning && q >= .16 ? to : from;
  return {titleOpacity,titleY,titleClip,bodyOpacity,bodyY,mediaOpacity,mediaScale,mediaY,active,title:transitioning&&q>=.12?to:from,explanation:transitioning&&q>=.32?to:from};
}

/** One local driver; native scrollTop is untouched. */
export function createProgressDriver(read: () => number, write: (frame: ReturnType<typeof journeyFrame>, progress: number) => void) {
  let current = clamp(read()), raf = 0, last = 0, disposed = false;
  const tick = (now: number) => {
    raf=0; if(disposed||document.hidden)return;
    const target=clamp(read()), dt=last?Math.min(48,now-last):16.67; last=now;
    current=Math.abs(target-current)>.30?target:current+(target-current)*(1-Math.exp(-dt/60));
    if(Math.abs(target-current)<.0001)current=target;
    write(journeyFrame(current),current);
    if(current!==target)raf=requestAnimationFrame(tick); else last=0;
  };
  const request=()=>{if(!disposed&&!raf&&!document.hidden)raf=requestAnimationFrame(tick);};
  const snap=()=>{cancelAnimationFrame(raf);raf=0;last=0;current=clamp(read());write(journeyFrame(current),current);};
  return {request,snap,destroy(){disposed=true;cancelAnimationFrame(raf);}};
}
