import { useEffect, type RefObject } from 'react';
import { deliveryFrame } from './deliveryMotion';
export function useDeliveryMotion(host:RefObject<HTMLDivElement|null>){
 useEffect(()=>{
  const node=host.current!,panel=node.querySelector<HTMLElement>('.delivery-panel')!,composition=node.querySelector<HTMLElement>('.delivery-composition')!;
  const desktop=matchMedia('(min-width:1280px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let disposed=false,ready=false,enabled=false,raf=0,lastLabel='';
  const labels=[...node.querySelectorAll<HTMLElement>('[data-word-label],[data-proof-label]')];
  const render=()=>{
   raf=0;if(disposed||document.hidden||!enabled)return;
   const p=Math.max(0,Math.min(1,-node.getBoundingClientRect().top/Math.max(1,node.offsetHeight-panel.offsetHeight))),f=deliveryFrame(p);
   f.edges.forEach((v,i)=>node.style.setProperty(`--delivery-edge-${i}`,String(v)));
   for(const key of ['lead','answer','qualities','model','facts','proof'] as const)node.style.setProperty(`--delivery-${key}`,String(f[key]));
   node.style.setProperty('--iv-reveal',String(f.insert));node.dataset.progress=p.toFixed(4);node.dataset.word=f.label;
   if(f.label!==lastLabel){labels.forEach(label=>label.textContent=f.label);lastLabel=f.label;}
  };
  const request=()=>{if(enabled&&!document.hidden&&!raf)raf=requestAnimationFrame(render);};
  const configure=()=>{
   if(disposed||!ready)return;cancelAnimationFrame(raf);raf=0;node.dataset.enhanced='false';
   let fits=desktop.matches&&innerHeight>=760&&!reduced.matches;
   if(fits){const box=composition.getBoundingClientRect();const needed=Math.max(composition.scrollHeight,...[...composition.querySelectorAll<HTMLElement>('.delivery-stage>div')].map(e=>e.getBoundingClientRect().bottom-box.top));fits=needed+32<=innerHeight;}
   enabled=fits;node.dataset.enhanced=String(fits);
   if(fits)render();else {node.removeAttribute('style');delete node.dataset.progress;delete node.dataset.word;labels.forEach(l=>l.textContent='Эффективно');lastLabel='';}
  };
  const visibility=()=>{cancelAnimationFrame(raf);raf=0;if(!document.hidden)render();};
  void Promise.all([400,600,700].map(w=>document.fonts.load(`${w} 24px "Twin Dewi Expanded"`,'Эффективно'))).then(()=>document.fonts.ready).then(()=>{ready=true;configure();});
  const focus=()=>{for(const key of ['lead','answer','qualities','model','facts','proof'])node.style.setProperty(`--delivery-${key}`,'1');};
  desktop.addEventListener('change',configure);reduced.addEventListener('change',configure);window.addEventListener('resize',configure);window.addEventListener('scroll',request,{passive:true});document.addEventListener('visibilitychange',visibility);node.addEventListener('focusin',focus);
  return()=>{disposed=true;cancelAnimationFrame(raf);desktop.removeEventListener('change',configure);reduced.removeEventListener('change',configure);window.removeEventListener('resize',configure);window.removeEventListener('scroll',request);document.removeEventListener('visibilitychange',visibility);node.removeEventListener('focusin',focus);};
 },[host]);
}
