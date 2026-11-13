/** VIS-017 deterministic logo assembly: scroll -> t(0..4). Original approved raster mark retained. */
function initTwinEmblem(){
const section=document.querySelector('#qualities'),track=document.querySelector('.r4-qualities-track');if(!section||!track)return;
if(section.closest('astro-island')?.hasAttribute('ssr')){requestAnimationFrame(initTwinEmblem);return;}
const stage=section.querySelector('.r4-twin-emblem');if(!stage)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let enabled=false,raf=0;
const clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>{v=clamp(v);return 1-Math.pow(1-v,3);};
function render(t){const p=clamp(t/4),e=ease(p/.62),s=clamp((p-.48)/.38);stage.style.setProperty('--logo-y',(54*(1-e)).toFixed(3)+'px');stage.style.setProperty('--logo-x',(12*(1-e)).toFixed(3)+'deg');stage.style.setProperty('--logo-ry',(-32*(1-e)).toFixed(3)+'deg');stage.style.setProperty('--logo-scale',(.73+.27*e).toFixed(4));stage.style.setProperty('--logo-opacity',(.25+.75*ease(p/.22)).toFixed(4));stage.style.setProperty('--logo-light',(145-190*s).toFixed(3)+'%');stage.style.setProperty('--logo-shine',(Math.sin(Math.PI*s)*.85).toFixed(4));stage.dataset.motionProgress=p.toFixed(4);}
function paint(){raf=0;if(document.hidden)return;const r=track.getBoundingClientRect();if(!enabled){render(4);return;}if(r.top>innerHeight||r.bottom<0)return;const travel=Math.max(1,track.offsetHeight-innerHeight);render(clamp(-r.top/travel)*4);}
const request=()=>{if(!raf)raf=requestAnimationFrame(paint);};
function layout(){enabled=innerWidth>=1100&&innerHeight>=700&&!reduced.matches;track.dataset.pin=String(enabled);request();}
window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',layout);document.addEventListener('visibilitychange',request);reduced.addEventListener('change',layout);document.fonts.ready.then(layout);layout();
}
initTwinEmblem();
