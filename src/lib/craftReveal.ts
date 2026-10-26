/** Entry owns only outer shells; pure scroll painters exclusively own scene layers. */
export function initCraftReveals(root: Document = document) {
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const controlled = '[data-story-title],[data-story-question],[data-story-sales],.story-photo,.quality-canvas,.scene-title-group,.scene-body-group,.scene-material';
  const candidates = [...root.querySelectorAll<HTMLElement>('[data-entry],[data-craft-reveal]')];
  const nodes = candidates.filter(node => node instanceof HTMLElement && !node.closest(controlled) && !node.parentElement?.closest('[data-entry]'));
  const animations = new Map<HTMLElement, Animation>();
  let legacyObserver: IntersectionObserver | undefined;
  const legacyHosts=[...root.querySelectorAll<HTMLElement>('.journey[data-craft-repeat="after-exit"]')];
  const legacyState=new Map(legacyHosts.map(host=>[host,{played:false,armed:true}]));
  let observer: IntersectionObserver | undefined, scrollRaf = 0, resizeRaf = 0, disposed = false;
  const settle = (node: HTMLElement) => {
    node.removeAttribute('data-entry-waiting');
    node.removeAttribute('data-craft-waiting');
    animations.get(node)?.cancel(); animations.delete(node);
    node.dataset.entrySeen = 'true'; observer?.unobserve(node);
  };
  const reveal = (node: HTMLElement) => {
    if (!node.hasAttribute('data-entry-waiting')) return;
    node.removeAttribute('data-entry-waiting'); node.dataset.entrySeen = 'true'; observer?.unobserve(node);
    if (reduced.matches) return;
    const role = node.dataset.entry || node.dataset.craftReveal || 'group';
    const story = role === 'story-frame';
    const delay = role === 'launch' ? Math.min(210, [...node.parentElement!.children].indexOf(node) * 70) : role === 'body' ? 60 : ['media', 'contact-form', 'form'].includes(role) ? 120 : 0;
    try {
      const animation = node.animate([{ opacity: 0, transform: `translateY(${story ? 12 : 14}px)` }, { opacity: 1, transform: 'none' }], { duration: story ? 400 : 420, delay, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'backwards' });
      animations.set(node, animation);
      animation.finished.catch(() => {}).finally(() => { if (animations.get(node) === animation) animations.delete(node); });
    } catch { settle(node); }
  };
  const register = () => {
    if (disposed) return;
    observer?.disconnect();
    if (reduced.matches || !('IntersectionObserver' in window) || typeof Element.prototype.animate !== 'function') { nodes.forEach(settle); return; }
    try {
      observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) reveal(entry.target as HTMLElement); }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });
      for (const node of nodes) {
        if (!node.getClientRects().length) { node.removeAttribute('data-entry-waiting'); continue; }
        node.dataset.entry ||= node.dataset.craftReveal || 'group';
        if (node.dataset.entrySeen === 'true') continue;
        const rect = node.getBoundingClientRect();
        if (rect.top < innerHeight * .88) { settle(node); continue; }
        observer.observe(node);
        node.setAttribute('data-entry-waiting', '');
      }
    } catch { nodes.forEach(settle); }
  };
  const settlePassed = () => {
    scrollRaf = 0;
    for (const node of nodes) if (node.hasAttribute('data-entry-waiting') && node.getClientRects().length && node.getBoundingClientRect().bottom <= 0) settle(node);
  };
  const scroll = () => { if (!scrollRaf) scrollRaf = requestAnimationFrame(settlePassed); };
  const resize = () => { cancelAnimationFrame(resizeRaf); resizeRaf = requestAnimationFrame(register); };
  const lifecycle = () => { if (!document.hidden) { settlePassed(); for (const node of nodes) { const r = node.getBoundingClientRect(); if (node.getClientRects().length && r.top < innerHeight && r.bottom > 0) settle(node); } } };
  const revealTarget = (target: Element) => { for (const node of nodes) if (node.contains(target) || target.contains(node)) settle(node); };
  const focus = (event: Event) => { if (event.target instanceof Element) revealTarget(event.target); };
  const anchor = () => { let id = location.hash.slice(1); try { id = decodeURIComponent(id); } catch {} const target = root.getElementById(id); if (target) revealTarget(target); };
  const change = () => { if (reduced.matches) { nodes.forEach(settle); observer?.disconnect(); } else register(); };
  register(); anchor();
  // Preserve the original comparison's repeatable outer entrance; modern story entry remains once.
  if(legacyHosts.length&&!reduced.matches&&'IntersectionObserver'in window){try{
    legacyObserver=new IntersectionObserver(entries=>{for(const entry of entries){const host=entry.target as HTMLElement,state=legacyState.get(host)!;const r=entry.boundingClientRect;
      if(entry.isIntersecting&&state.armed){state.armed=false;state.played=true;host.dataset.entryCycle=String(Number(host.dataset.entryCycle||0)+1);delete host.dataset.entryArmed;
        for(const node of nodes)if(host.contains(node)&&node.getClientRects().length){delete node.dataset.entrySeen;node.setAttribute('data-entry-waiting','');observer?.observe(node)}
      }else if(state.played&&(r.bottom<=0||r.top>=innerHeight)){state.armed=true;host.dataset.entryArmed='true'}
    }},{threshold:[0,.00001]});legacyHosts.forEach(host=>legacyObserver!.observe(host));
  }catch{nodes.forEach(settle)}}

  window.addEventListener('scroll', scroll, { passive: true }); window.addEventListener('resize', resize);
  window.addEventListener('hashchange', anchor); window.addEventListener('popstate', lifecycle); window.addEventListener('pageshow', lifecycle);
  root.addEventListener('twin:story-layout', resize); root.addEventListener('focusin', focus); root.addEventListener('visibilitychange', lifecycle); root.addEventListener('twin:settle-reveal', focus);
  reduced.addEventListener('change', change);
  return () => {
    disposed = true; cancelAnimationFrame(scrollRaf); cancelAnimationFrame(resizeRaf); observer?.disconnect();legacyObserver?.disconnect();
    nodes.forEach(settle); animations.forEach(a => a.cancel()); animations.clear();
    window.removeEventListener('scroll', scroll); window.removeEventListener('resize', resize); window.removeEventListener('hashchange', anchor);
    window.removeEventListener('popstate', lifecycle); window.removeEventListener('pageshow', lifecycle);
    root.removeEventListener('twin:story-layout', resize); root.removeEventListener('focusin', focus); root.removeEventListener('visibilitychange', lifecycle); root.removeEventListener('twin:settle-reveal', focus);
    reduced.removeEventListener('change', change);
  };
}
