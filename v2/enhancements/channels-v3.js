/** Stable scroll geometry: mobile toolbar resize never rebuilds the track. */
function startChannels(){
 const track=document.querySelector('.r4-channels-track');if(!track)return;
 const root=track.querySelector('.r4-channels'),buttons=[...root.querySelectorAll('.r4-channel-nav button')];
 if(buttons.length!==4||track.dataset.scrollOwner==='v3')return;track.dataset.scrollOwner='v3';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let enabled=false,raf=0,auto=false,lastWidth=0,lastHeight=0;
 const travel=()=>Math.max(1,track.offsetHeight-root.offsetHeight);
 const paint=()=>{
  raf=0;if(!enabled||document.hidden)return;
  const p=Math.max(0,Math.min(1,-track.getBoundingClientRect().top/travel()));
  const index=Math.min(3,Math.floor(p*4));track.dataset.progress=p.toFixed(4);
  if(!buttons[index].hasAttribute('aria-current')){auto=true;buttons[index].click();auto=false;}
 };
 const request=()=>{if(!raf)raf=requestAnimationFrame(paint);};
 const layout=(force=false)=>{
  const phone=innerWidth<=767;
  if(!force&&innerWidth===lastWidth&&(phone||innerHeight===lastHeight)){request();return;}
  lastWidth=innerWidth;lastHeight=innerHeight;
  // Reflow only on actual width/orientation changes, never Safari toolbar changes.
  track.dataset.mobilePin='false';track.dataset.pin='false';
  const smallHeight=Math.min(innerHeight,document.documentElement.clientHeight||innerHeight);
  const fits=phone&&root.scrollHeight<=smallHeight-16;
  enabled=!reduced.matches&&((innerWidth>=1100&&innerHeight>=700)||fits);
  track.dataset.mobilePin=String(phone&&enabled);track.dataset.pin=String(enabled);request();
 };
 const jump=index=>{
  if(!enabled)return;
  const top=track.getBoundingClientRect().top+scrollY;
  // Phones jump directly to a stable state: no competing smooth-scroll inertia.
  scrollTo({top:top+travel()*((index+.5)/4),behavior:innerWidth<=767?'instant':'smooth'});
  request();
 };
 document.addEventListener('click',event=>{
  const a=event.target.closest?.('a[href="#channels"]');if(!a)return;
  event.preventDefault();history.pushState(null,'','#channels');
  track.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});
 });
 buttons.forEach((button,index)=>button.addEventListener('click',()=>{if(!auto)jump(index);}));
 root.querySelectorAll('.r4-stack-card').forEach((button,index)=>button.addEventListener('click',()=>jump(index)));
 addEventListener('scroll',request,{passive:true});
 addEventListener('resize',()=>layout(false),{passive:true});
 reduced.addEventListener('change',()=>layout(true));
 document.fonts.ready.then(()=>layout(true));layout(true);
}
startChannels();
