/** Mobile demo confirmation, quality reveal and direct top teleport. */
const phone=matchMedia('(max-width:767px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const form=document.querySelector('.twin-lead-form');
if(form){
 const dialog=document.createElement('dialog');dialog.className='twin-request-confirmation';
 dialog.setAttribute('aria-labelledby','request-confirmation-title');
 dialog.innerHTML='<button type="button" class="request-close" aria-label="Закрыть подтверждение">×</button><img src="/twin-web-concept/v2/media/contact-v1/request-prepared-v1.webp" alt="" width="640" height="640"><h2 id="request-confirmation-title">Спасибо за обращение</h2><p>Спасибо за интерес к Twin. Обсудим задачи вашего проекта.</p><button type="button" class="request-back">Вернуться на сайт</button>';
 document.body.append(dialog);
 dialog.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>dialog.close()));
 dialog.addEventListener('close',()=>form.querySelector('button[type=submit]')?.focus({preventScroll:true}));
 form.addEventListener('submit',event=>{
  if(!phone.matches)return;
  event.preventDefault();event.stopImmediatePropagation();
  // Owner-approved demo UI: no request is transmitted until delivery is connected.
  if(!dialog.open)dialog.showModal();
 },true);
 const labels=()=>{if(phone.matches){form.querySelector('.lead-submit').firstChild.textContent='Отправить заявку ';}};
 labels();phone.addEventListener('change',labels);
}
const topButton=document.querySelector('.twin-scroll-up');
if(topButton){
 const original=topButton.innerHTML;
 const update=()=>{
  if(phone.matches){topButton.innerHTML='<img src="/twin-web-concept/v2/media/approved-20261027/mark-light.webp" alt="" width="48" height="48">';topButton.classList.add('mobile-twin-mark');}
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

const offsets=new WeakMap();let revealFrame=0;
function paintReveal(){
 revealFrame=0;
 const active=phone.matches&&!reduced.matches,h=innerHeight;
 for(const el of targets){
  if(!active){el.style.removeProperty('opacity');el.style.removeProperty('translate');offsets.delete(el);continue;}
  const top=el.getBoundingClientRect().top-(offsets.get(el)||0);
  // Remain hidden until the element reaches 74% of the viewport;
  // full presence at48%. Reversible, so earlier navigation cannot consume it.
  const p=Math.max(0,Math.min(1,(h*.74-top)/(h*.26)));
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
