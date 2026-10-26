import {useEffect,useRef,useState, type KeyboardEvent} from 'react';
import copy from '../../.twin/tasks/JRN-001/content.json';
import tokens from '../../.twin/tokens.json';
import {bindShortWords as t} from '../lib/text';
import {storyOriginal} from '../lib/salesStoryMedia';
import {journeyFrame,journeyStops,transitionFrame,phase,scrollProgress} from '../lib/journeyAccordionFrame.mjs';
import '../../.twin/generated/tokens.css';
import '../styles/journeyAccordion.css';

const scenes=copy.scenes;
function SceneIcon({index}:{index:number}){
 const paths=['M12 21s7-6.1 7-12a7 7 0 0 0-14 0c0 5.9 7 12 7 12ZM12 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z','M3 21V8l7-4v17M10 21V3l10 4v14M6 10v2m0 3v2m8-9v2m3-1v2m-3 2v2m3-1v2M1 21h22','M3 3h18v18H3ZM3 10h8V3m0 7v11m0-8h10m-5 0v8','M3 20V4h18v16M3 15l6-5 5 4 7-6M9 10v10m5-6v6M1 20h22'];
 return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[index]}/></svg>;
}
function Picture({index}:{index:number}){
 const [error,setError]=useState(false);const [attempt,setAttempt]=useState(0);
 return <div className="tj-picture">
  {!error?<img src={storyOriginal(scenes[index].imageId)+(attempt?`?retry=${attempt}`:'')} width={index===0||index===3?1671:1672} height={941} alt={`${scenes[index].label} — демонстрационный интерфейс Twin`} loading="lazy" decoding="async" onError={()=>setError(true)}/>:<div className="tj-image-error" role="status"><p data-type="support">Не удалось загрузить изображение</p><button data-type="button" type="button" onClick={()=>{setAttempt(attempt+1);setError(false)}}>Повторить</button></div>}
 </div>;
}

/** Main Journey only. Legacy JourneyV4 and the compare gallery remain unchanged. */
export function JourneyAccordion(){
 const root=useRef<HTMLElement>(null);const pick=useRef<(index:number,instant?:boolean)=>void>(()=>{});
 const [active,setActive]=useState(0);const [enhanced,setEnhanced]=useState(false);
 useEffect(()=>{
  const host=root.current!;const panel=host.querySelector<HTMLElement>('.tj-panel')!;
  const frame=host.querySelector<HTMLElement>('.tj-frame')!;const heading=host.querySelector<HTMLElement>('.tj-headings')!;
  const rows=[...host.querySelectorAll<HTMLElement>('.tj-row')];
  const titles=[...host.querySelectorAll<HTMLElement>('.tj-headline')];
  const photos=[...host.querySelectorAll<HTMLElement>('.tj-photo')];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let disposed=false,pinned=false,visible=false,ready=false,raf=0,layoutRaf=0,current=0,top=0,travel=1;
  let sizes=rows.map(()=>({closed:0,open:0,body:0}));
  let manual:null|{from:number;to:number;start:number;scroll:number}=null;
  let entered=false,entryStart=0;
  const boxHeight=(e:HTMLElement)=>e.getBoundingClientRect().height;
  function render(f:ReturnType<typeof transitionFrame>){
   const same=f.from===f.to;
   rows.forEach((row,i)=>{
    const w=f.weights[i],s=sizes[i];row.style.setProperty('--tj-weight',String(w));
    row.style.setProperty('--tj-header-height',`${s.closed+(s.open-s.closed)*w}px`);
    row.style.setProperty('--tj-body-height',`${s.body*w}px`);
    row.style.setProperty('--tj-closed-opacity',String(1-phase(w,0,.25)));
    row.style.setProperty('--tj-open-opacity',String(phase(w,.45,1)));
    row.style.setProperty('--tj-copy-opacity',String(same&&i===f.to?1:i===f.from?f.oldText:i===f.to?f.newText:0));
    row.style.setProperty('--tj-copy-y',`${(1-(same&&i===f.to?1:i===f.from?f.oldText:f.newText))*8}px`);
   });
   titles.forEach((title,i)=>{
    const opacity=same?(i===f.to?1:0):i===f.from?f.oldText:i===f.to?f.newTitle:0;
    title.style.opacity=String(opacity);title.style.visibility=opacity>.001?'visible':'hidden';
    title.style.transform=`translateY(${i===f.to?(1-f.newTitle)*14:-(1-f.oldText)*12}px)`;
   });
   photos.forEach((photo,i)=>{
    const isNew=i===f.to,isOld=!same&&i===f.from;photo.style.visibility=isNew||isOld?'visible':'hidden';
    photo.style.zIndex=isNew?'2':isOld?'1':'0';
    photo.style.clipPath=isNew&&!same?`inset(0 0 ${(1-f.image)*100}% 0)`:'inset(0)';
    photo.style.transform=isNew?`translateY(${(1-f.image)*16}px) scale(${1+(1-f.image)*.035})`:'none';
   });
   host.dataset.active=scenes[f.active].id;host.dataset.phase=String(f.u);
   if(current!==f.active){current=f.active;setActive(current);}
  }
  function draw(now:number){
   raf=0;if(disposed||!ready)return;
   if(manual){const u=reduce.matches?1:Math.min(1,(now-manual.start)/tokens.motion.revealMs);render(transitionFrame(manual.from,manual.to,u));if(u===1)manual=null;}
   else render(pinned?journeyFrame(scrollProgress(scrollY,top,host.offsetHeight,panel.offsetHeight)):transitionFrame(current,current,1));
   if(entered){const e=reduce.matches?1:Math.min(1,(now-entryStart)/tokens.motion.revealMs);frame.style.opacity=String(e);frame.style.transform=`translateY(${(1-phase(e,0,1))*12}px)`;if(e===1)entered=false;}
   if(manual||entered)raf=requestAnimationFrame(draw);
  }
  function request(force=false){if(!raf&&ready&&(visible||force||manual))raf=requestAnimationFrame(draw);}
  function layout(restore=false){
   if(disposed)return;layoutRaf=0;const wasPinned=pinned;const onScreen=host.getBoundingClientRect().top<innerHeight&&host.getBoundingClientRect().bottom>0;
   // Read natural content at its actual font role before writing any frame geometry.
   sizes=rows.map(row=>({closed:boxHeight(row.querySelector<HTMLElement>('.tj-title-closed')!)+32,open:boxHeight(row.querySelector<HTMLElement>('.tj-title-open')!)+40,body:boxHeight(row.querySelector<HTMLElement>('.tj-copy-inner')!)}));
   const maxTitles=Math.max(...titles.map(boxHeight));heading.style.height=`${maxTitles}px`;
   const maxAside=Math.max(...sizes.map((s,i)=>sizes.reduce((n,v,j)=>n+(i===j?s.open+s.body:v.closed),0)));
   const image=host.querySelector<HTMLElement>('.tj-desktop-media')!;
   const panelCSS=getComputedStyle(panel);const gap=parseFloat(getComputedStyle(frame).rowGap)||32;
   const needed=maxTitles+gap+Math.max(maxAside,boxHeight(image))+parseFloat(panelCSS.paddingTop)+parseFloat(panelCSS.paddingBottom)+24;
   pinned=innerWidth>=1100&&!reduce.matches&&needed<=innerHeight;
   host.dataset.mode=pinned?'pin':'switch';host.dataset.neededHeight=String(Math.ceil(needed));host.dataset.ready='true';
   top=host.getBoundingClientRect().top+scrollY;travel=Math.max(1,host.offsetHeight-panel.offsetHeight);
   if(restore&&onScreen){if(pinned)scrollTo({top:top+journeyStops[current]*travel,behavior:'instant'});else if(wasPinned)scrollTo({top:top,behavior:'instant'});}
   render(pinned?journeyFrame(scrollProgress(scrollY,top,host.offsetHeight,panel.offsetHeight)):transitionFrame(current,current,1));request(true);
  }
  const resize=()=>{if(!layoutRaf)layoutRaf=requestAnimationFrame(()=>layout(true));};
  pick.current=(index,instant=false)=>{
   const target=Math.max(0,Math.min(3,index));const from=current;
   const targetScroll=top+journeyStops[target]*travel;
   if(pinned)scrollTo({top:targetScroll,behavior:'instant'});
   const u=new URL(location.href);u.hash=`journey-variant-4-${scenes[target].id}`;history.replaceState(history.state,'',u);
   if(instant||reduce.matches||from===target){manual=null;current=target;setActive(target);render(transitionFrame(target,target,1));}
   else {manual={from,to:target,start:performance.now(),scroll:scrollY};request(true);}
  };
  function hash(){const i=scenes.findIndex(s=>location.hash===`#journey-variant-4-${s.id}`);if(i>=0)pick.current(i,true);else request(true);}
  function scroll(){if(manual&&Math.abs(scrollY-manual.scroll)>2)manual=null;request();}
  const observer=new IntersectionObserver(entries=>{
   visible=entries.some(e=>e.isIntersecting);if(visible){top=host.getBoundingClientRect().top+scrollY;if(ready&&!host.dataset.entered){host.dataset.entered='true';entered=!reduce.matches;entryStart=performance.now();}request(true);}
  },{threshold:0});observer.observe(host);
  const preload=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){host.querySelectorAll<HTMLImageElement>('.tj-desktop-media img').forEach(img=>{img.loading='eager';void img.decode().catch(()=>{});});preload.disconnect();}},{rootMargin:'100% 0px'});preload.observe(host);
  const ro=new ResizeObserver(()=>{if(ready){top=host.getBoundingClientRect().top+scrollY;}});ro.observe(document.querySelector('main')!);
  void document.fonts.ready.then(()=>{if(disposed)return;ready=true;host.dataset.enhanced='true';setEnhanced(true);layout();if(location.hash==='#journey-variant-4'){scrollTo({top,behavior:'instant'});request(true);}else hash();if(visible){host.dataset.entered='true';entered=!reduce.matches;entryStart=performance.now();request(true);}});
  window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',resize);window.addEventListener('hashchange',hash);window.addEventListener('popstate',hash);window.addEventListener('pageshow',hash);reduce.addEventListener('change',resize);
  return()=>{disposed=true;cancelAnimationFrame(raf);cancelAnimationFrame(layoutRaf);observer.disconnect();preload.disconnect();ro.disconnect();window.removeEventListener('scroll',scroll);window.removeEventListener('resize',resize);window.removeEventListener('hashchange',hash);window.removeEventListener('popstate',hash);window.removeEventListener('pageshow',hash);reduce.removeEventListener('change',resize);};
 },[]);
 function keyboard(event:KeyboardEvent<HTMLElement>,index:number){
  if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
  event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?3:(index+(event.key==='ArrowDown'?1:3))%4;
  root.current?.querySelector<HTMLButtonElement>(`#tj-select-${scenes[next].id}`)?.focus({preventScroll:true});pick.current(next);
 }
 return <section ref={root} className="twin-system twin-journey" data-mode="switch" data-enhanced={enhanced} data-active={scenes[active].id} aria-label="Как Twin помогает выбирать">
  <div className="tj-panel"><div className="tj-frame">
   <div className="tj-headings">{scenes.map((s,i)=><div className="tj-headline" key={s.id} style={{visibility:i===0?'visible':'hidden'}} aria-hidden={i!==active}><h2 data-type="section"><span>{t(s.heading[0])}</span>{' '}<span className="tj-heading-accent">{t(s.heading[1])}</span></h2></div>)}</div>
   <div className="tj-layout">
    <div className="tj-accordion" aria-label="Режимы исследования проекта">{scenes.map((s,i)=><article className="tj-row" key={s.id} data-selected={active===i} id={`journey-variant-4-${s.id}`}>
     <h3 className="tj-row-heading"><button className="tj-toggle" id={`tj-select-${s.id}`} type="button" aria-label={s.label} aria-expanded={!enhanced||active===i} aria-controls={`tj-body-${s.id}`} onClick={()=>pick.current(i)} onKeyDown={e=>keyboard(e,i)}>
      <span className="tj-title-slot" aria-hidden="true"><span className="tj-title-closed" data-type="navigation">{t(s.label)}</span><span className="tj-title-open" data-type="card">{t(s.label)}</span></span><SceneIcon index={i}/>
     </button></h3>
     <div className="tj-body" id={`tj-body-${s.id}`} aria-hidden={enhanced&&active!==i} inert={enhanced&&active!==i}>
      <div className="tj-copy-inner"><div className="tj-copy"><div><span className="tj-copy-label" data-type="label">Покупателю</span><p data-type="support">{t(s.buyer)}</p></div><div><span className="tj-copy-label" data-type="label">Команде продаж</span><p data-type="support">{t(s.sales)}</p></div></div><div className="tj-mobile-media"><Picture index={i}/></div></div>
     </div>
    </article>)}</div>
    <div className="tj-desktop-media">{scenes.map((s,i)=><div className="tj-photo" key={s.id} aria-hidden={active!==i} inert={active!==i}><Picture index={i}/></div>)}</div>
   </div>
  </div></div>
 </section>;
}
