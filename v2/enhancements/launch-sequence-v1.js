function initLaunch(){
const section=document.getElementById('launch');if(!section||section.closest('astro-island')?.hasAttribute('ssr')){requestAnimationFrame(initLaunch);return;}if(section.dataset.launchSequence)return;section.dataset.launchSequence='true';
const track=section.closest('.r4-launch-track'),list=section.querySelector('ol'),items=[...list.querySelectorAll(':scope>li')],ns='http://www.w3.org/2000/svg',clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)};
list.querySelector('.r4-launch-line')?.remove();const svg=document.createElementNS(ns,'svg');svg.classList.add('r4-launch-line');svg.setAttribute('aria-hidden','true');const make=(tag,cls)=>{const el=document.createElementNS(ns,tag);el.setAttribute('class',cls);svg.append(el);return el;},base=make('path','base'),fill=make('path','progress'),branches=items.map(()=>make('path','branch')),pulse=make('circle','pulse');pulse.setAttribute('r','4');list.append(svg);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,pinned=false;
function layout(){pinned=innerWidth>=1100&&innerHeight>=740&&!reduced.matches;track.dataset.sequencePin=String(pinned);request();}
function paint(){raf=0;if(!section.isConnected)return;const rect=list.getBoundingClientRect(),tr=track.getBoundingClientRect(),vertical=innerWidth<1100;
const p=reduced.matches?1:pinned?clamp(-tr.top/Math.max(1,track.offsetHeight-innerHeight)):clamp((innerHeight*.9-rect.top)/Math.max(innerHeight*.8,rect.height));
const nodes=items.map(item=>{const n=item.querySelector('.r4-step-index').getBoundingClientRect();return{x:n.left+n.width/2-rect.left,y:n.top+n.height/2-rect.top};});
svg.setAttribute('viewBox','0 0 '+rect.width+' '+rect.height);const d=nodes.map((n,i)=>(i?'L':'M')+n.x+' '+n.y).join(' ');base.setAttribute('d',d);fill.setAttribute('d',d);
const lineP=reduced.matches?1:vertical?clamp((innerHeight*.60-(rect.top+nodes[0].y))/Math.max(1,nodes[4].y-nodes[0].y)):clamp((p*5-.32)/4);
const length=fill.getTotalLength();fill.style.strokeDasharray=length;fill.style.strokeDashoffset=length*(1-lineP);
const point=fill.getPointAtLength(length*lineP);pulse.setAttribute('cx',point.x);pulse.setAttribute('cy',point.y);pulse.style.opacity=reduced.matches||lineP<=0||lineP>=1?'0':'1';
items.forEach((item,i)=>{const ir=item.getBoundingClientRect(),q=reduced.matches?1:vertical?clamp((innerHeight*.78-ir.top)/(innerHeight*.45)):clamp(p*5-i);const reveal=ease((q-.12)/.70),node=ease((q-.12)/.30),branch=ease((q-.30)/.30);item.style.setProperty('--step-reveal',reveal);item.style.setProperty('--node-progress',node);item.dataset.active=String(node>.5);item.dataset.phase=q.toFixed(3);
const n=nodes[i],img=item.querySelector('img').getBoundingClientRect();let bd;if(vertical){bd='M'+n.x+' '+n.y+'H'+(ir.left+48-rect.left);}else{bd='M'+n.x+' '+n.y+'V'+(img.bottom-rect.top+8);}
branches[i].setAttribute('d',bd);const bl=branches[i].getTotalLength();branches[i].style.strokeDasharray=bl;branches[i].style.strokeDashoffset=bl*(1-branch);branches[i].style.opacity=branch;
});
section.dataset.progress=p.toFixed(4);section.dataset.activeStep=String(Math.min(5,Math.floor(p*5)+1));
}
function request(){if(!raf)raf=requestAnimationFrame(paint)}addEventListener('scroll',request,{passive:true});addEventListener('resize',layout);reduced.addEventListener('change',layout);document.fonts.ready.then(layout);layout();
}
document.addEventListener('click',event=>{const link=event.target.closest?.('a[href="#launch"]');const track=document.querySelector('.r4-launch-track');if(link&&track){event.preventDefault();history.pushState(null,'','#launch');track.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}});
initLaunch();new MutationObserver(()=>{const el=document.getElementById('launch');if(el&&!el.dataset.launchSequence)requestAnimationFrame(initLaunch)}).observe(document.querySelector('main'),{childList:true,subtree:true});
