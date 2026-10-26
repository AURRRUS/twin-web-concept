import { useEffect, type RefObject } from 'react';
import { clamp, qualityStoryFrame } from './salesStoryFrame.mjs';
export function useQualityReveal(host: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = host.current!, reduced = matchMedia('(prefers-reduced-motion:reduce)');
    let disposed = false, raf = 0, visible = false, progress = 0, lastY = scrollY, initialized = false;
    const values: Record<string, number> = {};
    const put = (key: string, value: number) => {
      values[key] = Math.max(values[key] || 0, value);
      root.style.setProperty(`--quality-${key}`, String(values[key]));
    };
    const paint = () => {
      raf = 0;
      if (disposed || document.hidden) return;
      if (reduced.matches) {
        progress = 1;
        Object.keys(qualityStoryFrame(1)).forEach(key => put(key, 1));
      } else if (innerWidth < 1100) {
        for (const [id, keys] of [
          ['time', ['time', 'edge_time_budget']],
          ['budget', ['budget', 'edge_budget_application']],
          ['application', ['application_label_initial', 'word_effective', 'application_description', 'edge_application_time']],
        ] as const) {
          const top = root.querySelector<HTMLElement>(`[data-quality='${id}']`)!.getBoundingClientRect().top;
          const frame = qualityStoryFrame(clamp((innerHeight * .85 - top) / (innerHeight * .55)));
          keys.forEach(key => put(key, frame[key]));
        }
        put('model', clamp((innerHeight * .85 - root.querySelector('.story-quality-model')!.getBoundingClientRect().top) / (innerHeight * .55)));
      } else {
        const moved = Math.abs(scrollY - lastY) > .5;
        lastY = scrollY;
        if (initialized && !moved) return;
        initialized = true;
        progress = Math.max(progress, clamp((innerHeight * .8 - root.getBoundingClientRect().top) / (innerHeight * .65)));
        Object.entries(qualityStoryFrame(progress)).forEach(([key, value]) => put(key, value));
      }
      root.dataset.progress = String(progress);
      root.dataset.enhanced = 'true';
      const label = (values.word_effective || 0) >= .5 ? 'Эффективно' : 'Эффектно';
      root.dataset.word = label;
      root.querySelector('.story-quality-word')!.setAttribute('aria-label', label);
    };
    const request = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(paint); };
    const observer = new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); if (visible) request(); });
    observer.observe(root);
    void document.fonts.ready.then(() => { if (!disposed) paint(); });
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request); window.addEventListener('pageshow', request);
    document.addEventListener('visibilitychange', request); reduced.addEventListener('change', request);
    return () => { disposed = true; cancelAnimationFrame(raf); observer.disconnect(); window.removeEventListener('scroll', request); window.removeEventListener('resize', request); window.removeEventListener('pageshow', request); document.removeEventListener('visibilitychange', request); reduced.removeEventListener('change', request); };
  }, [host]);
}
