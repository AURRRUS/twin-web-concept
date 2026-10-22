import { useEffect, type RefObject } from 'react';
import { deliveryFrame } from './deliveryMotion';

export function useDeliveryMotion(host: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const node = host.current!;
    const panel = node.querySelector<HTMLElement>('.delivery-panel')!;
    const composition = node.querySelector<HTMLElement>('.delivery-composition')!;
    const model = node.querySelector<HTMLElement>('.delivery-triangle > .media')!;
    const desktop = matchMedia('(min-width:1280px)');
    const reduced = matchMedia('(prefers-reduced-motion:reduce)');
    let disposed = false, fontsReady = false, enhanced = false, flowMotion = false, flowComplete = false, raf = 0;
    const render = () => {
      raf = 0; if (disposed || document.hidden || (!enhanced && !flowMotion)) return;
      if (flowMotion) {
        const entrance = flowComplete ? 1 : Math.max(0, Math.min(1, (innerHeight * .85 - model.getBoundingClientRect().top) / 160));
        if (entrance >= 1) flowComplete = true;
        node.style.setProperty('--delivery-model', String(entrance)); return;
      }
      const p = Math.max(0, Math.min(1, -node.getBoundingClientRect().top / Math.max(1, node.offsetHeight - panel.offsetHeight)));
      const f = deliveryFrame(p);
      f.edges.forEach((edge, index) => node.style.setProperty(`--delivery-edge-${index}`, String(edge)));
      node.style.setProperty('--delivery-model', String(f.model));
      node.style.setProperty('--delivery-answer', String(f.answer));
      node.style.setProperty('--word-roll', String(f.roll));
      node.style.setProperty('--iv-reveal', String(f.insert));
      node.dataset.progress = p.toFixed(4); node.dataset.word = f.label;
    };
    const request = () => { if ((enhanced || flowMotion) && !document.hidden && !raf) raf = requestAnimationFrame(render); };
    const configure = () => {
      if (disposed || !fontsReady) return;
      cancelAnimationFrame(raf); raf = 0;
      // Measure real content in normal flow before reserving any pinned scroll distance.
      node.dataset.measuring = 'true'; node.dataset.enhanced = 'false'; composition.style.removeProperty('--delivery-height');
      let fits = desktop.matches && !reduced.matches;
      if (fits) {
        const box = composition.getBoundingClientRect();
        const needed = Math.max(composition.offsetHeight, ...[...composition.children].map(child => {
          const r = child.getBoundingClientRect(); return r.bottom - box.top;
        }));
        composition.style.setProperty('--delivery-height', `${Math.ceil(needed)}px`);
        fits = needed + 48 <= innerHeight;
      }
      enhanced = fits; flowMotion = !fits && desktop.matches && !reduced.matches;
      node.dataset.enhanced = String(fits); delete node.dataset.measuring;
      node.toggleAttribute('data-flow-motion', flowMotion);
      if (flowMotion && model.getBoundingClientRect().top < innerHeight) flowComplete = true;
      if (fits) render();
      else {
        for (const key of ['--delivery-edge-0', '--delivery-edge-1', '--delivery-edge-2', '--delivery-model', '--delivery-answer', '--word-roll', '--iv-reveal']) node.style.removeProperty(key);
        delete node.dataset.progress; delete node.dataset.word;
        if (flowMotion) render();
      }
    };
    const visibility = () => { cancelAnimationFrame(raf); raf = 0; if (!document.hidden) render(); };
    void Promise.all([400,600,700].map(w => document.fonts.load(`${w} 24px "RF Dewi Expanded"`, 'Качественно Эффективно'))).then(() => document.fonts.ready).then(() => { fontsReady = true; configure(); });
    desktop.addEventListener('change', configure); reduced.addEventListener('change', configure);
    window.addEventListener('resize', configure); window.addEventListener('scroll', request, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    // Keyboard access to a demo link never waits for a scroll-directed entrance.
    const focus = () => { if (enhanced || flowMotion) { flowComplete = true; node.style.setProperty('--delivery-model', '1'); node.style.setProperty('--delivery-answer', '1'); } };
    node.addEventListener('focusin', focus);
    return () => { disposed = true; cancelAnimationFrame(raf); desktop.removeEventListener('change', configure); reduced.removeEventListener('change', configure); window.removeEventListener('resize', configure); window.removeEventListener('scroll', request); document.removeEventListener('visibilitychange', visibility); node.removeEventListener('focusin', focus); };
  }, [host]);
}
