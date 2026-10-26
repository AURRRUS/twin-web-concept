import { useEffect, useRef, useState } from 'react';
import { localProgress, journeyTargets, channelTargets } from './salesStoryFrame.mjs';
import { measureStoryLayout, readStoryGeometry, type StoryGeometry, type StoryKind } from './storyLayout';
import { createStoryPainter } from './storyPaint';

/** One driver per host: layout -> cached geometry -> pure frame -> DOM writes. */
export function useStoryTrack(kind: StoryKind) {
  const host = useRef<HTMLElement>(null);
  const jump = useRef<(index: number, instant?: boolean) => void>(() => {});
  const [mode, setMode] = useState<'flow' | 'pin' | 'switch'>('flow');
  const [active, setActive] = useState(0);
  useEffect(() => {
    const root = host.current!, reduced = matchMedia('(prefers-reduced-motion:reduce)');
    const painter = createStoryPainter(root, kind);
    const targets = kind === 'journey' ? journeyTargets : channelTargets;
    const ids = kind === 'journey' ? ['project', 'corpus', 'floor', 'lot'] : ['site', 'online', 'agent', 'office'];
    let geometry: StoryGeometry = { top: 0, hostHeight: 1, panelHeight: 1, mediaHeight: 0 };
    let disposed = false, fontsReady = false, visible = false, pinned = false, selected = 0;
    let raf = 0, layoutRaf = 0, hashRaf = 0, currentActive = 0, lastStamp = '', assetsRevision = 0, layoutKey = '';
    try {
      if (kind === 'journey' && sessionStorage.getItem('twin-demo-restore') === 'true') {
        selected = Number(JSON.parse(sessionStorage.getItem('twin-demo-origin') || 'null')?.journeyScene) || 0;
      }
    } catch { /* Session restoration is optional. */ }
    const paint = () => {
      raf = 0;
      if (disposed || !fontsReady || document.hidden) return;
      const progress = pinned ? localProgress(scrollY, geometry.top, geometry.hostHeight, geometry.panelHeight) : 0;
      const stamp = `${pinned}:${progress}:${selected}:${assetsRevision}`;
      if (stamp === lastStamp) return;
      lastStamp = stamp;
      root.dataset.paintCount = String(Number(root.dataset.paintCount || 0) + 1);
      const next = painter(progress, pinned, selected, geometry.mediaHeight);
      if (next !== currentActive) { currentActive = next; setActive(next); }
    };
    const requestPaint = (force = false) => {
      if (disposed) return;
      if (force) lastStamp = '';
      if (!raf && !document.hidden && (visible || force)) raf = requestAnimationFrame(paint);
    };
    const refreshGeometry = () => {
      geometry = readStoryGeometry(root);
      root.dataset.geometryTop = String(geometry.top);
      root.dataset.geometryTravel = String(Math.max(1, geometry.hostHeight - geometry.panelHeight));
    };
    const layout = (restore = false) => {
      layoutRaf = 0;
      if (disposed || !fontsReady) return;
      const wasPinned = pinned;
      const oldProgress = Number(root.dataset.progress || 0);
      const oldActive = currentActive;
      const rect = root.getBoundingClientRect();
      const onScreen = rect.top < innerHeight && rect.bottom > 0;
      selected = root.dataset.storyReady ? oldActive : selected;
      pinned = measureStoryLayout(root, kind, reduced.matches);
      setMode(pinned ? 'pin' : 'switch');
      refreshGeometry();
      layoutKey = `${innerWidth}:${innerHeight}:${root.clientWidth}:${reduced.matches}`;
      if (restore && onScreen) {
        if (pinned) scrollTo({ top: geometry.top + (wasPinned ? oldProgress : targets[selected]) * Math.max(1, geometry.hostHeight - geometry.panelHeight), behavior: 'instant' });
        else if (wasPinned) scrollTo({ top: geometry.top, behavior: 'instant' });
      }
      requestPaint(true);
      root.dataset.comparisonReady = 'true';
      root.dataset.storyReady = 'true';
      root.dispatchEvent(new CustomEvent('twin:story-layout', { bubbles: true }));
    };
    const requestLayout = () => {
      if (!layoutRaf) layoutRaf = requestAnimationFrame(() => layout(true));
    };
    const upstreamChange = () => {
      if (disposed || !fontsReady) return;
      const key = `${innerWidth}:${innerHeight}:${root.clientWidth}:${reduced.matches}`;
      if (key !== layoutKey) requestLayout();
      else { refreshGeometry(); requestPaint(true); }
    };
    jump.current = (index, instant = false) => {
      selected = Math.max(0, Math.min(3, index));
      refreshGeometry();
      if (pinned) scrollTo({ top: geometry.top + targets[selected] * Math.max(1, geometry.hostHeight - geometry.panelHeight), behavior: instant || reduced.matches ? 'instant' : 'smooth' });
      else requestPaint(true);
    };
    const hash = () => {
      if (disposed) return;
      const prefix = kind === 'journey' ? 'journey-variant-4-' : 'channel-';
      const index = ids.findIndex(id => location.hash === `#${prefix}${id}`);
      if (index >= 0) jump.current(index, true);
    };
    const mediaChanged = () => { if (disposed) return; assetsRevision++; requestPaint(true); };
    const scroll = () => requestPaint();
    const lifecycle = () => { if (!document.hidden) { refreshGeometry(); requestPaint(true); } };
    const observer = new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); if (visible) { refreshGeometry(); requestPaint(true); } });
    observer.observe(root);
    const preload = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        root.querySelectorAll<HTMLImageElement>('.story-photo img').forEach(img => { img.loading = 'eager'; if (img.complete && img.naturalWidth) void img.decode().catch(() => {}).then(mediaChanged); });
        preload.disconnect();
      }
    }, { rootMargin: '100% 0px' });
    preload.observe(root);
    const resizeObserver = new ResizeObserver(upstreamChange);
    resizeObserver.observe(document.querySelector('main')!);
    resizeObserver.observe(root);
    void document.fonts.ready.then(() => { if (!disposed) { fontsReady = true; layout(); hashRaf = requestAnimationFrame(() => { hashRaf = 0; hash(); }); } });
    root.addEventListener('twin:story-media', mediaChanged);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', requestLayout);
    window.addEventListener('hashchange', hash);
    window.addEventListener('pageshow', lifecycle);
    window.addEventListener('popstate', lifecycle);
    document.addEventListener('visibilitychange', lifecycle);
    reduced.addEventListener('change', requestLayout);
    return () => {
      disposed = true; cancelAnimationFrame(raf); cancelAnimationFrame(layoutRaf); cancelAnimationFrame(hashRaf);
      observer.disconnect(); preload.disconnect(); resizeObserver.disconnect();
      root.removeEventListener('twin:story-media', mediaChanged);
      window.removeEventListener('scroll', scroll); window.removeEventListener('resize', requestLayout);
      window.removeEventListener('hashchange', hash); window.removeEventListener('pageshow', lifecycle);
      window.removeEventListener('popstate', lifecycle); document.removeEventListener('visibilitychange', lifecycle);
      reduced.removeEventListener('change', requestLayout);
    };
  }, [kind]);
  return { host, mode, active, jump };
}
