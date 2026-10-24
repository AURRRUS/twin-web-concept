const phase=(p:number,a:number,b:number)=>{const t=Math.max(0,Math.min(1,(p-a)/(b-a)));return t*t*(3-2*t);};
/** Ordered phases of the monotonic native-scroll disclosure. */
export function deliveryFrame(progress:number){
 const p=Math.max(0,Math.min(1,progress));
 return {lead:phase(p,0,.10),answer:phase(p,.08,.25),qualities:phase(p,.20,.34),edges:[phase(p,.32,.50),phase(p,.50,.66),phase(p,.66,.80)],model:phase(p,.80,.90),facts:phase(p,.80,.90),proof:phase(p,.90,.96),insert:phase(p,.96,1),label:p<.98?'Эффектно':'Эффективно'};
}
