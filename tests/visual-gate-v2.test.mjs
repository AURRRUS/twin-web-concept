import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
import {inputsFingerprint,validateReview} from '../scripts/visual-gate-v2.mjs';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
test('review gate rejects blocked/stale/missing/substituted evidence and accepts complete provenance',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'tv2-gate-'));
 try{
 execFileSync('git',['init','-q'],{cwd:root});const write=(p,b)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),b)};
 write('src/a.ts','const a=1;');
 const req={ids:['hero'],references:['docs/v2/references/a.jpg'],inputPrefixes:['src/'],inputPaths:[]};
 const ref=Buffer.concat([Buffer.from([255,216,255]),Buffer.alloc(2048,1)]);
 const shot=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),Buffer.alloc(2048,2)]);
 write(req.references[0],ref);write('docs/v2/reviews/a.png',shot);
 const review={status:'pass',reviewer:'frontend reviewer',blockingIssues:[],inputFingerprint:inputsFingerprint(root,req),checks:[{id:'hero',status:'pass',referencePath:req.references[0],referenceSha256:hash(ref),observed:'Heading and media boundaries reviewed at equal viewport; target geometry matches.',remaining:[],evidence:[{path:'docs/v2/reviews/a.png',sha256:hash(shot)}]}]};
 assert.deepEqual(validateReview(root,req,review),[]);
 assert(validateReview(root,req,{...review,status:'blocked'}).length);
 write('src/a.ts','const a=2;');assert(validateReview(root,req,review).some(x=>x.includes('stale')));
 review.inputFingerprint=inputsFingerprint(root,req);
 fs.unlinkSync(path.join(root,'docs/v2/reviews/a.png'));assert(validateReview(root,req,review).length);
 write('docs/v2/reviews/a.png',ref);review.checks[0].evidence[0].sha256=hash(ref);assert(validateReview(root,req,review).some(x=>x.includes('reference reused')));
 write('docs/v2/reviews/a.png',shot);review.checks[0].evidence[0].sha256=hash(shot);
 review.checks[0].remaining=['overlap'];assert(validateReview(root,req,review).some(x=>x.includes('unresolved')));
 }finally{fs.rmSync(root,{recursive:true,force:true})}
});
