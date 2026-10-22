import assert from 'node:assert/strict';
import {journeyFrame} from '../src/lib/journeyFrameV3.mjs';
let maxDelta=0;
for(let i=0;i<=10000;i++){
 const p=i/10000,f=journeyFrame(p);
 for(const key of ['titleOpacity','bodyOpacity','mediaOpacity'])for(const n of f[key])assert(n>=0&&n<=1&&Number.isFinite(n));
 assert(Math.abs(f.titleOpacity.reduce((a,b)=>a+b,0)-1)<1e-9,'title blank/overbright');
 assert(Math.abs(f.bodyOpacity.reduce((a,b)=>a+b,0)-1)<1e-9,'body blank/overbright');
 assert(Math.max(...f.titleOpacity)>=.5&&Math.max(...f.bodyOpacity)>=.5);
 assert(f.mediaOpacity[0]===1,'base media must remain present');
 assert(f.mediaScale.every(n=>n>=1&&n<=1.08));
 assert.deepEqual(f,journeyFrame(p));
 if(i){const prev=journeyFrame((i-1)/10000);for(const key of ['titleOpacity','bodyOpacity','mediaOpacity'])for(let j=0;j<3;j++)maxDelta=Math.max(maxDelta,Math.abs(prev[key][j]-f[key][j]));}
}
for(const [p,index] of [[.1,0],[.525,1],[.925,2]])assert.equal(journeyFrame(p).titleOpacity[index],1);
for(const p of [.205,.224,.237,.281,.31,.38,.44,.605,.624,.637,.681,.71,.78,.84]){
 const expected=journeyFrame(p);journeyFrame(.99);journeyFrame(.01);assert.deepEqual(journeyFrame(p),expected);
}
assert(maxDelta<.01,'discontinuous frame');
console.log(JSON.stringify({samples:10001,noBlankText:true,baseMediaPresent:true,bounds:true,deterministicReverse:true,maxOpacityStep:maxDelta},null,2));
