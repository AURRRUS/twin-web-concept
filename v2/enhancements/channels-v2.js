/** Channel scene: scroll position owns selection, buttons remain direct access. */
function startChannels(){
 const track=document.querySelector('.r4-channels-track');if(!track)return;
 const island=track.closest('astro-island');if(island?.hasAttribute('ssr')){requestAnimationFrame(startChannels);return;}
 const root=track.querySelector('.r4-channels');const buttons=[...root.querySelectorAll('.r4-channel-nav button')];
 if(buttons.length!==4)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let enabled=false,raf=0,auto=false,manualUntil=0;
 const paint=()=>{raf=0;if(!enabled||document.hidden||performance.now()<manualUntil)return;const travel=Math.max(1,track.offsetHeight-innerHeight);const p=Math.max(0,Math.min(1,-track.getBoundingClientRect().top/travel));const index=Math.min(3,Math.floor(p*4));track.dataset.progress=p.toFixed(4);if(!buttons[index].hasAttribute('aria-current')){auto=true;buttons[index].click();auto=false;}};
 const request=()=>{if(!raf)raf=requestAnimationFrame(paint);};
 const layout=()=>{
 const phone=innerWidth<=767;
 // Measure the natural compact scene, then pin only if the whole scene fits.
 track.dataset.mobilePin='false';
 const fits=phone&&root.scrollHeight<=innerHeight-16;
 enabled=!reduced.matches&&((innerWidth>=1100&&innerHeight>=700)||fits);
 track.dataset.mobilePin=String(phone&&enabled);
 track.dataset.pin=String(enabled);
 request();
};
 const jump=index=>{if(!enabled)return;manualUntil=performance.now()+650;const top=track.getBoundingClientRect().top+scrollY;const travel=track.offsetHeight-innerHeight;window.scrollTo({top:top+travel*((index+.35)/4),behavior:'smooth'});};
 buttons.forEach((button,index)=>button.addEventListener('click',()=>{if(!auto)jump(index);}));
 // Back cards remain an alternative pointer target, without duplicate text headers.
 root.querySelectorAll('.r4-stack-card').forEach((button,index)=>button.addEventListener('click',()=>jump(index)));
 window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',layout);reduced.addEventListener('change',layout);document.fonts.ready.then(layout);layout();
}
startChannels();
