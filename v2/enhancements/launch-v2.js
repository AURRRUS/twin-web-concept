function initLaunch(){
const section=document.querySelector('#launch');if(!section)return;if(section.closest('astro-island')?.hasAttribute('ssr')){requestAnimationFrame(initLaunch);return;}
const list=section.querySelector('ol'),items=[...list.children],ns='http://www.w3.org/2000/svg';
const svg=document.createElementNS(ns,'svg');svg.classList.add('r4-launch-line');svg.setAttribute('aria-hidden','true');
const base=document.createElementNS(ns,'path'),fill=document.createElementNS(ns,'path');fill.classList.add('progress');svg.append(base,fill);list.append(svg);
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),clamp=x=>Math.max(0,Math.min(1,x));let raf=0;
function paint(){raf=0;const rect=list.getBoundingClientRect(),vertical=innerWidth<1100,p=reduced.matches?1:clamp((innerHeight*.88-rect.top)/(innerHeight*.64));
items.forEach((item,i)=>{const q=reduced.matches?1:vertical?clamp((innerHeight*.88-item.getBoundingClientRect().top)/(innerHeight*.40)):clamp((p-i*.15)/.23);const e=1-Math.pow(1-q,3);item.style.setProperty('--step-reveal',e);item.dataset.active=String(q>.45);});
const nodes=items.map(item=>{const r=item.querySelector('.r4-step-index').getBoundingClientRect();return [r.left+r.width/2-rect.left,r.top+r.height/2-rect.top];});
svg.setAttribute('viewBox','0 0 '+rect.width+' '+rect.height);
const d=nodes.map(([x,y],i)=>(i?'L':'M')+x+' '+y).join(' ');base.setAttribute('d',d);fill.setAttribute('d',d);
const length=fill.getTotalLength();const progress=reduced.matches?1:vertical?clamp((innerHeight*.65-rect.top)/Math.max(1,rect.height-innerHeight*.25)):p;fill.style.strokeDasharray=length;fill.style.strokeDashoffset=length*(1-progress);section.dataset.progress=progress.toFixed(3);
}
const request=()=>{if(!raf)raf=requestAnimationFrame(paint);};addEventListener('scroll',request,{passive:true});addEventListener('resize',request);reduced.addEventListener('change',request);document.fonts.ready.then(request);request();
}initLaunch();