import motion from './journeyV456Motion.json' with {type:'json'};
export const clamp=x=>Math.max(0,Math.min(1,x));
export const smoothstep=x=>{const v=clamp(x);return v*v*(3-2*v);};
const phase=(t,[a,b])=>smoothstep((t-a)/(b-a));
export const navTargets=motion.nav_progress;
export function journeyV456Frame(progress){
 const p=clamp(progress);let from=3,to=3,t=0,moving=false;
 for(let i=0;i<3;i++){const[a,b]=motion.transition_intervals[i];if(p<a){from=to=i;break;}if(p<b){from=i;to=i+1;t=(p-a)/(b-a);moving=true;break;}}
 const active=moving&&t>=.5?to:from,[a,b]=motion.read_intervals[active],s=motion.transition_local;
 return{p,from,to,t,moving,active,read:clamp((p-a)/(b-a)),travel:smoothstep(t),headingOut:moving?phase(t,s.heading_out):0,headingIn:moving?phase(t,s.heading_in):1,bodyOut:moving?phase(t,s.description_out):0,bodyIn:moving?phase(t,s.description_in):1,image:moving?phase(t,s.image):1};
}
export function horizontalTargets(widths,offsets,viewport,scrollWidth){const end=Math.max(0,scrollWidth-viewport);return offsets.map((x,i)=>i===widths.length-1?-end:-Math.min(end,x));}
