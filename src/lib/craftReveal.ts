/** Add data-craft-reveal and optional data-craft-delay (0..220 ms) to leaf groups. */
export function initCraftReveals(root: Document = document){
  const nodes=[...root.querySelectorAll<HTMLElement>('[data-craft-reveal]')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const animations=new Map<HTMLElement, Animation>();let observer: IntersectionObserver | undefined;
  const reveal=(node: HTMLElement)=>{
    if(!node.hasAttribute('data-craft-waiting'))return;
    const delay=Math.min(220,Math.max(0,Number(node.dataset.craftDelay)||0));
    node.removeAttribute('data-craft-waiting');observer?.unobserve(node);
    if(reduced.matches)return;
    const a=node.animate([{opacity:0,transform:'translate3d(0,20px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:800,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
    animations.set(node,a);a.finished.catch(()=>{}).finally(()=>{if(animations.get(node)===a)animations.delete(node)});
  };
  if(!reduced.matches&&'IntersectionObserver'in window&&typeof Element.prototype.animate==='function'){
    observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)reveal(e.target as HTMLElement)}),{rootMargin:'0px 0px -12% 0px',threshold:0});
    nodes.forEach(node=>{if(node.getBoundingClientRect().top>=innerHeight){node.setAttribute('data-craft-waiting','');observer?.observe(node)}});
  }
  const focus=(e: Event)=>{for(const node of nodes)if(node.contains(e.target as Node)){reveal(node);animations.get(node)?.cancel();animations.delete(node)}};
  const settle=()=>{if(reduced.matches){observer?.disconnect();nodes.forEach(n=>n.removeAttribute('data-craft-waiting'));animations.forEach(a=>a.cancel());animations.clear()}};
  root.addEventListener('focusin',focus);reduced.addEventListener('change',settle);
  return()=>{observer?.disconnect();root.removeEventListener('focusin',focus);reduced.removeEventListener('change',settle);animations.forEach(a=>a.cancel());nodes.forEach(n=>n.removeAttribute('data-craft-waiting'))};
}
