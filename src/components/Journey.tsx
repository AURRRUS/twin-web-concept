import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Media } from './Media';
import { journeyFrame, createProgressDriver, sceneTargets } from '../lib/journeyMotion';
import content from '../lib/journeyStates.json';
import {bindShortWords} from '../lib/text';
import { sitePath } from '../lib/paths';

const scenes=content.states.map((s,index)=>({...s,eyebrow:bindShortWords(s.eyebrow),heading_lines:s.title.map(bindShortWords),body_lines:s.description.map(bindShortWords),navigation_title:s.label,navigation_description_lines:s.navigation.map(bindShortWords),media:({project:'r2JourneyProject',corpus:'r2JourneyCorpus',floor:'r2JourneyFloor',lot:'r2JourneyLot'} as const)[s.id as 'project'|'corpus'|'floor'|'lot'],alt:`Иллюстрация интерфейса — ${s.label}`,target:sceneTargets[index]}));
type Scene = typeof scenes[number];
const heading = (scene: Scene) => <><span>{scene.heading_lines[0]}</span>{' '}<span className="bronze">{scene.heading_lines[1]}</span></>;
const navigation = (scene: Scene, index: number) => <><span className="scene-number">0{index + 1}</span><span><strong>{scene.navigation_title}</strong><span className="scene-nav-description">{scene.navigation_description_lines[0]}{' '}<br />{scene.navigation_description_lines[1]}</span></span></>;
const description = (scene: Scene) => scene.body_lines.map((line,index) => <span className="scene-body-line" key={index}>{line}{index === 0 ? ' ' : ''}</span>);
const disclaimer = 'Иллюстрация интерфейса. Данные демонстрационные.';
const original = (id: string) => sitePath(`/media/final-r2/journey/${id}.png`);

export function Journey() {
  const host = useRef<HTMLElement>(null);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'mobile'>('mobile');
  const [layoutReady, setLayoutReady] = useState(false);
  const [reading, setReading] = useState({ active: 0, title: 0, explanation: 0 });
  const [expanded, setExpanded] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const origin = useRef<HTMLElement | null>(null);
  const jump = useRef<(id: string, immediate?: boolean) => void>(() => {});
  useEffect(() => {
    const node = host.current!;
    const panel = node.querySelector<HTMLElement>('.journey-cinematic')!;
    const columns = matchMedia('(min-width: 1024px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let enabled = false, disposed = false, fontsReady = false, imagesReady = false, hashChecked = false;
    let current = { active: -1, title: -1, explanation: -1 };
    let driver: ReturnType<typeof createProgressDriver> | undefined;
    const read = () => {
      const rect = node.getBoundingClientRect();
      return Math.max(0, Math.min(1, -rect.top / Math.max(1, node.offsetHeight - panel.offsetHeight)));
    };
    const write = (frame: ReturnType<typeof journeyFrame>, progress: number) => {
      for (const group of ['titleOpacity','titleY','titleClip','titleClipTop','titleClipBottom','bodyOpacity','bodyY','bodyClipTop','bodyClipBottom','mediaOpacity','mediaScale','mediaY','mediaClipBottom'] as const) {
        frame[group].forEach((value, index) => node.style.setProperty(`--${group}-${index}`, `${value}${group.endsWith('Y') ? 'px' : group.includes('Clip') ? '%' : ''}`));
      }
      node.style.setProperty('--scene-progress', String(progress));
      if (current.active !== frame.active || current.title !== frame.title || current.explanation !== frame.explanation) {
        if (current.active !== frame.active) window.dispatchEvent(new CustomEvent('twin:scene-active', { detail: scenes[frame.active].id }));
        current = { active: frame.active, title: frame.title, explanation: frame.explanation };
        setReading(current);
      }
    };
    const request = () => driver?.request();
    const configure = () => {
      if (disposed || !fontsReady) return;
      if(columns.matches && !reduced.matches && !imagesReady)return;
      driver?.destroy(); driver = undefined;
      let mode:'desktop'|'mobile' = columns.matches && !reduced.matches ? 'desktop' : 'mobile';
      node.dataset.layoutMode = mode;
      setLayoutMode(mode);
      panel.hidden = mode !== 'desktop';
      node.dataset.density = innerHeight < 850 ? 'compact' : 'regular';
      let fits = columns.matches && !reduced.matches;
      if (fits) {
        // Measure the real text and image footprint, including the longest hidden text group.
        node.dataset.measuring = 'true'; panel.hidden = false;
        const right = panel.querySelector<HTMLElement>('.journey-right')!;
        const text = panel.querySelector<HTMLElement>('.scene-text-zone')!;
        const image = panel.querySelector<HTMLElement>('.scene-materials')!;
        const nav = panel.querySelector<HTMLElement>('.scene-navigation')!;
        const caption = panel.querySelector<HTMLElement>('.scene-caption')!;
        node.dataset.motionEnabled='true';
        const measure=()=>{const css=getComputedStyle(right);const fixed=text.offsetHeight+parseFloat(getComputedStyle(text).marginBottom)+caption.offsetHeight+parseFloat(getComputedStyle(caption).marginTop)+parseFloat(css.paddingTop)+parseFloat(css.paddingBottom);node.style.setProperty('--journey-media-height',`${Math.max(0,innerHeight-fixed)}px`);const needed=fixed+Math.max(nav.scrollHeight,image.offsetHeight);node.dataset.neededHeight=String(needed);return needed<=innerHeight+1;};
        fits=measure();if(!fits&&node.dataset.density==='regular'){node.dataset.density='compact';fits=measure();}
        delete node.dataset.measuring;
      }
      if(!fits&&mode==='desktop'){mode='mobile';node.dataset.layoutMode=mode;setLayoutMode(mode);panel.hidden=true;}
      enabled = fits; node.dataset.motionEnabled = String(fits); setMotionEnabled(fits); setLayoutReady(true);
      if (!fits && mode === 'desktop') write(journeyFrame(scenes[Math.max(0,current.active)].target), scenes[Math.max(0,current.active)].target);
      if (fits) { driver = createProgressDriver(read, write); requestAnimationFrame(() => { if (!disposed) driver?.snap(); }); }
      if (!hashChecked) { hashChecked = true; requestAnimationFrame(() => { if (!disposed) hashJump(); }); }
    };
    const visibility = () => { if (document.hidden) { driver?.destroy(); driver = undefined; } else if (enabled) { driver = createProgressDriver(read, write); driver.snap(); } };
    jump.current = (id, immediate = false) => {
      const scene = scenes.find(item => item.id === id);
      if (!scene) return;
      if (!enabled) {
        if (node.dataset.layoutMode==='desktop') {write(journeyFrame(scene.target),scene.target);node.dispatchEvent(new CustomEvent('twin:settle-reveal',{bubbles:true}));}
        else document.getElementById(id)?.scrollIntoView({ behavior: 'auto' });
        return;
      }
      window.scrollTo({ top: node.getBoundingClientRect().top + scrollY + Math.max(0, node.offsetHeight - panel.offsetHeight) * scene.target, behavior: immediate ? 'instant' : 'smooth' });
      if (immediate) { driver?.snap(); node.dispatchEvent(new CustomEvent('twin:settle-reveal', {bubbles:true})); }
    };
    const hashJump = () => {
      const id = location.hash.slice(1);
      if (!scenes.some(scene => scene.id === id)) return;
      jump.current(id, true);
      if (!enabled && node.dataset.layoutMode==='desktop') node.scrollIntoView({behavior:'instant'});
    };
    const onJump = (event: Event) => jump.current((event as CustomEvent<string>).detail);
    const decode = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      void Promise.allSettled([...node.querySelectorAll<HTMLImageElement>('.scene-material img')].map(image => { image.loading = 'eager'; return image.decode(); })).then(() => {imagesReady=true;configure();});
      decode.disconnect();
    }, { rootMargin: '100% 0px' });
    decode.observe(node);
    const resize = new ResizeObserver(request); resize.observe(node);
    void Promise.all([400, 600, 700, 900].map(weight => document.fonts.load(`${weight} 24px "Twin Dewi Expanded"`, 'ЦифроваяЁё'))).then(() => {
      fontsReady = true; configure(); return document.fonts.ready;
    }).then(configure);
    columns.addEventListener('change', configure); reduced.addEventListener('change', configure);
    window.addEventListener('scroll', request, { passive: true }); window.addEventListener('resize', configure);
    window.addEventListener('hashchange', hashJump); window.addEventListener('twin:journey', onJump); document.addEventListener('visibilitychange', visibility);
    return () => {
      disposed = true; driver?.destroy(); decode.disconnect(); resize.disconnect();
      columns.removeEventListener('change', configure); reduced.removeEventListener('change', configure);
      window.removeEventListener('scroll', request); window.removeEventListener('resize', configure);
      window.removeEventListener('hashchange', hashJump); window.removeEventListener('twin:journey', onJump); document.removeEventListener('visibilitychange', visibility);
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
  return <section ref={host} className="journey" data-craft-repeat="after-exit" data-enhanced={layoutReady ? motionEnabled : 'pending'} data-layout-mode={layoutMode} data-motion-enabled={motionEnabled} data-scene={scenes[reading.active].id} aria-label="Проект, корпус, этаж и лот">
    <div className="journey-static content-container" hidden={layoutMode === 'desktop'}>
      <Media name="topFacade" alt="Вертикальный фасад демонстрационного проекта" className="static-facade" />
      <nav className="static-scene-nav" aria-label="Масштаб исследования">{scenes.map((scene, index) => <a key={scene.id} href={`#${scene.id}`}>{navigation(scene, index)}</a>)}</nav>
      {scenes.map(scene => <article key={scene.id} id={layoutMode === 'desktop' ? undefined : scene.id} className="static-scene">
        <div data-craft-reveal="eyebrow" className="scene-eyebrow">{scene.eyebrow}</div><h2 data-craft-reveal="title">{heading(scene)}</h2><p data-craft-reveal="body">{description(scene)}</p><div className="static-media-viewport"><div data-craft-reveal="media"><Media name={scene.media} alt={scene.alt} /></div></div><div className="scene-caption"><small>{disclaimer}</small>{expandLink(scene.id)}</div>
      </article>)}
    </div>
    <div className="journey-cinematic" hidden={layoutReady && layoutMode !== 'desktop'}>
      <div className="journey-grid">
        <div className="cinematic-facade"><Media name="topFacade" alt="Постоянный вертикальный фасад проекта" /></div>
        <div className="journey-right">
          <div className="scene-text-zone">
            <div className="scene-title-slot" data-craft-reveal="title">{scenes.map((scene,index)=><div className="scene-title-group" data-layer={index} key={scene.id} aria-hidden={reading.title!==index}><div className="scene-eyebrow">{scene.eyebrow}</div><h2>{heading(scene)}</h2></div>)}</div>
            <div className="scene-body-slot" data-craft-reveal="body">{scenes.map((scene,index)=><p className="scene-body-group" data-layer={index} key={scene.id} aria-hidden={reading.explanation!==index}>{description(scene)}</p>)}</div>
          </div>
          <nav className="scene-navigation" aria-label="Масштаб исследования">{scenes.map((scene, index) => <button key={scene.id} type="button" id={layoutMode === 'desktop' ? scene.id : undefined} aria-pressed={reading.active === index} aria-current={reading.active === index ? 'step' : undefined} onClick={() => jump.current(scene.id)}>{navigation(scene, index)}</button>)}</nav>
          <div className="scene-materials"><div className="scene-sheet-entry" data-craft-reveal="media">{scenes.map((scene, index) => <div key={scene.id} data-layer={index} className={`scene-material scene-material-${scene.id}`} aria-hidden={reading.active !== index}><Media name={scene.media} alt={scene.alt} /></div>)}</div></div>
          <div className="scene-caption"><small>{disclaimer}</small><a className="scene-demo" href={sitePath('/demo')}>Открыть демо</a>{expandLink(scenes[reading.active].id)}</div>
        </div>
      </div>
      <div className="scene-progress" aria-hidden="true"><span /></div>
    </div>
    <dialog ref={dialog} className="scene-original-dialog" aria-labelledby="scene-original-title" onCancel={event => { event.preventDefault(); setExpanded(null); }} onClick={event => { if (event.target === event.currentTarget) setExpanded(null); }}>
      {expanded && <div className="scene-original-inner"><div className="scene-original-header"><h2 id="scene-original-title">{scenes.find(scene => scene.id === expanded)?.navigation_title} — полный оригинал</h2><button type="button" onClick={() => setExpanded(null)} autoFocus>Закрыть ×</button></div><img src={original(expanded)} alt={scenes.find(scene => scene.id === expanded)?.alt} /><a className="text-link" href={original(expanded)} target="_blank" rel="noreferrer">Открыть оригинал в отдельной вкладке ↗</a></div>}
    </dialog>
  </section>;
}
