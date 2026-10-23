const phase=(p:number,a:number,b:number)=>{const t=Math.max(0,Math.min(1,(p-a)/(b-a)));return t*t*(3-2*t);};
/** Ordered phases of the monotonic native-scroll disclosure. */
export function deliveryFrame(progress:number){
 const p=Math.max(0,Math.min(1,progress));
 return {lead:phase(p,0,.10),answer:phase(p,.08,.25),qualities:phase(p,.20,.34),edges:[phase(p,.30,.38),phase(p,.38,.46),phase(p,.46,.54)],model:phase(p,.54,.70),facts:phase(p,.54,.70),proof:phase(p,.70,.84),insert:phase(p,.86,1),label:p<.93?'Эффектно':'Эффективно'};
}
