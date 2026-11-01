import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {candidate,publicationErrors} from './workflow-state.mjs';
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=(root,p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
export function inputsFingerprint(root,req){
 const tracked=execFileSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
 const extra=execFileSync('git',['ls-files','--others','--exclude-standard','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
 const files=[...new Set([...tracked,...extra])].filter(p=>req.inputPrefixes.some(x=>p.startsWith(x))||req.inputPaths.includes(p)).sort();
 if(!files.length)throw Error('No runtime inputs');
 return digest(JSON.stringify(files.map(p=>[p,fs.existsSync(path.join(root,p))?digest(fs.readFileSync(path.join(root,p))):'DELETED'])));
}
export function validateReview(root,req,review,options={}){
 const errors=[];
 const known=options.acceptedDefects || [];
 const preview=options.kind==='preview' && options.allowKnownDefects===true && known.length>0 && ['pass','fix'].includes(review.status) && Array.isArray(review.blockingIssues) && review.blockingIssues.every(id=>known.includes(id));
 if(!preview && (review.status!=='pass'||review.blockingIssues?.length))errors.push('Visual review blocked or has unresolved issues');
 if(review.inputFingerprint!==inputsFingerprint(root,req))errors.push('Visual review stale/missing runtime fingerprint');
 if(typeof review.reviewer!=='string'||review.reviewer.trim().length<3)errors.push('Missing reviewer');
 if(req.schemaVersion>=2){
  if(!req.contractPath || !fs.existsSync(path.join(root,req.contractPath)) || review.contractFingerprint!==digest(fs.readFileSync(path.join(root,req.contractPath))))errors.push('Review contract fingerprint stale/missing');
  const records=Array.isArray(review.agents)?review.agents:[];
  const completed=id=>typeof id==='string' && records.some(a=>a.id===id && a.status==='completed' && Array.isArray(a.evidence) && a.evidence.length && a.evidence.every(p=>typeof p==='string'&&!p.includes('..')&&!path.isAbsolute(p)&&fs.existsSync(path.join(root,p))));
  if(review.independent!==true || review.reviewer===review.implementer || !completed(review.reviewer) || !completed(review.implementer))errors.push('Independent reviewer execution records missing or author reused');
 }
 const checks=review.checks||[];if(new Set(checks.map(c=>c.id)).size!==checks.length)errors.push('Duplicate criteria');
 const validPath=(p,allowed)=>typeof p==='string'&&!p.includes('..')&&!path.isAbsolute(p)&&allowed.some(x=>p.startsWith(x));
 const refs=new Set(req.references);
 const image=(p,sha,reference=false)=>{
  if(!validPath(p,reference?['docs/v2/references/','.twin/tasks/']:['docs/v2/reviews/','artifacts/v2-review/','.twin/tasks/','artifacts/hero-journey/']))return false;
  const f=path.join(root,p);if(!fs.existsSync(f))return false;
  const b=fs.readFileSync(f);
  const png=b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const jpg=b[0]===255&&b[1]===216&&b[2]===255;
  return b.length>1024&&(png||jpg)&&sha===digest(b);
 };
 for(const id of req.ids){
  const c=checks.find(x=>x.id===id);
  const knownCheck=preview && c?.status==='fix' && Array.isArray(c.defectIds) && c.defectIds.length && c.defectIds.every(d=>known.includes(d)&&review.blockingIssues.includes(d));
  if(!c||(c.status!=='pass'&&!knownCheck)){errors.push(id+': missing/pass required');continue;}
  if(!refs.has(c.referencePath)||!image(c.referencePath,c.referenceSha256,true))errors.push(id+': reference missing/hash mismatch');
  if(typeof c.observed!=='string'||c.observed.trim().length<40)errors.push(id+': concrete observation required');
  if(!Array.isArray(c.remaining)||(c.remaining.length&&!knownCheck))errors.push(id+': unresolved differences');
  if(!Array.isArray(c.evidence)||c.evidence.length<(id==='motion'?3:1))errors.push(id+': browser evidence required');
  else {if(id==='motion'&&new Set(c.evidence.map(x=>x.path)).size<3)errors.push(id+': three distinct frames required');
   for(const e of c.evidence){
    if(!image(e.path,e.sha256)||req.references.some(p=>fs.existsSync(path.join(root,p))&&digest(fs.readFileSync(path.join(root,p)))===e.sha256))errors.push(id+': invalid evidence or reference reused as browser shot');
    if(req.schemaVersion>=2 && (!Array.isArray(e.viewport)||e.viewport.length!==2||!e.viewport.every(n=>Number.isFinite(n)&&n>0)||typeof e.state!=='string'||!e.state.trim()))errors.push(id+': viewport/state required');
   }
  }
 }
 return errors;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const root=path.resolve(import.meta.dirname,'..'),req=read(root,'.twin/v2/visual-requirements.json');
  if(process.argv.includes('--fingerprint'))console.log(inputsFingerprint(root,req));
  else{
   const kind=process.argv.find(x=>x.startsWith('--release-kind='))?.split('=')[1];
   const {state,task,run}=candidate(root);
   const review=read(root,req.reviewPath || '.twin/v2/visual-review.json');
   const options=kind ? {kind,allowKnownDefects:task.publication.allowKnownDefects,acceptedDefects:task.publication.acceptedDefects} : {};
   const errors=[...(kind?publicationErrors(state,task,run,kind,root):[]),...validateReview(root,req,review,options)];
   if(kind && (run.runtimeFingerprint!==review.inputFingerprint || run.contractFingerprint!==review.contractFingerprint))errors.push('Run/review subject mismatch');
   if(errors.length)throw Error(errors.join('\n'));
   console.log('Evidence/freshness gate PASS; visual verdict: '+review.status+'; owner approval and deployment are separate');
  }
 }catch(e){console.error(e.message);process.exitCode=1;}
}
