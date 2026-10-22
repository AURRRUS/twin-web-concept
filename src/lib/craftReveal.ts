/** One observer for short, role-specific cascades; scene scrub owns only inner layers. */
export function initCraftReveals(root:Document=document){
 const nodes=[...root.querySelectorAll<HTMLElement>('[data-craft-reveal]')],reduced=matchMedia('(prefers-reduced-motion:reduce)'),small=matchMedia('(max-width:1279px)');
 const animations=new Map<HTMLElement,Animation>();let observer:IntersectionObserver|undefined,pointerDown=false;
 const group=(n:HTMLElement)=>n.closest<HTMLElement>('.section-heading,.center-heading,.channels-heading,.contact-copy,.composition-map')||n;
 const groups=new Map<HTMLElement,HTMLElement[]>();
 for(const n of nodes){const g=group(n);groups.set(g,[...(groups.get(g)||[]),n]);}
 const settle=(node:Element)=>{
  for(const n of nodes)if(node.contains(n)||n===node){n.removeAttribute('data-craft-waiting');observer?.unobserve(n);animations.get(n)?.cancel();animations.delete(n);}
 };
 const start=(n:HTMLElement)=>{
  if(!n.hasAttribute('data-craft-waiting'))return;
  n.removeAttribute('data-craft-waiting');if(reduced.matches)return;
  const role=n.dataset.craftReveal||'fact',isMedia=role==='media'||role==='composition-core';
  let delay=role==='eyebrow'?0:role==='title'?80:role==='body'?250:isMedia?420:400;
  // Existing pair indices remain spatially meaningful; new timing is shared by line and card.
  if(n.dataset.craftDelay&&role==='fact')delay=Number(n.dataset.craftDelay);
  if(n.dataset.craftPair)delay=Number(n.dataset.craftDelay)||400;
  let duration=role==='eyebrow'?420:role==='title'?620:role==='body'?600:isMedia?900:600;
  const y=role==='eyebrow'?6:role==='title'?18:role==='body'?12:isMedia?-24:14;
  const initial:Keyframe={opacity:0,transform:`translateY(${y}px)`},final:Keyframe={opacity:1,transform:'translateY(0px)'};
  if(role==='title'){initial.clipPath='inset(0 0 100% 0)';final.clipPath='inset(0 0 0% 0)';}
  if(isMedia){initial.transform=`translateY(${y}px) scale(${small.matches?1.02:1.045})`;final.transform='translateY(0px) scale(1)';}
  if(small.matches){duration=Math.min(350,duration);delay=Math.min(140,delay*.25);}
  const frames=isMedia?[initial,{opacity:1,offset:.2},final]:[initial,final];
  try{const a=n.animate(frames,{duration,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});animations.set(n,a);a.finished.catch(()=>{}).finally(()=>{if(animations.get(n)===a)animations.delete(n);});}catch{settle(n);}
 };
 if(!reduced.matches&&'IntersectionObserver'in window&&typeof Element.prototype.animate==='function'){
  observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){for(const n of groups.get(e.target as HTMLElement)||[])start(n);observer?.unobserve(e.target);}}, {rootMargin:'0px 0px -18% 0px',threshold:0});
  for(const [g,list]of groups){for(const n of list)if(n.getBoundingClientRect().top>=innerHeight)n.setAttribute('data-craft-waiting','');observer.observe(g);}
 }
 const focus=(e:Event)=>{if(pointerDown)return;for(const [n,a]of animations)if(n.contains(e.target as Node)){a.cancel();animations.delete(n);}for(const [g]of groups)if(g.contains(e.target as Node))settle(g);};
 const anchor=()=>{let id=location.hash.slice(1);try{id=decodeURIComponent(id);}catch{}const t=document.getElementById(id);if(t)settle(t);};
 const motionChange=()=>{if(reduced.matches){observer?.disconnect();settle(root.documentElement);for(const a of animations.values())a.cancel();animations.clear();}};
 const sceneSettle=(e:Event)=>settle(e.target as Element);
 const pointer=()=>{pointerDown=true;};const keyboard=()=>{pointerDown=false;};const click=(e:Event)=>{pointerDown=false;focus(e);};
 root.addEventListener('pointerdown',pointer,true);root.addEventListener('keydown',keyboard,true);root.addEventListener('pointercancel',keyboard,true);root.addEventListener('click',click,true);
 root.addEventListener('focusin',focus);root.addEventListener('twin:settle-reveal',sceneSettle);window.addEventListener('hashchange',anchor);reduced.addEventListener('change',motionChange);anchor();
 // The photo is never hidden; only the hero's independent text groups enter on load.
 const heroNodes=[['.hero h1',0],['.hero-description',140],['.hero-channels',280],['.hero .actions',380]] as const;
 if(!reduced.matches&&scrollY<20)for(const [selector,delay]of heroNodes){const n=root.querySelector<HTMLElement>(selector);if(n){const a=n.animate([{opacity:0},{opacity:1}],{duration:small.matches?350:500,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});animations.set(n,a);a.finished.catch(()=>{}).finally(()=>animations.delete(n));}}
 return()=>{root.removeEventListener('pointerdown',pointer,true);root.removeEventListener('keydown',keyboard,true);root.removeEventListener('pointercancel',keyboard,true);root.removeEventListener('click',click,true);observer?.disconnect();root.removeEventListener('focusin',focus);root.removeEventListener('twin:settle-reveal',sceneSettle);window.removeEventListener('hashchange',anchor);reduced.removeEventListener('change',motionChange);for(const a of animations.values())a.cancel();for(const n of nodes)n.removeAttribute('data-craft-waiting');};
}
