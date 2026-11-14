/** Prepared mail confirmation, phone only; never claims delivery. */
const form=document.querySelector('.twin-lead-form');
if(form&&!form.dataset.mobileConfirmation){
 form.dataset.mobileConfirmation='true';
 const dialog=document.createElement('dialog');
 dialog.className='twin-request-confirmation';
 dialog.setAttribute('aria-labelledby','request-confirmation-title');
 dialog.innerHTML='<button type="button" class="request-close" aria-label="Закрыть подтверждение">×</button><img src="/twin-web-concept/v2/media/contact-v1/request-prepared-v1.webp" alt="" width="640" height="640"><h2 id="request-confirmation-title">Запрос подготовлен</h2><p>Спасибо за интерес к Twin. Остался один шаг: отправьте подготовленное письмо в вашем почтовом сервисе.</p><a class="request-mail">Открыть письмо ↗</a><button type="button" class="request-back">Вернуться к форме</button>';
 document.body.append(dialog);
 const close=()=>dialog.close();
 dialog.querySelector('.request-close').addEventListener('click',close);
 dialog.querySelector('.request-back').addEventListener('click',close);
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
 dialog.addEventListener('close',()=>form.querySelector('button[type=submit]')?.focus({preventScroll:true}));
 form.addEventListener('submit',()=>{
  if(!matchMedia('(max-width:767px)').matches)return;
  const error=form.querySelector('.lead-error'),link=form.querySelector('.lead-result a');
  if(!error?.hidden||!link)return;
  dialog.querySelector('.request-mail').href=link.href;
  if(!dialog.open)dialog.showModal();
 });
}
