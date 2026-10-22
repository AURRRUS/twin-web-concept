/** Add data-craft-reveal and optional data-craft-delay (0..320 ms) to leaf groups. */
export function initCraftReveals(root: Document = document){
  const nodes=[...root.querySelectorAll<HTMLElement>('[data-craft-reveal]')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const animations=new Map<HTMLElement, Animation>();let observer: IntersectionObserver | undefined;
  const reveal=(node: HTMLElement)=>{
    if(!node.hasAttribute('data-craft-waiting'))return;
    const delay=Math.min(320,Math.max(0,Number(node.dataset.craftDelay)||0));
    node.removeAttribute('data-craft-waiting');observer?.unobserve(node);
    if(reduced.matches)return;
    const role = node.dataset.craftReveal;
    const targetOpacity = parseFloat(getComputedStyle(node).opacity) || 1;
    const y = role === 'product-title' ? 24 : role === 'product-body' ? 12 : role === 'workspace' ? 24 : role === 'composition-core' ? 16 : 20;
    const duration = role === 'workspace' || role === 'channel-mask' ? 900 : role === 'contact-copy' ? 720 : role === 'contact-form' ? 840 : 800;
    const frames: Keyframe[] = role === 'channel-mask'
      ? [{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)'}]
      : role === 'product-title'
      ? [{opacity:0,clipPath:'inset(100% 0 0 0)',transform:`translate3d(0,${y}px,0)`},{opacity:targetOpacity,clipPath:'inset(0% 0 0 0)',transform:'translate3d(0,0,0)'}]
      : [{opacity:0,transform:`translate3d(0,${y}px,0)`},{opacity:targetOpacity,transform:'translate3d(0,0,0)'}];
    const a=node.animate(frames,{duration,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
    animations.set(node,a);a.finished.catch(()=>{}).finally(()=>{if(animations.get(node)===a)animations.delete(node)});
  };
  const revealGroup = (node: HTMLElement) => { reveal(node); if (node.dataset.craftPair) for(const sibling of nodes)if(sibling!==node&&sibling.dataset.craftPair===node.dataset.craftPair) reveal(sibling); };
  if(!reduced.matches&&'IntersectionObserver'in window&&typeof Element.prototype.animate==='function'){
    observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)revealGroup(e.target as HTMLElement)}),{rootMargin:'0px 0px -15% 0px',threshold:0});
    nodes.forEach(node=>{if(node.getBoundingClientRect().top>=innerHeight){node.setAttribute('data-craft-waiting','');if (!(node instanceof SVGElement && node.dataset.craftPair)) observer?.observe(node)}});
  }
  const focus=(e: Event)=>{for(const node of nodes)if(node.contains(e.target as Node)){revealGroup(node);for(const sibling of nodes)if(sibling===node||(node.dataset.craftPair&&sibling.dataset.craftPair===node.dataset.craftPair)){animations.get(sibling)?.cancel();animations.delete(sibling)}}};
  const settle=()=>{if(reduced.matches){observer?.disconnect();nodes.forEach(n=>n.removeAttribute('data-craft-waiting'));animations.forEach(a=>a.cancel());animations.clear()}};
  const anchor = () => { let id = location.hash.slice(1); try { id = decodeURIComponent(id); } catch { /* Malformed anchors do not hide the page. */ } const target = document.getElementById(id); if(target)for(const node of nodes)if(target.contains(node)||node.contains(target)){node.removeAttribute('data-craft-waiting');observer?.unobserve(node);animations.get(node)?.cancel();animations.delete(node)} };
  anchor();window.addEventListener('hashchange',anchor);
  root.addEventListener('focusin',focus);reduced.addEventListener('change',settle);
  return()=>{window.removeEventListener('hashchange',anchor);observer?.disconnect();root.removeEventListener('focusin',focus);reduced.removeEventListener('change',settle);animations.forEach(a=>a.cancel());nodes.forEach(n=>n.removeAttribute('data-craft-waiting'))};
}
