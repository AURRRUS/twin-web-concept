import assert from 'node:assert/strict';
import {progressAt,phase,frameAt} from './scene-progress.mjs';
assert.equal(progressAt(0,100,2000,800),0);
assert.equal(progressAt(700,100,2000,800),.5);
assert.equal(progressAt(2000,100,2000,800),1);
assert.equal(progressAt(200,100,600,800),1);
assert.equal(progressAt(50,100,600,800),0);
assert.throws(()=>progressAt(NaN,0,1,0));
assert.throws(()=>phase(0,.5,.5));
assert.throws(()=>frameAt(.5,0));
for(const p of [0,.12,.3,.5,.9,1]) assert.deepEqual(frameAt(p,4),frameAt(p,4)); // frame depends only on current position
assert.equal(frameAt(1,4).index,3);
assert.equal(frameAt(1,4).image,1);
assert.equal(frameAt(.2,4).hold,true);
console.log('scene-progress: boundaries, zero travel, pure frame and final state passed; browser NOT RUN');
