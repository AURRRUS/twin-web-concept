const clamp=(x: number)=>Math.max(0,Math.min(1,x));
const phase=(p: number,a: number,b: number)=>{const t=clamp((p-a)/(b-a));return t*t*(3-2*t)};
export function deliveryFrame(progress: number){
  const p=clamp(progress);
  return {edges:[phase(p,0,.14),phase(p,.08,.24),phase(p,.20,.40)],model:phase(p,.16,.42),answer:phase(p,.32,.48),roll:phase(p,.45,.62),insert:phase(p,.75,.92),label:p<.535?'Качественно':p<.835?'Эффектно':'Эффективно'};
}
