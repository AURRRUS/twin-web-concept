import { useEffect, useRef, useState } from 'react';
import { Media } from './Media';
import { journeyFrame } from '../lib/journeyMotion';

const scenes = [
  { id: 'project', title: 'Проект', eyebrow: 'ПРОЕКТ — ОТ ОКРУЖЕНИЯ К ПРЕИМУЩЕСТВАМ', lines: ['Покажите, что делает', 'проект ценным.'], navigation: ['Окружение, архитектура', 'и инфраструктура.'], detail: 'Окружение, архитектура, инфраструктура и расположение корпусов — помогите покупателю увидеть проект целиком и понять, как его преимущества связаны с выбором конкретного лота.', media: 'sceneProject', alt: 'Иллюстрация интерфейса: инфраструктура прибрежного проекта', target: .10 },
  { id: 'space', title: 'Пространство', eyebrow: 'ПРОСТРАНСТВО — ОТ ОБЩЕГО ВИДА К ОЩУЩЕНИЮ', lines: ['Дайте почувствовать', 'пространство.'], navigation: ['Общественные зоны,', 'интерьеры и виды.'], detail: 'Покажите, как устроена жизнь внутри проекта: общественные зоны, интерьеры, террасы и виды. Помогите покупателю представить пространство будущего лота и понять, что находится за пределами его планировки.', media: 'sceneSpace', alt: 'Иллюстрация интерфейса: терраса с видом на море', target: .50 },
  { id: 'lot', title: 'Лот', eyebrow: 'ЛОТ — ОТ РАСПОЛОЖЕНИЯ К ДЕТАЛЯМ', lines: ['Раскройте', 'конкретный лот.'], navigation: ['Расположение, планировка', 'и детали выбора.'], detail: 'Свяжите расположение лота в корпусе и на этаже с его планировкой, пространством и видом. Дайте покупателю последовательно рассмотреть детали выбранного варианта.', media: 'sceneLot', alt: 'Иллюстрация интерфейса: план этажа и выбранный лот', target: .90 },
] as const;
const heading = (scene: typeof scenes[number]) => <><span>{scene.lines[0]}</span>{' '}<span>{scene.lines[1]}</span></>;
const navigation = (scene: typeof scenes[number], index: number) => <><span className="scene-number">0{index + 1}</span><span><strong>{scene.title}</strong><span className="scene-nav-description">{scene.navigation[0]}{' '}<br />{scene.navigation[1]}</span></span></>;
const disclaimer = 'Иллюстрация интерфейса. Данные демонстрационные.';

export function Journey() {
  const host = useRef<HTMLElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [reading, setReading] = useState({ active: 0, title: 0, explanation: 0 });
  const jump = useRef<(id: string) => void>(() => {});
  useEffect(() => {
    const node = host.current!;
    const desktop = matchMedia('(min-width: 1280px) and (min-height: 900px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let current = { active: -1, title: -1, explanation: -1 };
    const update = () => {
      raf = 0;
      if (document.hidden || !desktop.matches || reduced.matches) return;
      const rect = node.getBoundingClientRect();
      const panel = node.querySelector<HTMLElement>('.journey-cinematic')!;
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, node.offsetHeight - panel.offsetHeight)));
      const frame = journeyFrame(progress);
      for (const group of ['heading', 'headingY', 'media', 'mediaY', 'copy', 'copyY'] as const) {
        frame[group].forEach((value, index) => node.style.setProperty(`--${group}-${index}`, `${value}${group.endsWith('Y') ? 'px' : ''}`));
      }
      node.style.setProperty('--scene-progress', String(progress));
      if (current.active !== frame.active || current.title !== frame.title || current.explanation !== frame.explanation) {
        if (current.active !== frame.active) window.dispatchEvent(new CustomEvent('twin:scene-active', { detail: scenes[frame.active].id }));
        current = { active: frame.active, title: frame.title, explanation: frame.explanation };
        setReading(current);
      }
    };
    const request = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(update); };
    const configure = () => {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      setEnhanced(desktop.matches && !reduced.matches); request();
    };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else request(); };
    jump.current = id => {
      const scene = scenes.find(item => item.id === id);
      if (!scene) return;
      if (!desktop.matches || reduced.matches) { document.getElementById(id)?.scrollIntoView({ behavior: 'auto' }); return; }
      const panel = node.querySelector<HTMLElement>('.journey-cinematic')!;
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
    configure();
    desktop.addEventListener('change', configure); reduced.addEventListener('change', configure);
    window.addEventListener('scroll', request, { passive: true }); window.addEventListener('resize', configure);
    window.addEventListener('twin:journey', onJump); document.addEventListener('visibilitychange', visibility);
    return () => {
      cancelAnimationFrame(raf); decode.disconnect(); resize.disconnect();
      desktop.removeEventListener('change', configure); reduced.removeEventListener('change', configure);
      window.removeEventListener('scroll', request); window.removeEventListener('resize', configure);
      window.removeEventListener('twin:journey', onJump); document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  return <section ref={host} className="journey" data-enhanced={enhanced} data-scene={scenes[reading.active].id} aria-label="Проект, пространство и лот">
    <div className="journey-static content-container" hidden={enhanced}>
      <Media name="topFacade" alt="Вертикальный фасад демонстрационного проекта" className="static-facade" />
      <nav className="static-scene-nav" aria-label="Масштаб исследования">{scenes.map((scene, index) => <a key={scene.id} href={`#${scene.id}`}>{navigation(scene, index)}</a>)}</nav>
      {scenes.map(scene => <article key={scene.id} id={enhanced ? undefined : scene.id} className="static-scene">
        <div className="scene-eyebrow">{scene.eyebrow}</div><h2>{heading(scene)}</h2><p>{scene.detail}</p><Media name={scene.media} alt={scene.alt} /><small>{disclaimer}</small>
      </article>)}
    </div>
    <div className="journey-cinematic" hidden={!enhanced}>
      <div className="journey-grid content-container">
        <div className="cinematic-facade"><Media name="topFacade" alt="Постоянный вертикальный фасад проекта" /></div>
        <nav className="scene-navigation" aria-label="Масштаб исследования">{scenes.map((scene, index) => <button key={scene.id} type="button" id={enhanced ? scene.id : undefined} aria-pressed={reading.active === index} onClick={() => jump.current(scene.id)}>{navigation(scene, index)}</button>)}</nav>
        <div className="journey-right">
          <div className="scene-text-zone">
            <div className="scene-headings">{scenes.map((scene, index) => <div key={scene.id} data-layer={index} aria-hidden={reading.title !== index}><div className="scene-eyebrow">{scene.eyebrow}</div><h2>{heading(scene)}</h2></div>)}</div>
            <div className="scene-explanations">{scenes.map((scene, index) => <p key={scene.id} data-layer={index} aria-hidden={reading.explanation !== index}>{scene.detail}</p>)}</div>
          </div>
          <div className="scene-materials">{scenes.map((scene, index) => <div key={scene.id} data-layer={index} className={`scene-material scene-material-${scene.id}`} aria-hidden={reading.active !== index}><Media name={scene.media} alt={scene.alt} /></div>)}</div>
          <div className="scene-caption"><small>{disclaimer}</small></div>
        </div>
      </div>
      <div className="scene-progress" aria-hidden="true"><span /></div>
    </div>
  </section>;
}
