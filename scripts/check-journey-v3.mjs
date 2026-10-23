import assert from 'node:assert/strict';
import{journeyFrame}from'../src/lib/journeyFrameV3.mjs';
for(let i=0;i<=10000;i++){
 const p=i/10000,f=journeyFrame(p);
 for(const role of['title','body']){const opacity=f[role+'Opacity'],top=f[role+'ClipTop'],bottom=f[role+'ClipBottom'];const bands=opacity.map((o,j)=>o?{top:top[j]/100,bottom:1-bottom[j]/100}:null).filter(Boolean).sort((a,b)=>a.top-b.top);assert(Math.abs(bands.reduce((sum,n)=>sum+Math.max(0,n.bottom-n.top),0)-1)<1e-8);for(let j=1;j<bands.length;j++)assert(bands[j-1].bottom<=bands[j].top+1e-8);assert(opacity.every(n=>n===0||n===1));}
 assert.equal(f.mediaOpacity[0],1);assert(f.mediaScale.every(n=>n>=1&&n<=1.08));assert(f.mediaY.every(n=>n>=-32&&n<=0));assert.deepEqual(f,journeyFrame(p));
}
console.log(JSON.stringify({samples:10001,maskedReplacement:true,noOverlappingText:true,noBlankText:true,baseMediaPresent:true,deterministicReverse:true},null,2));
