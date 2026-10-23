const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{const t=clamp(x);return t*t*(3-2*t);};
export const channelReads=[[0,45],[85,130],[170,215],[255,300]];
export const channelTargets=channelReads.map(([a,b])=>(a+b)/2/300);
export function channelFrame(progress,height){
 const travel=clamp(progress)*300,entries=[1,...[45,130,215].map(a=>smooth((travel-a)/40))];
 const y=entries.map((entry,i)=>(i===0?0:(height+32)*(1-entry))-16*Math.min(2,entries.slice(i+1).reduce((a,b)=>a+b,0)));
 const scale=entries.map((_,i)=>1-.04*Math.min(2,entries.slice(i+1).reduce((a,b)=>a+b,0)));
 let active=0;for(let i=1;i<4;i++)if(entries[i]>=.6)active=i;
 return{y,scale,active,entries};
}
