/** VIS-017 deterministic logo assembly: scroll -> t(0..4). Original approved raster mark retained. */
function initTwinEmblem(){
const section=document.querySelector('#qualities'),track=document.querySelector('.r4-qualities-track');if(!section||!track)return;
if(section.closest('astro-island')?.hasAttribute('ssr')){requestAnimationFrame(initTwinEmblem);return;}
const stage=section.querySelector('.r4-twin-emblem');if(!stage||stage.dataset.emblemReady==='true')return;stage.dataset.emblemReady='true';
const scene=section.querySelector('.r4-quality-scene'),svg=scene.querySelector('.r4-quality-links'),cards=[scene.querySelector('.r4-quality-time'),scene.querySelector('.r4-quality-budget'),scene.querySelector('.r4-quality-effect')],heading=cards[2].querySelector('h3');
heading.innerHTML='<span aria-hidden="true">Эффект<span class="r4-effect-insert">ив</span>но</span>';
const insert=heading.querySelector('.r4-effect-insert');
const ns='http://www.w3.org/2000/svg',accent=document.createElementNS(ns,'path');accent.classList.add('r4-quality-attention');svg.append(accent);
function connectors(m){
 const box=scene.getBoundingClientRect(),a=cards[0].getBoundingClientRect(),b=cards[1].getBoundingClientRect(),c=cards[2].getBoundingClientRect(),logo=stage.getBoundingClientRect();
 svg.setAttribute('viewBox','0 0 '+box.width+' '+box.height);
 const y=(a.top+a.height*.42+b.top+b.height*.42)/2-box.top;
 const l=a.right-box.left,r=b.left-box.left,center=logo.left+logo.width/2-box.left;
 // Inner ends sit beneath the opaque outer wings; outer dots follow the actual card borders.
 const il=center-logo.width*.29,ir=center+logo.width*.29;
 const bottom=logo.top+logo.height*.90-box.top,end=c.top-box.top;
 const d='M'+center+' '+bottom+'V'+end;
 svg.querySelector('path').setAttribute('d','M'+l+' '+y+'H'+il+' M'+ir+' '+y+'H'+r+' '+d);
 const dots=svg.querySelectorAll('circle');[[l,y],[r,y],[center,end]].forEach(([x,y],i)=>{dots[i].setAttribute('cx',x);dots[i].setAttribute('cy',y);dots[i].setAttribute('r','3');});
 accent.setAttribute('d',d);accent.style.strokeDasharray=Math.max(1,Math.abs(end-bottom));accent.style.strokeDashoffset=Math.max(1,Math.abs(end-bottom))*(1-m);
}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let enabled=false,raf=0;
const clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>{v=clamp(v);return 1-Math.pow(1-v,3);};
function render(t){const p=clamp(t/4),e=ease(p/.62),s=clamp((p-.12)/.86);stage.style.setProperty('--logo-y',(54*(1-e)).toFixed(3)+'px');stage.style.setProperty('--logo-x',(12*(1-e)).toFixed(3)+'deg');stage.style.setProperty('--logo-ry',(-32*(1-e)).toFixed(3)+'deg');stage.style.setProperty('--logo-scale',(.73+.27*e).toFixed(4));stage.style.setProperty('--logo-opacity',(.25+.75*ease(p/.22)).toFixed(4));stage.style.setProperty('--logo-light',(145-190*s).toFixed(3)+'%');stage.style.setProperty('--logo-shine',(Math.pow(Math.sin(Math.PI*s),2)*.30).toFixed(4));stage.dataset.motionProgress=p.toFixed(4);
cards.forEach((card,i)=>{const q=ease((p-[.02,.13,.30][i])/.22);card.style.setProperty('--card-reveal',q);});
const m=ease((p-.58)/.28);section.style.setProperty('--effect-progress',m);insert.style.width=(insert.scrollWidth*m)+'px';heading.setAttribute('aria-label',m>.5?'Эффективно':'Эффектно');cards[2].dataset.effective=String(m>.5);connectors(m);}
function paint(){raf=0;if(document.hidden||!section.isConnected)return;const r=track.getBoundingClientRect();if(!enabled){render(4);return;}if(r.top>innerHeight||r.bottom<0)return;const travel=Math.max(1,track.offsetHeight-innerHeight);render(clamp(-r.top/travel)*4);}
const request=()=>{if(!raf)raf=requestAnimationFrame(paint);};
function layout(){enabled=innerWidth>=1100&&innerHeight>=700&&!reduced.matches;track.dataset.pin=String(enabled);request();}
window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',layout);document.addEventListener('visibilitychange',request);reduced.addEventListener('change',layout);document.fonts.ready.then(layout);layout();
}
document.querySelector('astro-island[component-export="ReferenceRest"]')?.addEventListener('astro:hydrate',()=>requestAnimationFrame(()=>requestAnimationFrame(initTwinEmblem)),{once:true});
initTwinEmblem();

new MutationObserver(()=>{const el=document.querySelector('.r4-twin-emblem');if(el&&!el.dataset.emblemReady)requestAnimationFrame(initTwinEmblem);}).observe(document.querySelector('main'),{childList:true,subtree:true});
