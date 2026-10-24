import {journeyFrame,journeyStops} from './journeyFrameV3.mjs';
/** Reuse the approved frame/stops. Complementary masks keep text present between phases. */
export function comparisonFrame(p){
 const f=journeyFrame(p);let marker=f.active;
 for(let i=0;i<3;i++){const a=journeyStops[i][1],b=journeyStops[i+1][0];if(p<a||p>=b)continue;const q=(p-a)/(b-a);marker=q>=.08?i+1:i;
  f.titleClipBottom[i]=100-f.titleClipTop[i+1];f.titleOpacity[i]=f.titleClipTop[i+1]>0?1:0;
  f.bodyClipBottom[i]=100-f.bodyClipTop[i+1];f.bodyOpacity[i]=f.bodyClipTop[i+1]>0?1:0;
 }
 return{...f,marker};
}
