import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('../lead-delivery-v1.js',import.meta.url),'utf8');
async function fixture({endpoint='https://api.example/api/leads',ok=true,consent=true}={}){
 let listener,resets=0,opens=0,calls=0;
 const button={},error={},note={};
 const form={querySelector:s=>s==='[type="submit"]'?button:s==='.lead-error'?error:s==='.lead-note'?note:{checked:consent},setAttribute(){},removeAttribute(){},reset(){resets++;}};
 const dialog={open:false,showModal(){opens++;this.open=true;}};
 const document={querySelector:s=>s.startsWith('meta')?{content:endpoint}:s==='.twin-lead-form'?form:dialog,addEventListener:(_,fn)=>listener=fn};
 vm.runInNewContext(source,{document,FormData:class{get(k){return {name:'Test',contact:'test@example.com',company:'',topic:''}[k]}},crypto:{randomUUID:()=> 'fb0da61d-b7a0-4a8c-bb86-9a07f66be768'},AbortSignal,fetch:async()=>{calls++;return {ok,json:async()=>({ok,id:'fb0da61d-b7a0-4a8c-bb86-9a07f66be768'})}}});
 if(listener)await listener({target:form,preventDefault(){},stopImmediatePropagation(){}});
 return {calls,resets,opens,error,button,listener};
}
test('inactive delivery leaves approved demo untouched',async()=>{assert.equal((await fixture({endpoint:''})).listener,undefined);});
test('only accepted requests show thank you and reset',async()=>{const r=await fixture();assert.equal(r.calls,1);assert.equal(r.opens,1);assert.equal(r.resets,1);assert.equal(r.button.disabled,false);});
test('server refusal preserves fields and exposes error',async()=>{const r=await fixture({ok:false});assert.equal(r.opens,0);assert.equal(r.resets,0);assert.equal(r.error.hidden,false);});
test('consent required before any transmission',async()=>{const r=await fixture({consent:false});assert.equal(r.calls,0);assert.equal(r.opens,0);});
