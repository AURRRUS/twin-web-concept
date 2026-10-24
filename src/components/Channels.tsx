import {sitePath} from '../lib/paths';
import {useEffect,useRef,useState,type MouseEvent} from 'react';
import {Media,Arrow} from './Media';
import {channelFrame,channelTargets} from '../lib/channelMotion.mjs';
import {bindShortWords} from '../lib/text';
const channels=[
 {id:'site',label:'На сайте',title:'Исследовать в своём темпе',description:'Самостоятельное изучение проекта и обращение с сохранённым выбором.',media:'r2ChannelsSite'},
 {id:'online',label:'Дистанционно',title:'Быть рядом на расстоянии',description:'Совместный просмотр выбранного лота с менеджером — независимо от расстояния.',media:'r2ChannelsOnline'},
 {id:'agent',label:'Через агентов',title:'Продолжить разговор о выборе',description:'Проект и подборка под рукой — на встрече с покупателем или дистанционно.',media:'r2ChannelsAgent'},
 {id:'office',label:'В офисе продаж',title:'Показать больше на встрече',description:'Большой экран и предметное обсуждение проекта, пространства и конкретного лота.',media:'r2ChannelsOffice'},
] as const;
export function Channels(){
 const host=useRef<HTMLElement>(null),jump=useRef<(index:number,immediate?:boolean)=>void>(()=>{});
 const [active,setActive]=useState(0),[focusCard,setFocusCard]=useState(0),[motion,setMotion]=useState(false),[ready,setReady]=useState(false);
 useEffect(()=>{
  const node=host.current!,panel=node.querySelector<HTMLElement>('.channel-stack-panel')!,stage=node.querySelector<HTMLElement>('.channel-stack-viewport')!,cards=[...node.querySelectorAll<HTMLElement>('.channel-card')],reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let disposed=false,enabled=false,raf=0,lastActive=0,lastFocus=0,height=0,fontsReady=false,imageReady=false,hashChecked=false;const decoded=[false,false,false,false];
  const read=()=>Math.max(0,Math.min(1,-node.getBoundingClientRect().top/Math.max(1,node.offsetHeight-panel.offsetHeight)));
  const write=()=>{raf=0;if(disposed||document.hidden||!enabled)return;let p=read();for(let i=1;i<4;i++)if(!decoded[i])p=Math.min(p,[0,45,130,215][i]/300);const f=channelFrame(p,height);let next=f.active;if(next>lastActive&&f.entries[next]<.62)next=lastActive;if(next<lastActive&&f.entries[lastActive]>.58)next=lastActive;node.style.setProperty('--channel-progress',String(p));
   const focus=next===0||f.entries[next]>.999?next:-1;const interactive=focus>=0&&f.entries.slice(focus+1).every(v=>v<.001)?focus:-1;if(interactive!==lastFocus){lastFocus=interactive;setFocusCard(interactive);}node.dataset.focusCard=String(interactive);
   cards.forEach((card,i)=>{card.style.setProperty('--card-y',`${f.y[i]}px`);card.style.setProperty('--card-scale',String(f.scale[i]));card.inert=i!==interactive;card.setAttribute('aria-hidden',String(i!==interactive));});
   if(next!==lastActive){lastActive=next;setActive(next);}node.dataset.active=channels[next].id;
  };
  const request=()=>{if(!raf&&!document.hidden)raf=requestAnimationFrame(write);};
  const configure=()=>{
   if(disposed||!fontsReady)return;
   let fits=innerWidth>=1024&&!reduced.matches;
   if(fits){node.dataset.measuring='true';node.style.removeProperty('--channel-width');node.style.removeProperty('--channel-copy-height');
    const css=getComputedStyle(panel),header=node.querySelector<HTMLElement>('.channel-stack-heading')!,available=innerHeight-parseFloat(css.paddingTop)-parseFloat(css.paddingBottom)-header.offsetHeight-parseFloat(css.rowGap)-32;
    const fullWidth=stage.clientWidth;let width=fullWidth,footer=0;
    for(let i=0;i<4;i++){node.style.setProperty('--channel-width',`${width}px`);footer=Math.max(...cards.map(c=>c.querySelector<HTMLElement>('.channel-card-copy')!.offsetHeight));width=Math.min(fullWidth,Math.max(0,(available-footer-2)*16/9));}
    node.style.setProperty('--channel-width',`${width}px`);footer=Math.max(...cards.map(c=>c.querySelector<HTMLElement>('.channel-card-copy')!.offsetHeight));node.style.setProperty('--channel-copy-height',`${footer}px`);
    height=width*9/16+footer+2;node.style.setProperty('--channel-card-height',`${height}px`);
    fits=width>=320&&height<=available+1&&node.querySelector<HTMLElement>('.channel-stack-navigation')!.scrollHeight<=available;
    delete node.dataset.measuring;
   }
   enabled=fits&&imageReady;node.dataset.motionEnabled=String(enabled);setMotion(enabled);setReady(true);
   if(enabled){write();if(!hashChecked){hashChecked=true;const i=channels.findIndex(c=>`#channel-${c.id}`===location.hash);if(i>=0)requestAnimationFrame(()=>{if(!disposed)jump.current(i,true);});}}else cards.forEach(card=>{card.inert=false;card.removeAttribute('aria-hidden');});
  };
  jump.current=(index,immediate=false)=>{if(enabled){window.scrollTo({top:node.getBoundingClientRect().top+scrollY+(node.offsetHeight-panel.offsetHeight)*channelTargets[index],behavior:immediate?'instant':'smooth'});}else document.getElementById(`channel-${channels[index].id}`)?.scrollIntoView();};
  const first=cards[0].querySelector<HTMLImageElement>('img')!;first.loading='eager';void first.decode().catch(()=>{}).then(()=>{imageReady=true;decoded[0]=true;configure();});
  const preload=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){cards.forEach((c,i)=>{const img=c.querySelector<HTMLImageElement>('img')!;img.loading='eager';void img.decode().catch(()=>{}).then(()=>{decoded[i]=true;request();});});preload.disconnect();}},{rootMargin:'150% 0px'});preload.observe(node);
  void document.fonts.ready.then(()=>{fontsReady=true;configure();});
  const visibility=()=>{if(!document.hidden)request();};const hash=()=>{const i=channels.findIndex(c=>`#channel-${c.id}`===location.hash);if(i>=0)jump.current(i);};
  window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',configure);window.addEventListener('hashchange',hash);reduced.addEventListener('change',configure);document.addEventListener('visibilitychange',visibility);
  const observer=new ResizeObserver(request);observer.observe(node);
  return()=>{disposed=true;cancelAnimationFrame(raf);preload.disconnect();observer.disconnect();window.removeEventListener('scroll',request);window.removeEventListener('resize',configure);window.removeEventListener('hashchange',hash);reduced.removeEventListener('change',configure);document.removeEventListener('visibilitychange',visibility);};
 },[]);
 const navigate=(event:MouseEvent<HTMLAnchorElement>,index:number)=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();const url=new URL(location.href);url.hash=`channel-${channels[index].id}`;if(url.href!==location.href)history.pushState({},'',url);jump.current(index);};
 return <section ref={host} className="channels" id="channels" data-enhanced={ready?motion:'pending'} data-motion-enabled={motion} data-active={channels[active].id} aria-labelledby="channels-heading">
  <div className="channel-stack-panel content-container"><div className="channel-stack-heading"><span className="eyebrow">Один цифровой проект · Вся система продаж</span><h2 id="channels-heading"><span className="channel-title-line">Четыре канала —</span>{' '}<span className="bronze">одна основа</span></h2><p>Единая цифровая основа{' '}<br/>для всех каналов продаж</p>
   </div><nav className="channel-stack-navigation" aria-label="Каналы продаж" onKeyDown={event=>{const keys=['ArrowDown','ArrowUp','Home','End'];if(!keys.includes(event.key))return;const links=[...event.currentTarget.querySelectorAll<HTMLAnchorElement>('a')],current=links.indexOf(event.target as HTMLAnchorElement);if(current<0)return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?3:(current+(event.key==='ArrowDown'?1:3))%4;links[next].focus({preventScroll:true});links[next].click();}}><ol>{channels.map((c,i)=><li key={c.id}><a href={`#channel-${c.id}`} aria-current={active===i?'step':undefined} onClick={e=>navigate(e,i)}><span>0{i+1}</span>{' '}<span className="channel-nav-name">{bindShortWords(c.label)}</span></a></li>)}</ol></nav>
  <div className="channel-stack-viewport">{channels.map((c,i)=><article id={`channel-${c.id}`} className="channel-card" key={c.id} data-index={i} inert={motion&&focusCard!==i} aria-hidden={motion?focusCard!==i:undefined} style={{zIndex:i+1}}><Media name={c.media} alt={`Сцена продаж — ${bindShortWords(c.label)}`} eager={i===0}/><div className="channel-card-copy"><h3>{bindShortWords(c.title)}</h3><p>{bindShortWords(c.description)}</p><a className="text-link" href={sitePath('/demo')}>Посмотреть Twin<Arrow/></a></div></article>)}</div></div>
 </section>;
}
