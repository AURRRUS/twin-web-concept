/** Mobile quality reveal and direct top teleport. */
const phone=matchMedia('(max-width:767px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const topButton=document.querySelector('.twin-scroll-up');
if(topButton){
 const original=topButton.innerHTML;
 const update=()=>{
  if(phone.matches){topButton.innerHTML='<img src="/v2/media/approved-20261027/mark-light.webp" alt="" width="48" height="48">';topButton.classList.add('mobile-twin-mark');}
  else{topButton.innerHTML=original;topButton.classList.remove('mobile-twin-mark');}
 };
 update();phone.addEventListener('change',update);
}
document.addEventListener('click',event=>{
 if(!phone.matches)return;
 const trigger=event.target.closest?.('.twin-scroll-up,a[href="#top"]');if(!trigger)return;
 event.preventDefault();event.stopImmediatePropagation();
 history.replaceState(null,'','#top');
 window.scrollTo({top:0,left:0,behavior:'instant'});
},true);
const targets=[...document.querySelectorAll('#qualities .r4-twin-face,#qualities article h3,#qualities article strong,#qualities article p')];

const offsets=new WeakMap(),revealedProgress=new WeakMap();let revealFrame=0;
function paintReveal(){
 revealFrame=0;
 const active=phone.matches&&!reduced.matches,h=innerHeight;
 for(const el of targets){
  if(!active){el.style.removeProperty('opacity');el.style.removeProperty('translate');offsets.delete(el);continue;}
  const top=el.getBoundingClientRect().top-(offsets.get(el)||0);
  // Remain hidden until the element reaches 74% of the viewport;
  // Full presence at48%; mobile progress only increases and never hides again.
  // Bottom effect card starts and completes 6% viewport earlier (about40px on phones).
  const lead=el.closest('.r4-quality-effect')?h*.06:0;
  const p=Math.max(revealedProgress.get(el)||0,Math.max(0,Math.min(1,(h*.74-top+lead)/(h*.26))));
  revealedProgress.set(el,p);
  const ease=p*p*(3-2*p),offset=28*(1-ease);
  el.style.opacity=ease.toFixed(4);el.style.translate='0 '+offset.toFixed(2)+'px';
  offsets.set(el,offset);
 }
}
const requestReveal=()=>{if(!revealFrame)revealFrame=requestAnimationFrame(paintReveal);};
addEventListener('scroll',requestReveal,{passive:true});
addEventListener('resize',requestReveal,{passive:true});
phone.addEventListener('change',requestReveal);reduced.addEventListener('change',requestReveal);
document.fonts.ready.then(requestReveal);requestReveal();
