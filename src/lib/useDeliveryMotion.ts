import { useEffect, type RefObject } from 'react';
import { deliveryFrame } from './deliveryMotion';
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const phase=(v:number,a=0,b=1)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
/** Native scroll reveals only advance. Small screens also gate each lower group locally. */
export function useDeliveryMotion(host:RefObject<HTMLDivElement|null>){
 useEffect(()=>{
  const node=host.current!,reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let disposed=false,raf=0,ready=false,progress=0,lastLabel='',lastY=scrollY,initialized=false;
  const values:Record<string,number>={};
  const labels=[...node.querySelectorAll<HTMLElement>('[data-word-label],[data-proof-label]')];
  const local=(selector:string,end=.15)=>{const y=node.querySelector(selector)!.getBoundingClientRect().top;return clamp((innerHeight*.55-y)/(innerHeight*(.55-end)));};
  const write=(next:ReturnType<typeof deliveryFrame>&{time:number;budget:number})=>{
   const advance=(key:string,v:number)=>{const value=Math.max(values[key]||0,v);values[key]=value;node.style.setProperty(key,String(value));return value;};
   next.edges.forEach((v,i)=>advance(`--delivery-edge-${i}`,v));
   for(const key of ['lead','answer','qualities','model','time','budget','proof'] as const)advance(`--delivery-${key}`,next[key]);
   const insert=advance('--iv-reveal',next.insert),label=insert<.5?'Эффектно':'Эффективно';
   node.dataset.progress=progress.toFixed(4);node.dataset.word=label;
   node.dataset.motionState=Object.values(values).every(v=>v>=1)?'complete':Object.values(values).some(v=>v>0)?'playing':'armed';
   if(label!==lastLabel){labels.forEach(n=>n.textContent=label);lastLabel=label;}
  };
  const settle=()=>{progress=1;write({...deliveryFrame(1),time:1,budget:1});};
  const update=()=>{
   raf=0;if(disposed||!ready||document.hidden)return;
   if(reduced.matches){node.dataset.enhanced='false';settle();return;}
   // Wait for the preceding track to have its final geometry; fallback stays readable.
   if(document.querySelector('.channels[data-enhanced="pending"],.channels[data-measuring]'))return;
   node.dataset.enhanced='true';
   const moved=Math.abs(scrollY-lastY)>.5;lastY=scrollY;
   if(initialized&&!moved)return;initialized=true;
   progress=Math.max(progress,clamp((innerHeight*.55-node.querySelector('.delivery-composition')!.getBoundingClientRect().top)/(innerHeight*.40)));
   const f=deliveryFrame(progress),tall=innerWidth<1024;
   if(tall){
    const triangle=local('.delivery-triangle'),proof=phase(local('.delivery-quality',.40));
    write({...f,lead:phase(local('.delivery-lead',.30)),answer:phase(local('.delivery-answer',.30)),qualities:phase(local('.delivery-qualities',.30)),edges:[phase(triangle,0,.2),phase(triangle,.2,.4),phase(triangle,.4,.6)],model:phase(triangle,.55,.85),time:phase(local('.delivery-time',.40)),budget:phase(local('.delivery-budget',.40)),proof,insert:phase(local('.delivery-quality',.40),.6,1)});
   }else write({...f,time:f.facts,budget:f.facts});
  };
  const request=()=>{if(!disposed&&ready&&!raf&&!document.hidden)raf=requestAnimationFrame(update);};
  const visibility=()=>{cancelAnimationFrame(raf);raf=0;if(!document.hidden)request();};
  const resize=()=>{lastY=scrollY;request();};
  const geometry=new ResizeObserver(()=>{lastY=scrollY;if(!initialized)request();});geometry.observe(document.body);
  const focus=(event:FocusEvent)=>{const target=event.target as HTMLElement;if(target.closest('.delivery-quality'))node.querySelector<HTMLElement>('.delivery-quality')!.style.setProperty('--delivery-focus','1');};
  const blur=(event:FocusEvent)=>{const quality=node.querySelector<HTMLElement>('.delivery-quality')!;if(!quality.contains(event.relatedTarget as Node|null))quality.style.removeProperty('--delivery-focus');};
  void document.fonts.ready.then(()=>{if(disposed)return;ready=true;node.dataset.motionType='scroll-once';write({...deliveryFrame(0),time:0,budget:0});update();});
  window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',resize);reduced.addEventListener('change',request);document.addEventListener('visibilitychange',visibility);node.addEventListener('focusin',focus);node.addEventListener('focusout',blur);
  return()=>{disposed=true;geometry.disconnect();cancelAnimationFrame(raf);window.removeEventListener('scroll',request);window.removeEventListener('resize',resize);reduced.removeEventListener('change',request);document.removeEventListener('visibilitychange',visibility);node.removeEventListener('focusin',focus);node.removeEventListener('focusout',blur);};
 },[host]);
}
