import assert from 'node:assert/strict';
import {coverScale,parallaxAt} from './parallax-geometry.mjs';
for(const [w,h,x,y] of [[1440,900,0,28],[390,844,8,12],[800,600,32,0]]) {
 const s=coverScale(w,h,x,y);
 assert.ok((s-1)*w/2 >= x-1e-9 && (s-1)*h/2 >= y-1e-9);
}
assert.equal(coverScale(100,100,0,0),1);
assert.throws(()=>coverScale(0,100,1,1));
assert.throws(()=>coverScale(100,100,-1,1));
assert.equal(parallaxAt(.5,28,-28),0);
assert.equal(parallaxAt(0,28,-28),28);
assert.equal(parallaxAt(1,28,-28),-28);
assert.equal(parallaxAt(.8,28,-28,{reduced:true}),0);
assert.equal(parallaxAt(2,28,-28),-28);
console.log('Parallax geometry: coverage, boundaries, midpoint, reduced-motion passed; browser NOT RUN');
