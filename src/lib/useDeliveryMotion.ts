import { useEffect, type RefObject } from 'react';
import { deliveryFrame, deliveryDuration } from './deliveryMotion';
export function useDeliveryMotion(host:RefObject<HTMLDivElement|null>){
 useEffect(()=>{
  const node=host.current!,reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let disposed=false,raf=0,started=0,hasStarted=false,complete=false,lastLabel='';
  let observer:IntersectionObserver|undefined;
  const labels=[...node.querySelectorAll<HTMLElement>('[data-word-label],[data-proof-label]')];
  const write=(p:number)=>{
   const f=deliveryFrame(p);f.edges.forEach((v,i)=>node.style.setProperty(`--delivery-edge-${i}`,String(v)));
   for(const key of ['lead','answer','qualities','model','facts','proof'] as const)node.style.setProperty(`--delivery-${key}`,String(f[key]));
   node.style.setProperty('--iv-reveal',String(f.insert));node.dataset.progress=p.toFixed(4);node.dataset.word=f.label;
   if(f.label!==lastLabel){labels.forEach(n=>n.textContent=f.label);lastLabel=f.label;}
  };
  const settle=()=>{cancelAnimationFrame(raf);raf=0;complete=true;observer?.disconnect();write(1);node.dataset.motionState='complete';};
  const tick=(now:number)=>{raf=0;if(disposed||document.hidden||complete)return;const p=Math.min(1,(now-started)/deliveryDuration);write(p);if(p<1)raf=requestAnimationFrame(tick);else settle();};
  const start=()=>{if(disposed||hasStarted||complete)return;hasStarted=true;started=performance.now();node.dataset.motionState='playing';observer?.disconnect();raf=requestAnimationFrame(tick);};
  const configure=()=>{
   if(disposed)return;
   node.dataset.motionType='once';
   if(reduced.matches){node.dataset.enhanced='false';settle();return;}
   if(complete)return;
   // A restored/deep-linked visible section is immediately readable; never hide it after paint.
   const r=node.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0||r.bottom<=0){node.dataset.enhanced='false';settle();return;}
   node.dataset.enhanced='true';node.dataset.motionState='armed';write(0);
   observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))start();},{rootMargin:'0px 0px -15% 0px'});observer.observe(node);
  };
  const visibility=()=>{cancelAnimationFrame(raf);raf=0;if(!document.hidden&&hasStarted&&!complete)raf=requestAnimationFrame(tick);};
  const motionChange=()=>{if(reduced.matches){node.dataset.enhanced='false';settle();}};
  const focus=()=>{if(!complete)settle();};
  void Promise.all([400,600,700,900].map(w=>document.fonts.load(`${w} 24px "Twin Dewi Expanded"`,'Эффективно'))).then(()=>document.fonts.ready).then(configure);
  reduced.addEventListener('change',motionChange);document.addEventListener('visibilitychange',visibility);node.addEventListener('focusin',focus);
  return()=>{disposed=true;cancelAnimationFrame(raf);observer?.disconnect();reduced.removeEventListener('change',motionChange);document.removeEventListener('visibilitychange',visibility);node.removeEventListener('focusin',focus);};
 },[host]);
}
