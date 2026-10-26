import assert from 'node:assert/strict';
import {journeyStoryFrame,journeyTargets,localProgress} from '../src/lib/salesStoryFrame.mjs';
const intervals=[[.16,.31],[.445,.595],[.73,.88]];
for(let i=0;i<4;i++){const f=journeyStoryFrame(journeyTargets[i]);assert.equal(f.active,i);assert.equal(f.moving,false);}
for(const [a,b] of intervals){
 const earlier=journeyStoryFrame(a+(b-a)*.28),later=journeyStoryFrame(a+(b-a)*.78);
 assert.ok(earlier.titleIn>0);assert.equal(earlier.imageTransform,0);assert.ok(later.imageTransform>0);assert.ok(later.salesIn>0);
}
const snapshots=[];
for(let i=0;i<=1000;i++){
 const p=i/1000,f=journeyStoryFrame(p);snapshots.push(JSON.stringify(f));
 assert.ok(Number.isFinite(f.imageTransform));
 assert.equal(localProgress(900+p*3240,900,4140,900).toFixed(6),p.toFixed(6));
}
for(let i=1000;i>=0;i--)assert.equal(JSON.stringify(journeyStoryFrame(i/1000)),snapshots[i]);
console.log('PASS: four holds, cascade ordering, 1001 deterministic forward/reverse frames, geometry progress');
