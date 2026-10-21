import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Media } from './Media';
import { journeyFrame } from '../lib/journeyMotion';
import content from '../lib/journeyContent.json';
import { sitePath } from '../lib/paths';

const materials = [
  { media: 'sceneProject', alt: 'Иллюстрация интерфейса: инфраструктура прибрежного проекта', target: .09 },
  { media: 'sceneSpace', alt: 'Иллюстрация интерфейса: терраса с видом на море', target: .50 },
  { media: 'sceneLot', alt: 'Иллюстрация интерфейса: план этажа и выбранный лот', target: .91 },
] as const;
const scenes = content.journey.map((scene, index) => ({ ...scene, ...materials[index] }));
type Scene = typeof scenes[number];
const heading = (scene: Scene) => <><span>{scene.heading_lines[0]}</span>{' '}<span>{scene.heading_lines[1]}</span></>;
const navigation = (scene: Scene, index: number) => <><span className="scene-number">0{index + 1}</span><span><strong>{scene.navigation_title}</strong><span className="scene-nav-description">{scene.navigation_description_lines[0]}{' '}<br />{scene.navigation_description_lines[1]}</span></span></>;
const disclaimer = 'Иллюстрация интерфейса. Данные демонстрационные.';
const original = (id: string) => sitePath(`/media/recovery-original/${id}.png`);

export function Journey() {
  const host = useRef<HTMLElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [reading, setReading] = useState({ active: 0, title: 0, explanation: 0 });
  const [expanded, setExpanded] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const origin = useRef<HTMLElement | null>(null);
  const jump = useRef<(id: string) => void>(() => {});
  useEffect(() => {
    const node = host.current!;
    const panel = node.querySelector<HTMLElement>('.journey-cinematic')!;
    const desktop = matchMedia('(min-width: 1100px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let enabled = false, raf = 0, disposed = false;
    let current = { active: -1, title: -1, explanation: -1 };
    const update = () => {
      raf = 0;
      if (document.hidden || !enabled) return;
      const rect = node.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, node.offsetHeight - panel.offsetHeight)));
      const frame = journeyFrame(progress);
      for (const group of ['text', 'textY', 'clip', 'stack'] as const) {
        frame[group].forEach((value, index) => node.style.setProperty(`--${group}-${index}`, `${value}${group === 'textY' ? 'px' : group === 'clip' ? '%' : ''}`));
      }
      node.style.setProperty('--scene-progress', String(progress));
      if (current.active !== frame.active || current.title !== frame.title || current.explanation !== frame.explanation) {
        if (current.active !== frame.active) window.dispatchEvent(new CustomEvent('twin:scene-active', { detail: scenes[frame.active].id }));
        current = { active: frame.active, title: frame.title, explanation: frame.explanation };
        setReading(current);
      }
    };
    const request = () => { if (!raf && !document.hidden && enabled) raf = requestAnimationFrame(update); };
    const configure = () => {
      if (disposed) return;
      cancelAnimationFrame(raf); raf = 0;
      let fits = desktop.matches && !reduced.matches;
      if (fits) {
        // Measure the real text and image footprint, including the longest hidden text group.
        node.dataset.measuring = 'true'; panel.hidden = false;
        const right = panel.querySelector<HTMLElement>('.journey-right')!;
        const text = panel.querySelector<HTMLElement>('.scene-text-zone')!;
        const image = panel.querySelector<HTMLElement>('.scene-materials')!;
        const nav = panel.querySelector<HTMLElement>('.scene-navigation')!;
        const caption = panel.querySelector<HTMLElement>('.scene-caption')!;
        const css = getComputedStyle(right);
        const needed = text.offsetHeight + 28 + Math.max(nav.scrollHeight, image.offsetHeight + caption.offsetHeight + 8) + parseFloat(css.paddingTop) + parseFloat(css.paddingBottom);
        fits = needed <= innerHeight;
        delete node.dataset.measuring;
      }
      enabled = fits; panel.hidden = !fits; setEnhanced(fits); request();
    };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else request(); };
    jump.current = id => {
      const scene = scenes.find(item => item.id === id);
      if (!scene) return;
      if (!enabled) { document.getElementById(id)?.scrollIntoView({ behavior: 'auto' }); return; }
      window.scrollTo({ top: node.getBoundingClientRect().top + scrollY + Math.max(0, node.offsetHeight - panel.offsetHeight) * scene.target, behavior: 'smooth' });
    };
    const onJump = (event: Event) => jump.current((event as CustomEvent<string>).detail);
    const decode = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      node.querySelectorAll<HTMLImageElement>('.scene-material img').forEach(image => { image.loading = 'eager'; void image.decode().catch(() => {}); });
      decode.disconnect();
    }, { rootMargin: '100% 0px' });
    decode.observe(node);
    const resize = new ResizeObserver(request); resize.observe(node);
    configure(); void document.fonts.ready.then(configure);
    desktop.addEventListener('change', configure); reduced.addEventListener('change', configure);
    window.addEventListener('scroll', request, { passive: true }); window.addEventListener('resize', configure);
    window.addEventListener('twin:journey', onJump); document.addEventListener('visibilitychange', visibility);
    return () => {
      disposed = true; cancelAnimationFrame(raf); decode.disconnect(); resize.disconnect();
      desktop.removeEventListener('change', configure); reduced.removeEventListener('change', configure);
      window.removeEventListener('scroll', request); window.removeEventListener('resize', configure);
      window.removeEventListener('twin:journey', onJump); document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  useEffect(() => {
    if (!expanded) return;
    const node = dialog.current!;
    const overflow = document.body.style.overflow;
    node.showModal(); document.body.style.overflow = 'hidden';
    return () => { node.close(); document.body.style.overflow = overflow; origin.current?.focus({ preventScroll: true }); };
  }, [expanded]);
  const expand = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); origin.current = event.currentTarget; setExpanded(id);
  };
  const expandLink = (id: string) => <a className="scene-expand" href={original(id)} onClick={event => expand(event, id)}>Развернуть изображение<span aria-hidden="true"> ↗</span></a>;
  return <section ref={host} className="journey" data-enhanced={enhanced} data-scene={scenes[reading.active].id} aria-label="Проект, пространство и лот">
    <div className="journey-static content-container" hidden={enhanced}>
      <Media name="topFacade" alt="Вертикальный фасад демонстрационного проекта" className="static-facade" />
      <nav className="static-scene-nav" aria-label="Масштаб исследования">{scenes.map((scene, index) => <a key={scene.id} href={`#${scene.id}`}>{navigation(scene, index)}</a>)}</nav>
      {scenes.map(scene => <article key={scene.id} id={enhanced ? undefined : scene.id} className="static-scene">
        <div className="scene-eyebrow">{scene.eyebrow}</div><h2>{heading(scene)}</h2><p>{scene.body}</p><Media name={scene.media} alt={scene.alt} /><div className="scene-caption"><small>{disclaimer}</small>{expandLink(scene.id)}</div>
      </article>)}
    </div>
    <div className="journey-cinematic" hidden={!enhanced}>
      <div className="journey-grid">
        <div className="cinematic-facade"><Media name="topFacade" alt="Постоянный вертикальный фасад проекта" /></div>
        <div className="journey-right">
          <div className="scene-text-zone">{scenes.map((scene, index) => <div className="scene-text-group" key={scene.id} data-layer={index} aria-hidden={reading.title !== index} inert={reading.title !== index}><div className="scene-eyebrow">{scene.eyebrow}</div><h2>{heading(scene)}</h2><p>{scene.body}</p></div>)}</div>
          <nav className="scene-navigation" aria-label="Масштаб исследования">{scenes.map((scene, index) => <button key={scene.id} type="button" id={enhanced ? scene.id : undefined} aria-pressed={reading.active === index} onClick={() => jump.current(scene.id)}>{navigation(scene, index)}</button>)}</nav>
          <div className="scene-materials">{scenes.map((scene, index) => <div key={scene.id} data-layer={index} className={`scene-material scene-material-${scene.id}`} aria-hidden={reading.active !== index}><Media name={scene.media} alt={scene.alt} /></div>)}</div>
          <div className="scene-caption"><small>{disclaimer}</small>{expandLink(scenes[reading.active].id)}</div>
        </div>
      </div>
      <div className="scene-progress" aria-hidden="true"><span /></div>
    </div>
    <dialog ref={dialog} className="scene-original-dialog" aria-labelledby="scene-original-title" onCancel={event => { event.preventDefault(); setExpanded(null); }} onClick={event => { if (event.target === event.currentTarget) setExpanded(null); }}>
      {expanded && <div className="scene-original-inner"><div className="scene-original-header"><h2 id="scene-original-title">{scenes.find(scene => scene.id === expanded)?.navigation_title} — полный оригинал</h2><button type="button" onClick={() => setExpanded(null)} autoFocus>Закрыть ×</button></div><img src={original(expanded)} alt={scenes.find(scene => scene.id === expanded)?.alt} /><a className="text-link" href={original(expanded)} target="_blank" rel="noreferrer">Открыть оригинал в отдельной вкладке ↗</a></div>}
    </dialog>
  </section>;
}
