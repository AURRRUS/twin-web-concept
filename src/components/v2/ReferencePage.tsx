import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Composition } from '../Composition';
import { ProductDemo } from '../ProductDemo';
import { ContactForm } from '../ContactForm';
import { initialSelection, validateSelection, type Selection } from '../../lib/config';
import { sitePath } from '../../lib/paths';
import content from '../../../.twin/tasks/VIS-002/content.json';
import story from '../../lib/salesStoryContent.json';
import { Icon } from '../Icon';
const media = (file:string) => sitePath(`/media/${file}`);
const approved = (file:string) => media(`approved-20261027/${file}.webp`);
const t=(s:string)=>s.replace(/(^|\s)(и|в|на|с|к|о|у|по|из|за|от|до|не|а|но|во|со|для)\s+(?=\S)/giu,'$1$2\u00a0');
const journeyImages=['journey-location','journey-compare','journey-floor','journey-space'];
const channelImages=['channel-site','channel-remote','channel-agent','channel-office'];
export function ReferenceJourney(){
 const [active,setActive]=useState(0),[pinned,setPinned]=useState(false);
 const root=useRef<HTMLElement>(null),panel=useRef<HTMLDivElement>(null),jump=useRef<(i:number)=>void>((i)=>setActive(i));
 useEffect(()=>{
  const el=root.current!,box=panel.current!,reduced=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,disposed=false,enabled=false,start=0,travel=1800,selected=0,layoutRaf=0;
  const paint=()=>{raf=0;if(enabled)setActive(selected=Math.min(3,Math.max(0,Math.floor((scrollY-start)/travel*4))));};
  const onScroll=()=>{if(enabled&&!raf)raf=requestAnimationFrame(paint);};
  const layout=()=>{if(disposed)return;const was=enabled;const inView=el.getBoundingClientRect().top<innerHeight&&el.getBoundingClientRect().bottom>0;const oldProgress=Math.max(0,Math.min(1,(scrollY-start)/travel));enabled=innerWidth>=1100&&innerHeight>=box.scrollHeight+48&&!reduced.matches;setPinned(enabled);el.style.setProperty('--journey-travel',enabled?`${travel}px`:'0px');el.style.setProperty('--journey-panel-height',`${box.getBoundingClientRect().height}px`);start=el.getBoundingClientRect().top+scrollY-24;if(was!==enabled&&inView&&was)scrollTo({top:el.getBoundingClientRect().top+scrollY,behavior:'instant'});else if(was&&enabled&&inView)scrollTo({top:start+oldProgress*travel,behavior:'instant'});};
  const requestLayout=()=>{cancelAnimationFrame(layoutRaf);layoutRaf=requestAnimationFrame(layout);};
  jump.current=(i)=>{setActive(selected=i);if(enabled)window.scrollTo({top:start+travel*((i+.5)/4),behavior:reduced.matches?'instant':'smooth'});};
  const ro=new ResizeObserver(requestLayout);ro.observe(box);window.addEventListener('resize',requestLayout);window.addEventListener('scroll',onScroll,{passive:true});reduced.addEventListener('change',layout);document.fonts.ready.then(layout);layout();
  return()=>{disposed=true;cancelAnimationFrame(raf);cancelAnimationFrame(layoutRaf);ro.disconnect();window.removeEventListener('resize',requestLayout);window.removeEventListener('scroll',onScroll);reduced.removeEventListener('change',layout);};
 },[]);
 return <section id="journey" className="r4-journey" ref={root} data-pinned={pinned} aria-labelledby="journey-heading"><div className="r4-journey-panel r4-wrap" ref={panel}>
  <h2 id="journey-heading">Покажите, почему стоит<br/> выбрать <span className="bronze">ваш проект</span></h2>
  <div className="r4-journey-grid"><div className="r4-journey-options" onKeyDown={event=>{if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;const b=Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button'));const i=b.indexOf(event.target as HTMLButtonElement);if(i<0)return;event.preventDefault();b[event.key==='Home'?0:event.key==='End'?3:(i+(event.key==='ArrowDown'?1:3))%4]?.focus();}}>{content.journey.scenes.map((s,i)=><article key={s.id} data-active={active===i}>
   <button type="button" aria-expanded={active===i} aria-controls={`r4-scene-${s.id}`} onClick={()=>jump.current(i)}><Icon name={(['compass','layers','plan','eye'] as const)[i]}/><span>{t(s.label)}</span><span className="r4-chevron" aria-hidden="true">{active===i?'⌄':'›'}</span></button>
   <div id={`r4-scene-${s.id}`} hidden={active!==i}><div className="r4-journey-copy"><h3>{t(s.lead)}</h3><p>{t(s.body)}</p></div><img className="r4-journey-mobile-image" src={approved(journeyImages[i])} alt={s.label} width="1672" height="941" loading="lazy"/></div>
  </article>)}</div><div className="r4-journey-images">{content.journey.scenes.map((s,i)=><img key={s.id} data-active={active===i} src={approved(journeyImages[i])} alt={active===i?s.label:''} aria-hidden={active!==i} width="1672" height="941" loading="eager"/>)}</div></div>
 </div></section>;
}
function ReferenceChannels(){
 const [active,setActive]=useState(3);
 const current=story.channels[active];
 return <section className="r4-channels r4-wrap" id="channels" aria-labelledby="channels-heading"><div className="r4-channels-copy"><span className="eyebrow">Четыре канала продаж</span><h2 id="channels-heading"><span className="r4-channel-heading-line">Четыре канала —</span><br/><span className="bronze">одна основа</span></h2><p className="r4-intro">{t(story.channels_description)}</p>
 <nav aria-label="Каналы продаж" className="r4-channel-nav">{story.channels.map((s,i)=><button key={s.id} type="button" aria-current={active===i?'step':undefined} onClick={()=>setActive(i)}><span aria-hidden="true"/>{t(s.label)}</button>)}</nav>
 <div className="r4-channel-caption" aria-live="polite"><h3>{t(current.label)}</h3><p>{t(current.description)}</p></div><div className="r4-arrows"><button type="button" aria-label="Предыдущий канал" onClick={()=>setActive((active+3)%4)}>←</button><button type="button" aria-label="Следующий канал" onClick={()=>setActive((active+1)%4)}>→</button></div></div>
 <div className="r4-stack" aria-label={`Сценарий: ${current.label}`}>{story.channels.map((s,i)=>{const rank=i===active?3:i<active?i:i-1;return <button type="button" key={s.id} className="r4-stack-card" data-active={active===i} style={{'--rank':rank,zIndex:rank+1} as CSSProperties} onClick={()=>setActive(i)} aria-label={`Показать: ${s.label}`} aria-pressed={active===i}><span className="r4-stack-label">{t(s.label)}</span><img src={approved(channelImages[i])} alt={s.description} width="1672" height="941" loading="lazy"/><small>Демонстрационный сценарий</small></button>;})}</div></section>;
}
function ReferenceQualities(){
 const root=useRef<HTMLElement>(null),[seen,setSeen]=useState(false);
 useEffect(()=>{const o=new IntersectionObserver(e=>{if(e.some(x=>x.isIntersecting)){setSeen(true);o.disconnect();}},{threshold:.45});o.observe(root.current!);return()=>o.disconnect();},[]);
 return <section className="r4-qualities r4-wrap" id="qualities" ref={root}><header><span className="eyebrow">{story.qualities.lead}</span><h2>В Twin сходятся<br/><span className="bronze">все три качества</span></h2></header><div className="r4-quality-scene"><svg viewBox="0 0 1000 640" aria-hidden="true"><path d="M500 25 940 280 500 590 60 280Z"/><circle cx="500" cy="25" r="5"/><circle cx="940" cy="280" r="5"/><circle cx="60" cy="280" r="5"/></svg><img className="r4-quality-model" src={approved('project-model')} alt="Цифровая модель целого курортного проекта" width="1448" height="1086" loading="lazy"/><article className="r4-quality-time"><Icon name="compass"/><h3>Быстро</h3><strong>3 месяца</strong><p>Разработка и сдача<br/>проекта</p></article><article className="r4-quality-budget"><Icon name="layers"/><h3>Доступно</h3><strong>5 млн ₽</strong><p>В среднем<br/>Конфигурация под<br/>задачи проекта</p></article><article className="r4-quality-effect"><Icon name="building"/><h3>{seen?'Эффективно':'Эффектно'}</h3><strong>Помогайте выбирать</strong><p>{t(story.qualities.arguments[2].description)}</p></article></div><p className="r4-quality-note">{t(story.qualities.note)}</p><a className="r4-button" href={sitePath('/demo/')}>Посмотреть Twin <span aria-hidden="true">→</span></a></section>;
}
function ReferenceLaunch(){const files=['launch-materials','launch-composition','launch-development','launch-check'];return <section className="r4-launch r4-wrap" id="launch"><span className="eyebrow">Как запускаем</span><h2>{story.launch.heading}</h2><ol>{story.launch.steps.map((s,i)=><li key={s.index}><span className="r4-step-index">{s.index}</span><div className="r4-step-rule" aria-hidden="true"/><h3>{t(s.title)}</h3><p>{t(s.description)}</p><img src={media(`vis004/${files[i]}.webp`)} alt="" width="840" height="630" loading="lazy"/></li>)}</ol></section>;}
export function ReferenceRest(){
 const [selection,setSelection]=useState(initialSelection),[topic,setTopic]=useState('');
 const change=(next:Selection)=>{setSelection(next);try{sessionStorage.setItem('twin-v2-selection',JSON.stringify(next));}catch{}};
 useEffect(()=>{try{const x=sessionStorage.getItem('twin-v2-selection');if(x)setSelection(validateSelection(JSON.parse(x)));}catch{}},[]);
 return <><div className="r4-demo r4-wrap"><ProductDemo selection={selection} onChange={change} planSrc={media('vis004/lot-alpha.webp')} contactPath="/v2/"/></div><div className="r4-composition r4-wrap"><Composition onTopic={setTopic} coreSrc={approved('project-model')}/></div><ReferenceChannels/><ReferenceQualities/><ReferenceLaunch/><div className="r4-contact"><img className="r4-contact-facade" src={media('vis004/hero-wide.webp')} alt="" loading="lazy"/><div className="r4-wrap"><ContactForm topic={topic} onTopic={setTopic} selection={selection}/></div></div></>;
}
