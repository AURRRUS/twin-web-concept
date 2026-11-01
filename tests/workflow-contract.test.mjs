import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {checkWorkflow,validatePointers,validateContract} from '../scripts/workflow-check.mjs';
import {readJSON,readState,publicationErrors,releaseRun,sha256} from '../scripts/workflow-state.mjs';
import {inputsFingerprint,validateReview} from '../scripts/visual-gate-v2.mjs';
const root=path.resolve(import.meta.dirname,'..');
const fixture=()=>({state:readState(root),v1:readJSON(root,'.twin/project.json'),v2:readJSON(root,'.twin/v2/project.json'),task:readJSON(root,'.twin/tasks/VIS-005/task.json'),workflow:readJSON(root,'.twin/tasks/WF-001/task.json'),contract:readJSON(root,'.twin/tasks/VIS-005/visual-contract.json'),type:readJSON(root,'.twin/v2/typography.json'),run:readJSON(root,'.twin/tasks/VIS-005/run.json')});
const pointers=f=>validatePointers(f.state,f.v1,f.v2,f.task,f.workflow,f.state.workingBranch);
const contract=f=>validateContract(f.task,f.contract,f.type,f.run);
test('actual workflow files agree without marking the site accepted',()=>{assert.deepEqual(checkWorkflow(root),[]);assert.notEqual(fixture().run.stages.review.status,'done');});
test('reject stale task pointer and copied legacy registry',()=>{const f=fixture();f.state.siteCandidate.taskId='VIS-003';f.v2.activeTask='VIS-004';assert.equal(pointers(f).length,2);});
test('reject wrong branch and workflow authorization drift',()=>{const f=fixture();assert(validatePointers(f.state,f.v1,f.v2,f.task,f.workflow,'work/old').length);f.workflow.publication.allowed=true;assert(pointers(f).length);});
test('reject independent publication booleans',()=>{const f=fixture();f.contract.publication.allowed=false;assert(contract(f).some(e=>e.includes('publication mismatch')));});
test('reject old typography projection and missing inheritance',()=>{const f=fixture();f.contract.typeRoles[0].size=48;f.task.sources=[];assert(contract(f).some(e=>e.includes('Typography')));assert(contract(f).some(e=>e.includes('inheritance')));});
test('reject prose motion phases and timeline gaps',()=>{const f=fixture();f.contract.motion.contract.phases=['four phases'];assert(contract(f).some(e=>e.includes('motion')));const g=fixture();g.contract.motion.contract.phases[1].start+=.1;assert(contract(g).some(e=>e.includes('motion')));});
test('ready asset does not close the required assets stage',()=>{const f=fixture();f.run.stages.assets.status='done';f.run.assetJobs[0].status='ready';assert(contract(f).some(e=>e.includes('not accepted')));});
test('workflow cannot deploy and preview is not final acceptance',()=>{const f=fixture();assert(publicationErrors(f.state,f.task,f.run,'preview').some(e=>e.includes('scope')));f.state.workflowTask.publicationAllowed=true;f.run.targetStage='release';assert.deepEqual(publicationErrors(f.state,f.task,f.run,'preview'),[]);assert(publicationErrors(f.state,f.task,f.run,'final').some(e=>e.includes('owner acceptance')));});
test('release refuses prepare mode and nonexistent final evidence',()=>{const f=fixture();f.state.workflowTask.publicationAllowed=true;f.run.targetStage='release';f.state.workflowTask.mode='prepare';assert(publicationErrors(f.state,f.task,f.run,'preview').some(e=>e.includes('execute')));f.state.workflowTask.mode='execute';f.task.publication.kind='final';f.run.runtimeFingerprint='runtime';f.run.contractFingerprint='contract';f.run.ownerAcceptance={status:'approved',runtimeFingerprint:'runtime',contractFingerprint:'contract',evidence:['DOES-NOT-EXIST.md']};assert(publicationErrors(f.state,f.task,f.run,'final',root).some(e=>e.includes('owner acceptance')));});
test('run schema rejects prepare release and empty accepted output',()=>{const f=fixture();f.run.mode='prepare';f.run.targetStage='release';assert(contract(f).some(e=>e.includes('targetStage')));f.run.assetJobs[0].status='accepted';assert(contract(f).some(e=>e.includes('Accepted asset')));f.run.stages.brief.evidence=[];assert(contract(f).some(e=>e.includes('evidence')));});
test('candidate source branch is valid for CI while unrelated branch is not',()=>{const f=fixture();assert.deepEqual(validatePointers(f.state,f.v1,f.v2,f.task,f.workflow,f.state.siteCandidate.sourceBranch),[]);});
test('preview exempts only explicitly mapped known blocked assets, without changing production truth',()=>{
 const f=fixture(),before=JSON.stringify(f.run);
 const view=releaseRun(f.run,f.task,'preview');
 assert.equal(view.assetJobs[0].status,'skipped');assert.equal(view.stages.assets.status,'done');assert.equal(JSON.stringify(f.run),before);assert.equal(view.review.verdict,'fix');
 assert.equal(releaseRun(f.run,f.task,'final').assetJobs[0].status,'blocked');
 f.run.assetJobs.push({id:'new-required-job',required:true,status:'blocked',defectIds:['NEW']});
 const more=releaseRun(f.run,f.task,'preview');assert.equal(more.assetJobs[1].status,'blocked');assert.equal(more.stages.assets.status,'blocked');
 f.task.publication.acceptedDefects=[];assert.equal(releaseRun(f.run,f.task,'preview').assetJobs[0].status,'blocked');
});
test('v2 review binds actual runtime, contract, real independent records and viewport',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'wf-review-'));
 try{
  execFileSync('git',['init','-q'],{cwd:dir});
  const write=(p,b)=>{fs.mkdirSync(path.dirname(path.join(dir,p)),{recursive:true});fs.writeFileSync(path.join(dir,p),b);};
  write('src/current.ts','export const current=1');write('contract.json','{}');write('worker.md','Worker result');write('reviewer.md','Reviewer result');
  const ref=Buffer.concat([Buffer.from([255,216,255]),Buffer.alloc(2048,1)]),shot=Buffer.concat([Buffer.from([255,216,255]),Buffer.alloc(2048,2)]);
  write('docs/v2/references/a.jpg',ref);write('artifacts/v2-review/a.jpg',shot);
  const req={schemaVersion:2,ids:['hero'],references:['docs/v2/references/a.jpg'],inputPrefixes:['src/'],inputPaths:[],contractPath:'contract.json'};
  const r={status:'pass',reviewer:'agent-reviewer',implementer:'agent-worker',independent:true,agents:[{id:'agent-worker',status:'completed',evidence:['worker.md']},{id:'agent-reviewer',status:'completed',evidence:['reviewer.md']}],inputFingerprint:inputsFingerprint(dir,req),contractFingerprint:sha256('{}'),blockingIssues:[],checks:[{id:'hero',status:'pass',referencePath:req.references[0],referenceSha256:sha256(ref),observed:'Concrete visual comparison of heading, geometry and media at the same viewport.',remaining:[],evidence:[{path:'artifacts/v2-review/a.jpg',sha256:sha256(shot),viewport:[1440,900],state:'initial'}]}]};
  assert.deepEqual(validateReview(dir,req,r),[]);
  assert(validateReview(dir,req,{...r,reviewer:r.implementer}).some(e=>e.includes('Independent')));
  const noViewport=structuredClone(r);delete noViewport.checks[0].evidence[0].viewport;assert(validateReview(dir,req,noViewport).some(e=>e.includes('viewport')));
  write('src/current.ts','export const current=2');assert(validateReview(dir,req,r).some(e=>e.includes('runtime')));
  r.inputFingerprint=inputsFingerprint(dir,req);write('contract.json','{"new":1}');assert(validateReview(dir,req,r).some(e=>e.includes('contract')));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('preview exception covers only explicitly listed defects and keeps the fix verdict',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'wf-preview-'));
 try{
  execFileSync('git',['init','-q'],{cwd:dir});fs.mkdirSync(path.join(dir,'src'));fs.writeFileSync(path.join(dir,'src/a'),'a');
  const req={ids:[],references:[],inputPrefixes:['src/'],inputPaths:[]};
  const r={status:'fix',reviewer:'independent reviewer',blockingIssues:['MASK'],checks:[],inputFingerprint:inputsFingerprint(dir,req)};
  assert(validateReview(dir,req,r).length);
  assert.deepEqual(validateReview(dir,req,r,{kind:'preview',allowKnownDefects:true,acceptedDefects:['MASK']}),[]);
  assert(validateReview(dir,req,r,{kind:'preview',allowKnownDefects:true,acceptedDefects:['OTHER']}).length);
  assert.equal(r.status,'fix');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
