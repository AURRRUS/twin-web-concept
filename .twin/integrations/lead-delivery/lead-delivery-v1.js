/** Activated only after the private lead handler has been deployed. */
const endpoint=document.querySelector('meta[name="twin-lead-endpoint"]')?.content.trim();
if(endpoint){
 const form=document.querySelector('.twin-lead-form');
 if(form){
  const button=form.querySelector('[type="submit"]'),error=form.querySelector('.lead-error');
  let pending=false,lastPayload='',requestId='';
  const note=form.querySelector('.lead-note');if(note)note.textContent='Заявка будет направлена команде Twin.';
  const showError=text=>{if(error){error.hidden=false;error.textContent=text;}};
  document.addEventListener('submit',async event=>{
   if(event.target!==form)return;
   event.preventDefault();event.stopImmediatePropagation();if(pending)return;
   const data=new FormData(form),payload={name:String(data.get('name')||'').trim(),company:String(data.get('company')||'').trim(),contact:String(data.get('contact')||'').trim(),topic:String(data.get('topic')||'').trim(),consent:!!form.querySelector('[name="personal_data_consent"]')?.checked};
   const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.contact),digits=payload.contact.replace(/\D/g,'');
   const phone=/^[+\d\s()−-]+$/.test(payload.contact)&&digits.length>=10&&digits.length<=15;
   if(!payload.name||!payload.consent||(!email&&!phone)){showError('Укажите имя, телефон или email и подтвердите согласие на обработку данных.');return;}
   const signature=JSON.stringify(payload);if(signature!==lastPayload){requestId=crypto.randomUUID();lastPayload=signature;}
   payload.id=requestId;pending=true;button.disabled=true;form.setAttribute('aria-busy','true');if(error)error.hidden=true;
   try{
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000),credentials:'omit'});
    const result=await response.json();if(!response.ok||result.ok!==true||result.id!==requestId)throw new Error('unavailable');
    let dialog=document.querySelector('.twin-request-confirmation');
    if(!dialog){dialog=document.createElement('dialog');dialog.className='twin-request-confirmation';dialog.setAttribute('aria-label','Заявка принята');dialog.innerHTML='<button type="button" class="request-close" aria-label="Закрыть подтверждение">×</button><h2>Спасибо за обращение</h2><p>Заявка принята. Обсудим задачи вашего проекта.</p><button type="button" class="request-back">Вернуться на сайт</button>';document.body.append(dialog);dialog.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>dialog.close()));}
    if(!dialog.open)dialog.showModal();form.reset();lastPayload='';requestId='';
   }catch{showError('Не удалось подтвердить отправку. Проверьте соединение и повторите попытку — заполненные поля сохранены.');}
   finally{pending=false;button.disabled=false;form.removeAttribute('aria-busy');}
  },true);
 }
}
