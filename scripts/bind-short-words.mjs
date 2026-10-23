import{parse}from'@babel/parser';
import{readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
import{bindShortWords}from'./text-bind.mjs';
const files=[];for(const dir of['src/components','src/lib'])for(const name of readdirSync(dir))if(/\.(tsx?|json)$/.test(name)&&!name.endsWith('.d.ts'))files.push(join(dir,name));
let changed=0;
for(const file of files){const source=readFileSync(file,'utf8');let result=source;
 if(file.endsWith('.json')){const visit=value=>typeof value==='string'?bindShortWords(value):Array.isArray(value)?value.map(visit):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,visit(v)])):value;result=JSON.stringify(visit(JSON.parse(source)),null,2)+'\n';}
 else{
  const ast=parse(source,{sourceType:'module',plugins:['typescript','jsx']}),edits=[];
  const visit=node=>{if(!node||typeof node!=='object')return;
   if(['JSXText','StringLiteral','TemplateElement'].includes(node.type)&&typeof node.start==='number'){
    const raw=source.slice(node.start,node.end),next=bindShortWords(raw);if(next!==raw)edits.push({start:node.start,end:node.end,text:next});
   }
   for(const [key,value]of Object.entries(node)){if(['loc','start','end','extra','tokens','comments'].includes(key))continue;if(Array.isArray(value))value.forEach(visit);else if(value&&typeof value==='object')visit(value);}
  };visit(ast);
  for(const e of edits.sort((a,b)=>b.start-a.start))result=result.slice(0,e.start)+e.text+result.slice(e.end);
 }
 if(result!==source){changed++;if(!process.argv.includes('--check'))writeFileSync(file,result);else console.error('Unbound text:',file);}
}
console.log(JSON.stringify({mode:process.argv.includes('--check')?'check':'write',changed,files:files.length}));if(changed&&process.argv.includes('--check'))process.exitCode=1;
