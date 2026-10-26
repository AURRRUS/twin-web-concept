export const journeyHolds = [[0,.16],[.31,.445],[.595,.73],[.88,1]];
export const journeyStops = journeyHolds.map(([a,b])=>(a+b)/2);
export const clamp01 = x => Math.max(0,Math.min(1,x));
// Evaluate cubic-bezier(.22,1,.36,1) from absolute progress, including reverse.
export function phase(u,a,b){
 const x=clamp01((u-a)/(b-a));if(x===0||x===1)return x;
 let low=0,high=1;for(let i=0;i<18;i++){const t=(low+high)/2,v=3*.22*(1-t)*(1-t)*t+3*.36*(1-t)*t*t+t*t*t;if(v<x)low=t;else high=t;}
 return 1-(1-(low+high)/2)**3;
}
export function transitionFrame(from,to,u){
 u=clamp01(u);const same=from===to;const w=same?1:phase(u,.12,.68);
 return {from,to,u,weights:Array.from({length:4},(_,i)=>same?(i===to?1:0):i===from?1-w:i===to?w:0),
 oldText:same?0:1-phase(u,0,.18),newTitle:same?1:phase(u,.20,.55),newText:same?1:phase(u,.65,1),image:same?1:phase(u,.28,.88),active:same?to:w<.5?from:to};
}
export function journeyFrame(p){
 p=clamp01(p);for(let i=0;i<4;i++){
 if(p<=journeyHolds[i][1]||i===3)return transitionFrame(i,i,1);
 if(p<journeyHolds[i+1][0])return transitionFrame(i,i+1,(p-journeyHolds[i][1])/(journeyHolds[i+1][0]-journeyHolds[i][1]));
 }return transitionFrame(3,3,1);
}
export const scrollProgress=(scroll,top,height,panel)=>clamp01((scroll-top)/Math.max(1,height-panel));
