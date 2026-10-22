const phase=(p:number,a:number,b:number)=>{const t=Math.max(0,Math.min(1,(p-a)/(b-a)));return t*t*(3-2*t);};
export function deliveryFrame(progress:number){
  const p=Math.max(0,Math.min(1,progress));
  return {lead:phase(p,0,.08),answer:phase(p,.08,.18),qualities:phase(p,.18,.30),edges:[phase(p,.18,.24),phase(p,.24,.30),phase(p,.30,.42)],model:phase(p,.42,.52),facts:phase(p,.18,.30),proof:phase(p,.42,.52),insert:phase(p,.72,.84),label:p<.78?'Эффектно':'Эффективно'};
}
