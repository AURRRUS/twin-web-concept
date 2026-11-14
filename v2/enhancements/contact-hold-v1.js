/** Native sticky contact stop. No wheel/touch interception. */
const contact=document.getElementById('contact'),surface=contact?.closest('.r4-contact');
if(contact&&surface){
 let track=surface.parentElement;
 if(!track.classList.contains('r4-contact-track')){
  track=document.createElement('div');track.className='r4-contact-track';
  surface.before(track);track.append(surface);
 }
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const layout=()=>{
  const hold=innerWidth>=1100&&innerHeight>=700&&!reduced.matches;
  track.dataset.hold=String(hold);
  track.style.setProperty('--contact-view',innerHeight+'px');
  contact.style.scrollMarginTop=Math.max(0,contact.getBoundingClientRect().top-surface.getBoundingClientRect().top)+'px';
 };
 addEventListener('resize',layout,{passive:true});reduced.addEventListener('change',layout);layout();
 document.fonts.ready.then(layout);
 document.addEventListener('click',event=>{
  const a=event.target.closest?.('a[href="#contact"]');if(!a)return;
  event.preventDefault();history.pushState(null,'','#contact');
  track.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});
 });
}
