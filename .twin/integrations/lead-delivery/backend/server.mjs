import http from 'node:http';
import { readdir,readFile,writeFile,rename,mkdir } from 'node:fs/promises';
import { join,isAbsolute } from 'node:path';
import nodemailer from 'nodemailer';
import {acceptLead,deliver,RECIPIENTS} from './core.mjs';
const required=['ALLOWED_ORIGIN','SMTP_HOST','SMTP_USER','SMTP_PASS','SMTP_FROM','DATA_DIR'];
for(const key of required)if(!process.env[key])throw new Error('Missing environment variable: '+key);
const origin=new URL(process.env.ALLOWED_ORIGIN).origin,dir=process.env.DATA_DIR;
if(!origin.startsWith('https://')||!isAbsolute(dir))throw new Error('HTTPS origin and absolute private DATA_DIR required');
await mkdir(dir,{recursive:true,mode:0o700});
const port=Number(process.env.SMTP_PORT||465);
const mail=nodemailer.createTransport({host:process.env.SMTP_HOST,port,secure:port===465,requireTLS:port!==465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},connectionTimeout:15000,socketTimeout:20000});
const busy=new Set(),limits=new Map();
async function flush(record){
 if(busy.has(record.id)||record.sent.length===RECIPIENTS.length)return;
 busy.add(record.id);
 try{record.attempts++;await deliver(record,async msg=>{
   const result=await mail.sendMail({from:process.env.SMTP_FROM,...msg});
   if(!result.accepted?.some(x=>String(x).toLowerCase()===msg.to.toLowerCase()))throw new Error('SMTP recipient not accepted');
  });
 }catch{console.error('lead_notification_retry',record.id);}
 finally{record.retryAt=Date.now()+Math.min(3600000,60000*2**Math.min(record.attempts,6));
  const path=join(dir,record.id+'.json'),temp=path+'.tmp';
  try{await writeFile(temp,JSON.stringify(record),{mode:0o600});await rename(temp,path);}finally{busy.delete(record.id);}
 }
}
async function retry(){for(const file of await readdir(dir)){if(!/^[0-9a-f-]{36}\.json$/i.test(file))continue;try{const r=JSON.parse(await readFile(join(dir,file),'utf8'));if((r.retryAt||0)<=Date.now())await flush(r);}catch{console.error('lead_retry_record_error');}}}
setInterval(()=>retry().catch(()=>console.error('lead_retry_scan_error')),60000).unref();
retry().catch(()=>console.error('lead_retry_scan_error'));
const server=http.createServer(async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('X-Content-Type-Options','nosniff');
 const reply=(status,body)=>{res.writeHead(status);res.end(JSON.stringify(body));};
 if(req.url!=='/api/leads')return reply(404,{ok:false});
 if(req.headers.origin!==origin)return reply(403,{ok:false});
 res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');
 if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');return reply(204,{});}
 if(req.method!=='POST')return reply(405,{ok:false});
 if(!String(req.headers['content-type']||'').startsWith('application/json'))return reply(415,{ok:false});
 // Run one instance behind a TLS reverse proxy. Trust forwarded IP only when configured.
 const ip=process.env.TRUST_PROXY==='1'?String(req.headers['x-forwarded-for']||req.socket.remoteAddress).split(',')[0].trim():req.socket.remoteAddress;
 const now=Date.now();for(const [key,value] of limits)if(value.until<now)limits.delete(key);
 const limit=limits.get(ip)||{count:0,until:now+600000};if(++limit.count>5)return reply(429,{ok:false,error:'rate_limit'});limits.set(ip,limit);
 try{let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>16384)return reply(413,{ok:false});}
  const input=JSON.parse(body);if(input.website)return reply(400,{ok:false});
  const record=await acceptLead(input,dir);
  reply(202,{ok:true,id:record.id});void flush(record).catch(()=>console.error('lead_queue_error',record.id));
 }catch(error){const bad=['invalid','conflict'].includes(error.message)||error instanceof SyntaxError;reply(bad?400:503,{ok:false,error:bad?'invalid':'unavailable'});}
});
server.requestTimeout=20000;server.headersTimeout=15000;
server.listen(Number(process.env.PORT||3000),'127.0.0.1',()=>console.log('Twin lead handler listening'));
