/** Position-based, reversible reading track. Does not consume wheel events. */
const chapter=document.querySelector('.r4-composition');
if(chapter){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,enabled=false;
 const paint=()=>{raf=0;if(!enabled||document.hidden)return;const rect=chapter.getBoundingClientRect();const travel=Math.max(1,chapter.offsetHeight-innerHeight);const p=Math.max(0,Math.min(1,-rect.top/travel));const active=Math.min(5,Math.floor(p*6));chapter.dataset.progress=p.toFixed(4);chapter.querySelectorAll('.map-component').forEach((e,i)=>{e.dataset.scrollActive=String(i===active);chapter.querySelector(`.composition-lines g[data-craft-pair="${e.dataset.craftPair}"]`)?.setAttribute('data-scroll-active',String(i===active));});};
 const request=()=>{if(!raf)raf=requestAnimationFrame(paint);};
 const layout=()=>{enabled=innerWidth>=1100&&innerHeight>=680&&!reduced.matches;chapter.dataset.scrollComposition=String(enabled);if(!enabled)chapter.querySelectorAll('[data-scroll-active]').forEach(e=>e.removeAttribute('data-scroll-active'));request();};
 window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',layout);reduced.addEventListener('change',layout);document.fonts.ready.then(layout);layout();
}

const up=document.createElement("button");up.type="button";up.className="twin-scroll-up";up.setAttribute("aria-label","Вернуться к началу страницы");up.textContent="↑";up.hidden=scrollY<innerHeight;up.addEventListener("click",()=>window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"}));document.body.append(up);window.addEventListener("scroll",()=>{up.hidden=scrollY<innerHeight;},{passive:true});
