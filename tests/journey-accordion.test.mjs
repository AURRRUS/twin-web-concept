import test from 'node:test';
import assert from 'node:assert/strict';
import {journeyFrame,journeyHolds,journeyStops,transitionFrame,scrollProgress} from '../src/lib/journeyAccordionFrame.mjs';
test('every reading stop shows one complete scene with stable text and image',()=>{
 journeyStops.forEach((p,i)=>{const f=journeyFrame(p);assert.equal(f.active,i);assert.equal(f.weights[i],1);assert.equal(f.newText,1);assert.equal(f.image,1);assert.equal(f.from,f.to);});
});
test('all forward and reverse samples preserve a complete accordion and hide overlapping text',()=>{
 for(let n=0;n<=1000;n++){const f=journeyFrame(n/1000);assert.ok(Math.abs(f.weights.reduce((a,b)=>a+b,0)-1)<1e-9);assert.ok(f.weights.every(w=>w>=0&&w<=1));assert.ok(f.image>=0&&f.image<=1);if(f.from!==f.to)assert.ok(!(f.oldText>.01&&f.newTitle>.01));assert.deepEqual(journeyFrame(n/1000),f);}
});
test('reverse and re-entry do not depend on the previously painted scene',()=>{
 const f=journeyFrame(.247);journeyFrame(.99);journeyFrame(0);assert.deepEqual(journeyFrame(.247),f);
});
test('direct scene changes are possible without visiting intermediate modes',()=>{
 const mid=transitionFrame(0,3,.5);assert.equal(mid.weights[1],0);assert.equal(mid.weights[2],0);assert.equal(transitionFrame(0,3,1).active,3);
});
test('scroll geometry clamps outside the track without dependence on wheel counts',()=>{
 assert.equal(scrollProgress(0,900,4600,1000),0);assert.equal(scrollProgress(4500,900,4600,1000),1);assert.equal(scrollProgress(2700,900,4600,1000),.5);assert.ok(Number.isFinite(scrollProgress(900,900,1000,1000)));
});
test('all hold boundaries are continuous',()=>{
 for(const [a,b]of journeyHolds)for(const p of [a,b]){const before=journeyFrame(Math.max(0,p-1e-6)),after=journeyFrame(Math.min(1,p+1e-6));assert.ok(before.weights.every((w,i)=>Math.abs(w-after.weights[i])<1e-6));}
});
