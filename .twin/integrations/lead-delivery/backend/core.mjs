import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
export const RECIPIENTS=Object.freeze(['bytalentru@gmail.com','iraks.romanov@yandex.ru']);
export function validate(input){
 if(!input||typeof input!=='object')throw new Error('invalid');
 const value={};
 for(const [key,max] of Object.entries({name:200,company:200,contact:200,topic:3000})){
  if(typeof input[key]!=='string'&&input[key]!==undefined)throw new Error('invalid');
  value[key]=(input[key]||'').trim();if(value[key].length>max)throw new Error('invalid');
 }
 if(!value.name||/[\r\n]/.test(value.name)||/[\r\n]/.test(value.contact))throw new Error('invalid');
 const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.contact);
 const phone=/^[+\d\s()−-]+$/.test(value.contact)&&value.contact.replace(/\D/g,'').length>=10&&value.contact.replace(/\D/g,'').length<=15;
 if(!email&&!phone||input.consent!==true)throw new Error('invalid');
 if(typeof input.id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.id))throw new Error('invalid');
 return {id:input.id,...value,consent:true};
}
export async function acceptLead(input,dir){
 const lead=validate(input);await mkdir(dir,{recursive:true,mode:0o700});
 const path=join(dir,lead.id+'.json');
 const record={...lead,createdAt:new Date().toISOString(),sent:[],attempts:0};
 try{await writeFile(path,JSON.stringify(record),{flag:'wx',mode:0o600});return record;}
 catch(error){if(error.code!=='EEXIST')throw error;const existing=JSON.parse(await readFile(path,'utf8'));
  for(const key of ['name','company','contact','topic'])if(existing[key]!==lead[key])throw new Error('conflict');
  return existing;
 }
}
export async function deliver(record,send){
 for(const recipient of RECIPIENTS){
  if(record.sent.includes(recipient))continue;
  await send({to:recipient,subject:'Заявка Twin · '+record.id.slice(0,8),text:['Заявка Twin by TALENT','Номер: '+record.id,'Имя: '+record.name,'Компания: '+(record.company||'—'),'Контакт: '+record.contact,'О проекте: '+(record.topic||'—'),'Согласие: подтверждено', 'Получена: '+record.createdAt].join('\n')});
  record.sent.push(recipient);
 }
 return record;
}
