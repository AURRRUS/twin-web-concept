import { useEffect, useRef, useState } from 'react';
import { Media } from './Media';
import { Icon } from './Icon';

const scenes = [
  { id: 'project', title: 'Проект', detail: 'Окружение и архитектура', media: 'project', alt: 'Окружение демонстрационного проекта у моря', target: 0.12 },
  { id: 'space', title: 'Пространство', detail: 'Территория и пространство', media: 'interior', alt: 'Терраса и интерьер демонстрационного проекта', target: 0.49 },
  { id: 'lot', title: 'Лот', detail: 'Планировка, положение и вид', media: 'lot', alt: 'Иллюстративная объёмная планировка выбранного лота', target: 0.88 },
] as const;
export function Journey() {
  const host = useRef<HTMLElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);
  const jump = useRef<(id: string) => void>(() => {});
  useEffect(() => {
    const node = host.current!;
    const desktop = matchMedia('(min-width: 1280px) and (min-height: 800px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let last = -1;
    const update = () => {
      frame = 0;
      if (document.hidden || !desktop.matches || reduced.matches) return;
      const rect = node.getBoundingClientRect();
      if (rect.top > innerHeight || rect.bottom < 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
      const space = Math.max(0, Math.min(1, (progress - 0.28) / 0.08));
      const lot = Math.max(0, Math.min(1, (progress - 0.64) / 0.08));
      node.style.setProperty('--scene-space', String(space));
      node.style.setProperty('--scene-lot', String(lot));
      node.style.setProperty('--facade-offset', `${progress * -3.5}%`);
      node.style.setProperty('--scene-progress', String(progress));
      const next = progress < 0.36 ? 0 : progress < 0.72 ? 1 : 2;
      if (next !== last) { last = next; setActive(next); window.dispatchEvent(new CustomEvent('twin:scene-active', { detail: scenes[next].id })); }
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(update); };
    const configure = () => { setEnhanced(desktop.matches && !reduced.matches); request(); };
    jump.current = id => {
      const scene = scenes.find(s => s.id === id);
      if (!scene) return;
      const top = node.getBoundingClientRect().top + scrollY;
      const travel = Math.max(0, node.offsetHeight - innerHeight);
      window.scrollTo({ top: top + travel * scene.target, behavior: reduced.matches ? 'instant' : 'smooth' });
    };
    const onJump = (event: Event) => jump.current((event as CustomEvent<string>).detail);
    configure();
    desktop.addEventListener('change', configure); reduced.addEventListener('change', configure);
    window.addEventListener('scroll', request, { passive: true }); window.addEventListener('resize', request);
    window.addEventListener('twin:journey', onJump); document.addEventListener('visibilitychange', request);
    return () => { if (frame) cancelAnimationFrame(frame); desktop.removeEventListener('change', configure); reduced.removeEventListener('change', configure); window.removeEventListener('scroll', request); window.removeEventListener('resize', request); window.removeEventListener('twin:journey', onJump); document.removeEventListener('visibilitychange', request); };
  }, []);
  return <section ref={host} className="journey" data-enhanced={enhanced} data-scene={scenes[active].id} aria-labelledby="journey-heading">
    <div className="journey-static">
      <div className="journey-facade"><Media name="facade" alt="Фасад демонстрационного проекта с террасами" /><span className="facade-mark mark-one" aria-hidden="true" /><span className="facade-mark mark-two" aria-hidden="true" /></div>
      <div className="journey-story"><div className="journey-intro"><h2 id={enhanced ? undefined : 'journey-heading'}>Покажите, что делает проект ценным.</h2><p>Окружение, архитектура, инфраструктура, планировка и вид — в связи с конкретным выбором покупателя.</p></div>
        <article id={enhanced ? undefined : 'project'} className="story-step"><span className="step-number">01</span><div><h3>Проект</h3><p>Окружение и архитектура</p></div><span className="story-connector" aria-hidden="true" /></article>
        <Media name="project" alt="Панорама демонстрационного курорта с подписями окружения" className="journey-project" />
        <Media name="interior" alt="Иллюстративное пространство с террасой и видом на море" className="journey-interior" />
        <article id={enhanced ? undefined : 'space'} className="story-step"><span className="step-number">02</span><div><h3>Пространство</h3><p>Территория и пространство</p></div><span className="story-connector" aria-hidden="true" /></article>
        <div className="journey-lot"><article id={enhanced ? undefined : 'lot'} className="story-step"><span className="step-number">03</span><div><h3>Лот</h3><p>Планировка, положение и вид</p></div><span className="story-connector" aria-hidden="true" /></article><Media name="lot" alt="Демонстрационная объёмная планировка, не архитектурный чертёж" /></div>
      </div>
    </div>
    <div className="journey-cinematic" hidden={!enhanced}>
      <div className="cinematic-facade"><Media name="facade" alt="Фасад проекта — общая опора трёх сцен" /><span className="selected-facade-part" aria-hidden="true" /></div>
      <div className="cinematic-intro"><span className="eyebrow">ОТ ЦЕЛОГО — К ВАШЕМУ ВЫБОРУ</span><h2 id={enhanced ? 'journey-heading' : undefined}>Покажите, что делает проект ценным.</h2><p>Окружение, архитектура, инфраструктура, планировка и вид — в связи с конкретным выбором покупателя.</p></div>
      <div className="scene-navigation" aria-label="Масштаб исследования">{scenes.map((scene, i) => <button key={scene.id} type="button" id={enhanced ? scene.id : undefined} aria-pressed={active === i} onClick={() => jump.current(scene.id)}><span className="scene-number">0{i + 1}</span><span><strong>{scene.title}</strong><span>{scene.detail}</span></span><span className="scene-button-line" aria-hidden="true" /></button>)}</div>
      <div className="scene-materials">{scenes.map((scene, i) => <div key={scene.id} className={`scene-material scene-material-${scene.id}`} aria-hidden={active !== i}><Media name={scene.media} alt={scene.alt} /><span className="scene-media-caption"><Icon name={i === 2 ? 'plan' : i === 1 ? 'eye' : 'building'} />{scene.detail}</span></div>)}</div>
      <div className="scene-progress" aria-hidden="true"><span /></div>
    </div>
  </section>;
}
