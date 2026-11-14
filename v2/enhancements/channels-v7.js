/** Stable scroll geometry: mobile toolbar resize never rebuilds the track. */
function startChannels(){
 const track=document.querySelector('.r4-channels-track');if(!track)return;
 const root=track.querySelector('.r4-channels'),buttons=[...root.querySelectorAll('.r4-channel-nav button')];
 if(buttons.length!==4||track.dataset.scrollOwner==='v7')return;track.dataset.scrollOwner='v7';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let enabled=false,raf=0,auto=false,lastWidth=0,lastHeight=0,phoneIndex=null,suppressClickUntil=0,releasing=false;
 const anchor=index=>index===0?0:index===3?1:(index+.5)/4;
 const travel=()=>Math.max(1,track.offsetHeight-root.offsetHeight);
 const paint=()=>{
  raf=0;if(!enabled||document.hidden)return;
  const p=Math.max(0,Math.min(1,-track.getBoundingClientRect().top/travel()));
  let index=Math.min(3,Math.floor(p*4));
  if(innerWidth<=767&&!releasing){
   const r=track.getBoundingClientRect();
   const inside=r.top<=1&&r.bottom>=root.offsetHeight-1;
   if(inside){
    if(phoneIndex===null)phoneIndex=p<.5?0:3;
    index=phoneIndex;
    // Cancel residual native momentum: only an explicit gesture changes state.
    const target=track.getBoundingClientRect().top+scrollY+travel()*anchor(index);
    if(Math.abs(scrollY-target)>1)scrollTo({top:target,behavior:'instant'});
   }else phoneIndex=null;
  }
  if(releasing){
   const r=track.getBoundingClientRect();
   if(r.top>1||r.bottom<=root.offsetHeight-1){releasing=false;phoneIndex=null;}
   index=Math.max(0,buttons.findIndex(b=>b.hasAttribute('aria-current')));
  }
  track.dataset.progress=p.toFixed(4);
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
  const fits=phone&&smallHeight>=560;
  enabled=!reduced.matches&&((innerWidth>=1100&&innerHeight>=700)||fits);
  track.dataset.mobilePin=String(phone&&enabled);track.dataset.pin=String(enabled);request();
 };
 const jump=index=>{
  if(!enabled)return;
  releasing=false;
  if(innerWidth<=767)phoneIndex=index;
  const top=track.getBoundingClientRect().top+scrollY;
  // Phones jump directly to a stable state: no competing smooth-scroll inertia.
  scrollTo({top:top+travel()*anchor(index),behavior:innerWidth<=767?'instant':'smooth'});
  request();
 };

 // A phone gesture owns exactly one step. Native scrolling outside this scene.
 const phoneMode=()=>enabled&&innerWidth<=767;
 const atStage=()=>{
  const r=track.getBoundingClientRect(),s=root.getBoundingClientRect();
  return !releasing&&phoneMode()&&r.top<=1&&r.bottom>=root.offsetHeight-1&&Math.abs(s.top)<=2;
 };
 const currentIndex=()=>phoneIndex??Math.max(0,buttons.findIndex(b=>b.hasAttribute('aria-current')));
 const step=direction=>{
  const index=currentIndex(),next=index+direction;
  if(next>=0&&next<4){jump(next);return;}
  // Boundary exit is native: no destination, distance or scroll animation.
  phoneIndex=null;releasing=true;
 };
 let gesture=null,wheelTotal=0,wheelDone=false,wheelIdle=0;
 root.addEventListener('touchstart',event=>{
  gesture=event.touches.length===1&&atStage()
   ?{x:event.touches[0].clientX,y:event.touches[0].clientY,dx:0,dy:0}:null;
 },{passive:true});
 root.addEventListener('touchmove',event=>{
  if(!gesture||event.touches.length!==1){gesture=null;return;}
  gesture.dx=gesture.x-event.touches[0].clientX;
  gesture.dy=gesture.y-event.touches[0].clientY;
  const boundary=(currentIndex()===3&&gesture.dy>8)||(currentIndex()===0&&gesture.dy< -8);
  if(boundary&&Math.abs(gesture.dy)>Math.abs(gesture.dx)){
   phoneIndex=null;releasing=true;gesture=null;return;
  }
  if(Math.abs(gesture.dy)>Math.abs(gesture.dx)&&event.cancelable)event.preventDefault();
 },{passive:false});
 root.addEventListener('touchend',()=>{
  if(!gesture)return;
  const g=gesture;gesture=null;
  if(Math.abs(g.dy)>12)suppressClickUntil=performance.now()+550;
  const threshold=Math.max(72,Math.min(112,root.offsetHeight*.12));
  if(Math.abs(g.dy)>=threshold&&Math.abs(g.dy)>Math.abs(g.dx)*1.2)step(g.dy>0?1:-1);
 },{passive:true});
 root.addEventListener('touchcancel',()=>{gesture=null;},{passive:true});
 root.addEventListener('wheel',event=>{
  if(event.ctrlKey||!atStage()||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
  if(wheelDone){
   event.preventDefault();clearTimeout(wheelIdle);
   wheelIdle=setTimeout(()=>{wheelTotal=0;wheelDone=false;},450);return;
  }
  const boundary=(currentIndex()===3&&event.deltaY>0)||(currentIndex()===0&&event.deltaY<0);
  if(boundary){phoneIndex=null;releasing=true;return;}
  event.preventDefault();
  clearTimeout(wheelIdle);
  wheelIdle=setTimeout(()=>{wheelTotal=0;wheelDone=false;},450);
  if(wheelDone)return;
  wheelTotal+=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?root.offsetHeight:1);
  if(Math.abs(wheelTotal)>=120){wheelDone=true;step(wheelTotal>0?1:-1);}
 },{passive:false});

 root.addEventListener('click',event=>{
  if(!auto&&performance.now()<suppressClickUntil){event.preventDefault();event.stopImmediatePropagation();}
 },true);
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
