import test from 'node:test';
import assert from 'node:assert/strict';
import {openingTravel, openingFrame, holdTarget} from '../src/lib/openingJourneyFrame.mjs';
test('holds have usable reading distance and nav lands in every stable state',()=>{
 assert.equal(openingTravel(900),3780);assert.equal(openingTravel(768),3226);
 assert.equal(openingTravel(320),2800);assert.equal(openingTravel(2000),4600);
 for(let i=0;i<4;i++){const f=openingFrame(holdTarget(i));assert.equal(f.active,i);assert.equal(f.phase,'hold');assert.equal(f.copyOpacity,1);}
 assert.equal(openingFrame(900/openingTravel(900)).active,0);
});
test('midpoints, reverse and arbitrary visits reproduce the same frame',()=>{
 for(const p of [0,.249,.25,.27,.31,.5,.52,.75,.78,1]){const f=openingFrame(p);openingFrame(1);openingFrame(0);assert.deepEqual(openingFrame(p),f);assert(f.q>=0&&f.q<=1);}
 assert.equal(openingFrame(-1).active,0);assert.equal(openingFrame(10).active,3);assert.equal(openingFrame(.25).from,0);assert.equal(openingFrame(.25).to,1);assert.equal(openingFrame(.25).q,0);
});
test('text is fully faded at each semantic switch without a midpoint pop',()=>{
 for(let index=1;index<4;index++){
  const midpoint=index/4+.5/21;
  assert(openingFrame(midpoint).copyOpacity<1e-9);
  assert(openingFrame(midpoint-1e-7).copyOpacity<1e-3);
  assert(openingFrame(midpoint+1e-7).copyOpacity<1e-3);
 }
});
