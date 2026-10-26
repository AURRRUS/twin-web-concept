import { useEffect, type RefObject } from 'react';
import { clamp, phase } from './salesStoryFrame.mjs';
/** Each stable outer group owns its visibility; only the inner content is transformed. */
export function useQualityReveal(host: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = host.current!, reduced = matchMedia('(prefers-reduced-motion:reduce)');
    const groups = [...root.querySelectorAll<HTMLElement>('[data-quality]')];
    const graphic = root.querySelector<HTMLElement>('.quality-graphic')!;
    const progress = new Map<Element, number>();
    let disposed = false, raf = 0, resizeRaf = 0, visible = false, initialized = false, resizing = false, lastY = scrollY;
    const paint = (advance: boolean) => {
      if (disposed || document.hidden) return;
      const tops = [...groups, graphic].map(node => [node, node.getBoundingClientRect().top] as const);
      if (advance || reduced.matches) for (const [node, top] of tops) {
        const value = reduced.matches ? 1 : clamp((innerHeight * .85 - top) / (innerHeight * .30));
        progress.set(node, Math.max(progress.get(node) || 0, value));
      }
      for (const node of groups) {
        const g = progress.get(node) || 0, id = node.dataset.quality!;
        root.style.setProperty(`--quality-${id}`, String(phase(g, 0, .25)));
        root.dataset[`group${id[0].toUpperCase()+id.slice(1)}`] = String(g);
      }
      const q = progress.get(graphic) || 0;
      root.style.setProperty('--quality-edge-one', String(phase(q, 0, .4)));
      root.style.setProperty('--quality-edge-two', String(phase(q, .3, .7)));
      root.style.setProperty('--quality-edge-three', String(phase(q, .6, 1)));
      root.style.setProperty('--quality-model', String(phase(q, .15, .7)));
      const g = progress.get(groups.find(node => node.dataset.quality === 'application')!) || 0;
      const word = phase(g, .55, .85), label = word >= .5 ? 'Эффективно' : 'Эффектно';
      root.style.setProperty('--quality-word_effective', String(word));
      root.querySelector('.story-quality-word')!.setAttribute('aria-label', label);
      root.dataset.word = label; root.dataset.progress = String(q); root.dataset.enhanced = 'true';
    };
    const update = () => { raf = 0; const moved = Math.abs(scrollY - lastY) > .5; lastY = scrollY; paint(!resizing && (!initialized || moved)); initialized = true; };
    const request = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(update); };
    const resize = () => { resizing = true; cancelAnimationFrame(resizeRaf); resizeRaf = requestAnimationFrame(() => { lastY = scrollY; resizing = false; paint(false); }); };
    const motionChange = () => { if (reduced.matches) paint(true); else request(); };
    const observer = new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); if (visible) request(); });
    observer.observe(root);
    void document.fonts.ready.then(() => { if (!disposed) { paint(true); initialized = true; lastY = scrollY; } });
    window.addEventListener('scroll', request, { passive: true }); window.addEventListener('resize', resize);
    window.addEventListener('pageshow', request); document.addEventListener('visibilitychange', request); reduced.addEventListener('change', motionChange);
    return () => { disposed = true; cancelAnimationFrame(raf); cancelAnimationFrame(resizeRaf); observer.disconnect(); window.removeEventListener('scroll', request); window.removeEventListener('resize', resize); window.removeEventListener('pageshow', request); document.removeEventListener('visibilitychange', request); reduced.removeEventListener('change', motionChange); };
  }, [host]);
}
