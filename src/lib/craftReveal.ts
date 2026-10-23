/** Short entrances own outer slots; the pure Journey driver owns only inner scene layers. */
export function initCraftReveals(root:Document=document){
 const nodes=[...root.querySelectorAll<HTMLElement>('[data-craft-reveal]')],reduced=matchMedia('(prefers-reduced-motion:reduce)'),small=matchMedia('(max-width:1279px)');
 const animations=new Map<HTMLElement,Animation>(),observers:IntersectionObserver[]=[];
 const replayHosts=[...root.querySelectorAll<HTMLElement>('[data-craft-repeat="after-exit"]')],replayState=new Map(replayHosts.map(n=>[n,{played:false,armed:true,cycles:0}]));
 let pointerDown=false,resizeRaf=0,scrollRaf=0;
 const group=(n:HTMLElement)=>{
  const cinematic=n.closest<HTMLElement>('.journey-cinematic');
  if(cinematic)return cinematic.querySelector<HTMLElement>('.scene-title-slot')||n;
  if(n.dataset.craftPair)return root.querySelector<HTMLElement>(`.map-component[data-craft-pair="${n.dataset.craftPair}"]`)||n;
  return ['eyebrow','title','body'].includes(n.dataset.craftReveal||'')?n.closest<HTMLElement>('.section-heading,.center-heading,.channels-heading,.contact-copy,.scene-text-zone,.static-scene')||n:n;
 };
 const groups=new Map<HTMLElement,HTMLElement[]>(),registered=new WeakSet<HTMLElement>();
 for(const n of nodes){const g=group(n);groups.set(g,[...(groups.get(g)||[]),n]);}
 const settle=(node:Element)=>{
  for(const [g,list]of groups)if(node.contains(g)||g===node){for(const o of observers)o.unobserve(g);for(const n of list){n.removeAttribute('data-craft-waiting');animations.get(n)?.cancel();animations.delete(n);}}
 };
 const start=(n:HTMLElement)=>{
  if(!n.hasAttribute('data-craft-waiting'))return;
  n.removeAttribute('data-craft-waiting');if(reduced.matches)return;
  const role=n.dataset.craftReveal||'fact',isMedia=role==='media'||role==='composition-core',visual=isMedia||role==='contact-form';
  let delay=role==='eyebrow'?0:role==='title'?100:role==='body'?360:visual?600:0;
  let duration=role==='eyebrow'?420:role==='title'?700:role==='body'?650:visual?1050:700;
  const y=role==='eyebrow'?6:role==='title'?18:role==='body'?12:isMedia?-32:14;
  const initial:Keyframe={opacity:0,transform:`translateY(${y}px)`},final:Keyframe={opacity:1,transform:'translateY(0px)'};
  if(role==='title'){initial.clipPath='inset(0 0 100% 0)';final.clipPath='inset(0 0 0% 0)';}
  if(isMedia){initial.transform=`translateY(${y}px) scale(${small.matches?1.02:1.06})`;final.transform='translateY(0px) scale(1)';}
  if(small.matches){duration=Math.min(350,duration);delay=Math.min(140,delay*.25);}
  try{const a=n.animate(isMedia?[initial,{opacity:1,offset:.2},final]:[initial,final],{duration,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});animations.set(n,a);a.finished.catch(()=>{}).finally(()=>{if(animations.get(n)===a)animations.delete(n);});}catch{settle(group(n));}
 };
 if(!reduced.matches&&'IntersectionObserver'in window&&typeof Element.prototype.animate==='function'){
  for(const margin of['-20%','-15%'])observers.push(new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){const g=e.target as HTMLElement,host=g.closest<HTMLElement>('[data-craft-repeat="after-exit"]'),state=host&&replayState.get(host);
    if(state?.armed){state.armed=false;state.played=true;state.cycles++;host!.dataset.entryCycle=String(state.cycles);delete host!.dataset.entryArmed;}
    for(const n of groups.get(g)||[])start(n);for(const o of observers)o.unobserve(e.target);}}, {rootMargin:`0px 0px ${margin} 0px`,threshold:0}));
 }
 const register=()=>{
  if(reduced.matches||!observers.length)return;
  for(const [g,list]of groups){
   // Hidden fallback copies do not run, and may be registered after a breakpoint change.
   if(!g.getClientRects().length){for(const o of observers)o.unobserve(g);registered.delete(g);settle(g);continue;}
   if(registered.has(g))continue;
   registered.add(g);
   const heading=list.some(n=>['eyebrow','title','body'].includes(n.dataset.craftReveal||'')),threshold=heading?.80:.85;
   if(g.getBoundingClientRect().top>=innerHeight*threshold)for(const n of list)n.setAttribute('data-craft-waiting','');
   observers[heading?0:1].observe(g);
  }
 };
 const replayObserver=!reduced.matches&&observers.length?new IntersectionObserver(entries=>{
  for(const entry of entries){const host=entry.target as HTMLElement,state=replayState.get(host)!;
   const r=entry.boundingClientRect,fullyOutside=r.bottom<=0||r.top>=innerHeight;
   if(!fullyOutside||!state.played||state.armed)continue;
   state.armed=true;host.dataset.entryArmed='true';
   for(const [g,list]of groups)if(host.contains(g)&&g.getClientRects().length){
    for(const n of list){animations.get(n)?.cancel();animations.delete(n);n.setAttribute('data-craft-waiting','');}
    for(const o of observers)o.unobserve(g);
    const heading=list.some(n=>['eyebrow','title','body'].includes(n.dataset.craftReveal||''));observers[heading?0:1].observe(g);
   }
  }
 },{threshold:[0,0.00001]}):undefined;
 for(const host of replayHosts)replayObserver?.observe(host);
 register();const resize=()=>{cancelAnimationFrame(resizeRaf);resizeRaf=requestAnimationFrame(register);};window.addEventListener('resize',resize);
 // A fast native jump settles groups already passed; Journey owns its separate replay policy.
 const settlePassed=()=>{scrollRaf=0;for(const [g]of groups)if(!g.closest('.journey')&&g.getClientRects().length&&g.getBoundingClientRect().bottom<=0)settle(g);};
 const scroll=()=>{if(!scrollRaf)scrollRaf=requestAnimationFrame(settlePassed);};
 const visibility=()=>{if(document.hidden)return;settlePassed();for(const [g]of groups)if(!g.closest('.journey')&&g.getClientRects().length){const r=g.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)settle(g);}};
 window.addEventListener('scroll',scroll,{passive:true});root.addEventListener('visibilitychange',visibility);
 const focus=(e:Event)=>{if(pointerDown)return;for(const [n,a]of animations)if(n.contains(e.target as Node)){a.cancel();animations.delete(n);}for(const [g]of groups)if(g.contains(e.target as Node))settle(g);};
 const anchor=()=>{let id=location.hash.slice(1);try{id=decodeURIComponent(id);}catch{}const t=document.getElementById(id);if(t)settle(t);};
 const motionChange=()=>{if(reduced.matches){for(const o of observers)o.disconnect();replayObserver?.disconnect();settle(root.documentElement);for(const a of animations.values())a.cancel();animations.clear();}};
 const sceneSettle=(e:Event)=>{const target=e.target as HTMLElement;const state=replayState.get(target);if(state){state.played=true;state.armed=false;}settle(target);};
 const pointer=()=>{pointerDown=true;};const keyboard=()=>{pointerDown=false;};const click=(e:Event)=>{pointerDown=false;focus(e);};
 root.addEventListener('pointerdown',pointer,true);root.addEventListener('keydown',keyboard,true);root.addEventListener('pointercancel',keyboard,true);root.addEventListener('click',click,true);
 root.addEventListener('focusin',focus);root.addEventListener('twin:settle-reveal',sceneSettle);window.addEventListener('hashchange',anchor);reduced.addEventListener('change',motionChange);anchor();
 // The clean photograph never disappears; the four text/action groups enter once.
 const heroNodes=[['.hero h1',100,700],['.hero-description',360,650],['.hero-channels',500,650],['.hero .actions',650,600]] as const;
 if(!reduced.matches&&scrollY<20)for(const [selector,delay,duration]of heroNodes){const n=root.querySelector<HTMLElement>(selector);if(n){const a=n.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:small.matches?350:duration,delay:small.matches?Math.min(140,delay*.25):delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});animations.set(n,a);a.finished.catch(()=>{}).finally(()=>animations.delete(n));}}
 return()=>{cancelAnimationFrame(scrollRaf);window.removeEventListener('scroll',scroll);root.removeEventListener('visibilitychange',visibility);cancelAnimationFrame(resizeRaf);replayObserver?.disconnect();window.removeEventListener('resize',resize);root.removeEventListener('pointerdown',pointer,true);root.removeEventListener('keydown',keyboard,true);root.removeEventListener('pointercancel',keyboard,true);root.removeEventListener('click',click,true);for(const o of observers)o.disconnect();root.removeEventListener('focusin',focus);root.removeEventListener('twin:settle-reveal',sceneSettle);window.removeEventListener('hashchange',anchor);reduced.removeEventListener('change',motionChange);for(const a of animations.values())a.cancel();for(const n of nodes)n.removeAttribute('data-craft-waiting');};
}
