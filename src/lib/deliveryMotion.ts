const phase=(p:number,a:number,b:number)=>{const t=Math.max(0,Math.min(1,(p-a)/(b-a)));return t*t*(3-2*t);};
export function deliveryFrame(progress:number){
  const p=Math.max(0,Math.min(1,progress));
  return {lead:phase(p,0,.12),answer:phase(p,.08,.25),qualities:phase(p,.25,.45),edges:[phase(p,.15,.28),phase(p,.22,.35),phase(p,.30,.50)],model:phase(p,.30,.50),facts:phase(p,.15,.35),proof:phase(p,.30,.50),insert:phase(p,.64,.84),label:p<.74?'Эффектно':'Эффективно'};
}
