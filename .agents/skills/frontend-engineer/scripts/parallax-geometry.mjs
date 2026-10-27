/** Coverage helpers for a centered, unrotated rectangular background. */
export function coverScale(width,height,maxAbsX,maxAbsY) {
  if (![width,height,maxAbsX,maxAbsY].every(Number.isFinite) || width<=0 || height<=0 || maxAbsX<0 || maxAbsY<0) throw new RangeError('Positive viewport and nonnegative travel required');
  return Math.max(1+2*maxAbsX/width,1+2*maxAbsY/height);
}
export function parallaxAt(p,from,to,{reduced=false}={}) {
  if (![p,from,to].every(Number.isFinite)) throw new TypeError('Finite values required');
  return reduced ? 0 : from+(to-from)*Math.max(0,Math.min(1,p));
}
