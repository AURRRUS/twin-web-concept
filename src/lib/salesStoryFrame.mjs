import motion from './salesStoryMotion.json' with {type:'json'};
export const clamp=v=>Math.max(0,Math.min(1,v));
export const phase=(p,a,b)=>{const t=clamp((p-a)/(b-a));return t*t*(3-2*t)};
function base(p,ranges,reads,navAt){p=clamp(p);let from=0;for(let i=0;i<ranges.length;i++){const[a,b]=ranges[i];if(p<a)break;if(p<=b){const t=clamp((p-a)/(b-a));return{p,from:i,to:i+1,t,moving:true,active:t>=navAt?i+1:i}}from=i+1}return{p,from,to:from,t:1,moving:false,active:from}}
export const journeyTargets=motion.journey.nav_targets;
export const channelTargets=motion.channels.nav_targets_svh.map(p=>p/300);
export function journeyStoryFrame(p){const m=motion.journey,f=base(p,m.transition_intervals,m.read_intervals,m.transition_local.nav_active_at),v=m.transition_local;const q=k=>f.moving?phase(f.t,...v[k]):1;return{...f,titleOut:q('title_out'),titleIn:q('title_in'),questionOut:q('question_out'),questionIn:q('question_in'),salesOut:q('sales_out'),salesIn:q('sales_in'),oldOpacity:f.moving?1-q('image_out_opacity'):1,newOpacity:f.moving?q('image_in_opacity'):0,imageTransform:q('image_in_transform')}}
export function channelStoryFrame(p){const m=motion.channels,f=base(p,[[45/300,85/300],[130/300,170/300],[215/300,255/300]],[],.6),v=m.transition_local;const q=k=>f.moving?phase(f.t,...v[k]):1;return{...f,textOut:q('old_text_out'),titleIn:q('new_title_in'),bodyIn:q('new_body_in'),photo:q('photo_in')}}
export function qualityStoryFrame(p){return Object.fromEntries(Object.entries(motion.delivery.phases).map(([k,[a,b]])=>[k,phase(p,a,b)]))}
