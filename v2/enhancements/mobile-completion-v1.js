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
const seen=new WeakSet();
const reveal=new IntersectionObserver(entries=>{
 for(const entry of entries){
  if(!entry.isIntersecting||!phone.matches||reduced.matches||seen.has(entry.target))continue;
  seen.add(entry.target);reveal.unobserve(entry.target);
  const a=entry.target.animate([{opacity:0,translate:'0 22px'},{opacity:1,translate:'0 0'}],{duration:720,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
  a.finished.then(()=>a.cancel()).catch(()=>{});
 }
},{threshold:.18,rootMargin:'0px 0px -24px 0px'});
targets.forEach(el=>reveal.observe(el));
