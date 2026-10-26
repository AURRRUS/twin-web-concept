import { useEffect, useRef, useState } from 'react';
import { journeyFrame, scrollDistance, stops } from '../../lib/v2/journeyFrame';

type Scene = { id: string; label: string; lead: string; body: string; imageId: string };
type JourneyContent = { heading: string; lines: string[]; accent: string; scenes: Scene[] };
type Fallback = { imageError: string; retry: string; demoCta: string };
type Props = { journey: JourneyContent; fallback: Fallback; imageUrls: Record<string, string>; demoHref: string };
type Mode = 'plain' | 'pin' | 'accordion' | 'flow';
const ids = ['location', 'compare', 'floor', 'living'];
const clickEase = (x: number) => { let low = 0, high = 1; for (let i = 0; i < 18; i++) { const t = (low + high) / 2, a = 1 - t, bx = 3*a*a*t*.22 + 3*a*t*t*.36 + t*t*t; if (bx < x) low = t; else high = t; } const t = (low + high) / 2, a = 1 - t; return 3*a*a*t + 3*a*t*t + t*t*t; };
const iconPaths = [
  'M12 21s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  'M3 20h18M6 20V6l6-3 6 3v14M9 8h1m4 0h1M9 12h1m4 0h1M9 16h1m4 0h1',
  'M3 5h18v14H3zM12 5v14M3 12h9m4-7v7h5m-5 3h2',
  'M3 19V7l9-4 9 4v12H3Zm4 0V9h10v10M7 13h10M12 9v10',
];
function Icon({ index }: { index: number }) {
  return <svg className="tv2-journey-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={iconPaths[index]} /></svg>;
}
function Photo({ url, label, fallback, eager = false }: { url: string; label: string; fallback: Fallback; eager?: boolean }) {
  const [attempt, setAttempt] = useState(0), [error, setError] = useState(false);
  return <span className="tv2-photo-wrap">{!error && <img src={url + (attempt ? `?retry=${attempt}` : '')} width="1672" height="941" loading={eager ? 'eager' : 'lazy'} decoding="async" alt={`Демонстрационный интерфейс: ${label}`} onError={() => setError(true)} />}{error && <span className="tv2-photo-error" role="status">{fallback.imageError} <button type="button" onClick={() => { setError(false); setAttempt(attempt + 1); }}>{fallback.retry}</button></span>}</span>;
}
/** The layout is present in SSR. Enhancement owns only the Journey track and its layers. */
export function Journey({ journey, fallback, imageUrls, demoHref }: Props) {
  const host = useRef<HTMLElement>(null), select = useRef<(index: number) => void>(() => {});
  const [mode, setMode] = useState<Mode>('plain'), [active, setActive] = useState(0);
  const scenes = journey.scenes;
  useEffect(() => {
    const root = host.current!;
    const panel = root.querySelector<HTMLElement>('.tv2-journey-panel')!;
    const title = root.querySelector<HTMLElement>('.tv2-journey-title')!;
    const stage = root.querySelector<HTMLElement>('.tv2-journey-media')!;
    const items = Array.from(root.querySelectorAll<HTMLElement>('.tv2-journey-item'));
    const contents = items.map(item => item.querySelector<HTMLElement>('.tv2-journey-content')!);
    const leads = items.map(item => item.querySelector<HTMLElement>('.tv2-journey-lead')!);
    const bodies = items.map(item => item.querySelector<HTMLElement>('.tv2-journey-body')!);
    const photos = Array.from(root.querySelectorAll<HTMLElement>('.tv2-journey-frame'));
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let current: Mode = 'plain', selected = 0, p = 0, travel = 1, start = 0, frame = 0, layoutFrame = 0, automatic = 0;
    let visible = true, disposed = false, initialized = false, metrics = '', heights = [0, 0, 0, 0];
    let flowObserver: IntersectionObserver | undefined; const reveals: Animation[] = [], selectionAnimations: Animation[] = [];
    const stopAuto = () => { cancelAnimationFrame(automatic); automatic = 0; };
    const setSelected = (next: number) => { if (next !== selected) { selected = next; setActive(next); } };
    const paint = () => {
      frame = 0;
      if (disposed || current !== 'pin' || document.hidden) return;
      p = Math.max(0, Math.min(1, (scrollY - start) / travel));
      const f = journeyFrame(p); root.dataset.progress = String(p); root.dataset.scene = scenes[f.active].id;
      items.forEach((item, i) => {
        const open = f.transitioning ? i === f.old ? 1 - f.expand : i === f.next ? f.expand : 0 : i === f.active ? 1 : 0;
        item.style.setProperty('--tv2-open', String(open));
        contents[i].style.height = `${Math.max(0, heights[i] * open)}px`;
        const lead = !f.transitioning ? +(i === f.active) : i === f.old ? f.oldCopy : i === f.next ? f.nextLead : 0;
        const body = !f.transitioning ? +(i === f.active) : i === f.old ? f.oldCopy : i === f.next ? f.nextBody : 0;
        leads[i].style.opacity = String(lead); leads[i].style.clipPath = `inset(${100 * (1 - lead)}% 0 0 0)`; leads[i].style.transform = `translateY(${12 * (1 - lead)}px)`;
        bodies[i].style.opacity = String(body); bodies[i].style.clipPath = `inset(${100 * (1 - body)}% 0 0 0)`; bodies[i].style.transform = `translateY(${12 * (1 - body)}px)`;
      });
      photos.forEach((photo, i) => {
        const alpha = !f.transitioning ? +(i === f.active) : i === f.old ? f.oldImage : i === f.next ? f.nextImage : 0;
        photo.style.opacity = String(alpha); photo.style.visibility = alpha > 0 ? 'visible' : 'hidden';
        const incoming = f.transitioning && i === f.next ? f.imageMotion : 1;
        photo.style.transform = `translateY(${18 * (1 - incoming)}px) scale(${1 + .035 * (1 - incoming)})`;
      });
      setSelected(f.active);
    };
    const requestPaint = () => { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(paint); };
    const clear = () => { contents.forEach(e => e.style.removeProperty('height')); items.forEach(e => e.style.removeProperty('--tv2-open')); [...leads, ...bodies, ...photos].forEach(e => { e.style.removeProperty('opacity'); e.style.removeProperty('transform'); e.style.removeProperty('visibility'); e.style.removeProperty('clip-path'); }); root.style.removeProperty('--tv2-track-height'); };
    const layout = () => {
      layoutFrame = 0; if (disposed) return;
      const oldMode = current, oldProgress = p, wasVisible = root.getBoundingClientRect().top < innerHeight && root.getBoundingClientRect().bottom > 0;
      stopAuto(); flowObserver?.disconnect(); flowObserver = undefined; reveals.splice(0).forEach(a => a.cancel()); selectionAnimations.splice(0).forEach(a => a.cancel());
      // Measure the desktop grid in its final mode; media keeps a fixed ratio before decode.
      root.dataset.mode = 'pin';
      clear();
      const triggers = items.map(item => item.querySelector<HTMLElement>('.tv2-journey-trigger')!);
      heights = contents.map(e => e.scrollHeight);
      delete root.dataset.compact;
      let titleHeight = title.getBoundingClientRect().height;
      const allRows = triggers.reduce((sum, node) => sum + Math.max(64, node.getBoundingClientRect().height), 0);
      let required = titleHeight + 32 + Math.max(stage.getBoundingClientRect().height, allRows + Math.max(...heights) + 32);
      if (innerWidth >= 1100 && required > innerHeight - 48) { root.dataset.compact = 'true'; titleHeight = title.getBoundingClientRect().height; required = titleHeight + 16 + Math.max(stage.getBoundingClientRect().height, allRows + Math.max(...heights) + 32); }
      const fits = innerWidth >= 1100 && !reduced.matches && required <= innerHeight - 48;
      current = fits ? 'pin' : innerWidth < 1100 ? 'accordion' : 'flow';
      root.dataset.mode = current;
      setMode(current);
      metrics = `${innerWidth}:${innerHeight}:${reduced.matches}`;
      if (current === 'pin') {
        travel = scrollDistance(innerHeight);
        // Paint first, then read the panel's real active-content height once.
        start = root.getBoundingClientRect().top + scrollY - 24;
        if (oldMode !== 'pin') p = stops[selected]; else p = oldProgress;
        // Temporarily calculate at a stable reading stop; no network event changes progress.
        const activeHeight = heights[selected] || 0;
        contents.forEach((e, i) => { e.style.height = `${i === selected ? activeHeight : 0}px`; });
        const panelHeight = panel.getBoundingClientRect().height;
        root.style.setProperty('--tv2-track-height', `${panelHeight + travel}px`);
        start = root.getBoundingClientRect().top + scrollY - 24;
        if (initialized && wasVisible) window.scrollTo({ top: start + (oldMode === 'pin' ? oldProgress : stops[selected]) * travel, behavior: 'instant' });
        paint();
      } else {
        clear();
        if (current === 'accordion') contents.forEach((e, i) => { e.style.height = `${i === selected ? e.scrollHeight : 0}px`; });
        root.dataset.scene = scenes[selected].id; root.dataset.progress = String(stops[selected]);
        if (current === 'flow' && !reduced.matches) try {
          flowObserver = new IntersectionObserver(entries => { for (const entry of entries) { if (!entry.isIntersecting) continue; const item = entry.target as HTMLElement; flowObserver?.unobserve(item); const layers = [item.querySelector<HTMLElement>('.tv2-journey-trigger'), item.querySelector<HTMLElement>('.tv2-journey-copy'), item.querySelector<HTMLElement>('.tv2-journey-inline-image')]; layers.forEach((node, i) => { if (!node) return; try { reveals.push(node.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 560, delay: i * 90, easing: 'cubic-bezier(.22,1,.36,1)' })); } catch { /* visible default remains usable */ } }); } }, { rootMargin: '0px 0px -14% 0px' });
          items.forEach(item => flowObserver?.observe(item));
        } catch { /* visible default remains usable */ }
      }
      root.dataset.enhanced = 'true'; initialized = true;
    };
    const requestLayout = () => { if (!layoutFrame) layoutFrame = requestAnimationFrame(layout); };
    const onResize = () => { if (`${innerWidth}:${innerHeight}:${reduced.matches}` !== metrics) requestLayout(); };
    const onScroll = () => requestPaint();
    const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; stopAuto(); } else requestPaint(); };
    const onInput = () => stopAuto();
    const onKey = (event: KeyboardEvent) => { if (['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)) stopAuto(); };
    select.current = (index: number) => {
      index = Math.max(0, Math.min(scenes.length - 1, index)); stopAuto();
      if (current !== 'pin') { if (current === 'accordion' && index !== selected) {
        selectionAnimations.splice(0).forEach(a => a.cancel()); contents[selected].style.height = '0px'; contents[index].style.height = `${contents[index].scrollHeight}px`;
        if (!reduced.matches) try { const easing = 'cubic-bezier(.22,1,.36,1)'; selectionAnimations.push(contents[index].animate([{opacity:0},{opacity:1}], {duration:280,easing})); const image = contents[index].querySelector<HTMLElement>('.tv2-journey-inline-image'); if (image) selectionAnimations.push(image.animate([{opacity:0},{opacity:1}], {duration:420,easing})); } catch { /* visible default remains usable */ }
      } setSelected(index); root.dataset.scene = scenes[index].id; return; }
      const from = scrollY, to = start + travel * stops[index], started = performance.now();
      const tick = (now: number) => { const t = Math.min(1, (now - started) / 640), eased = clickEase(t); window.scrollTo({ top: from + (to - from) * eased, behavior: 'instant' }); if (t < 1) automatic = requestAnimationFrame(tick); else automatic = 0; };
      automatic = requestAnimationFrame(tick);
    };
    let intersection: IntersectionObserver | undefined, resize: ResizeObserver | undefined;
    try { intersection = new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); if (visible) requestPaint(); else { cancelAnimationFrame(frame); frame = 0; stopAuto(); } }); intersection.observe(root); } catch { visible = true; }
    try { resize = new ResizeObserver(onResize); resize.observe(document.documentElement); } catch { /* resize event remains available */ }
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onResize);
    window.addEventListener('wheel', onInput, { passive: true }); window.addEventListener('touchstart', onInput, { passive: true }); window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVisibility); reduced.addEventListener('change', requestLayout);
    document.fonts.ready.then(async () => { const img = root.querySelector<HTMLImageElement>('.tv2-journey-inline-image img'); if (img) try { await img.decode(); } catch { /* error state remains usable */ } if (!disposed) requestLayout(); });
    return () => { disposed = true; cancelAnimationFrame(frame); cancelAnimationFrame(layoutFrame); stopAuto(); intersection?.disconnect(); resize?.disconnect(); flowObserver?.disconnect(); reveals.forEach(a => a.cancel()); selectionAnimations.forEach(a => a.cancel()); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); window.removeEventListener('wheel', onInput); window.removeEventListener('touchstart', onInput); window.removeEventListener('keydown', onKey); document.removeEventListener('visibilitychange', onVisibility); reduced.removeEventListener('change', requestLayout); };
  }, [scenes]);
  return <section className="tv2-journey" id="journey" ref={host} data-mode={mode} aria-labelledby="tv2-journey-title">
    <div className="tv2-journey-panel"><div className="tv2-journey-inner">
      <h2 className="tv2-journey-title" id="tv2-journey-title">{journey.lines.map((line, index) => { const pos = line.indexOf(journey.accent); return <span key={line}>{pos < 0 ? line : <>{line.slice(0, pos)}<em>{journey.accent}</em>{line.slice(pos + journey.accent.length)}</>}{index < journey.lines.length - 1 && ' '}</span>; })}</h2>
      <div className="tv2-journey-row"><div className="tv2-journey-list" onKeyDown={event => { if (!['ArrowDown','ArrowUp','Home','End'].includes(event.key)) return; const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('.tv2-journey-trigger')); const i = buttons.indexOf(event.target as HTMLButtonElement); if (i < 0) return; event.preventDefault(); buttons[event.key === 'Home' ? 0 : event.key === 'End' ? 3 : (i + (event.key === 'ArrowDown' ? 1 : 3)) % 4].focus({ preventScroll: true }); }}>
        {scenes.map((scene, i) => { const open = mode === 'plain' || mode === 'flow' || active === i; return <article className="tv2-journey-item" data-active={active === i} key={scene.id}>
          <button className="tv2-journey-trigger" type="button" aria-expanded={open} aria-controls={`tv2-scene-${scene.id}`} onClick={() => select.current(i)}><Icon index={i} /><span>{scene.label}</span></button>
          <div className="tv2-journey-content" id={`tv2-scene-${scene.id}`} aria-hidden={!open} inert={!open || undefined}><div className="tv2-journey-copy"><p className="tv2-journey-lead">{scene.lead}</p><p className="tv2-journey-body">{scene.body}</p></div><div className="tv2-journey-inline-image"><Photo url={imageUrls[scene.imageId]} label={scene.label} fallback={fallback} eager={i === 0} /><a href={demoHref}>{fallback.demoCta}</a></div></div>
        </article>; })}
      </div><div className="tv2-journey-media">{scenes.map((scene, i) => <div className="tv2-journey-frame" key={scene.id} data-state={ids[i]} aria-hidden={mode !== 'pin' || active !== i} inert={mode !== 'pin' || active !== i || undefined}><Photo url={imageUrls[scene.imageId]} label={scene.label} fallback={fallback} eager={i === 0} /></div>)}</div></div>
    </div></div>
  </section>;
}
