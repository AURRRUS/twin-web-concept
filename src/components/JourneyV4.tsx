import { useState, useEffect, type CSSProperties } from 'react';
import content from '../lib/salesStoryContent.json';
import { bindShortWords as t } from '../lib/text';
import { useStoryTrack } from '../lib/useStoryTrack';
import { StoryImage } from './StoryImage';
import { focusRegions, storyOriginal } from '../lib/salesStoryMedia';
import { MediaViewer, type ViewerImage } from './MediaViewer';

export function JourneyV4() {
  const { host, mode, active, jump } = useStoryTrack('journey');
  const [detail, setDetail] = useState(true);
  const [viewer, setViewer] = useState<ViewerImage | null>(null);
  const scenes = content.journey;
  useEffect(() => {
    try { if (sessionStorage.getItem('twin-demo-restore') === 'true') {
      const origin = JSON.parse(sessionStorage.getItem('twin-demo-origin') || 'null');
      if (origin?.detail === 'false') setDetail(false);
    } } catch { /* Optional restoration. */ }
  }, []);
  return <section ref={host} className="story-journey" data-mode={mode} data-comparison-ready="false" aria-label="Journey — Большая сцена">
    <div className="story-panel story-shell"><div className="story-j4-frame"><div className="entry-shell" data-entry="story-frame">
      <header className="story-j4-header">
        <div className="story-slot story-j4-titles">{scenes.map((scene, i) => <div data-story-title key={scene.id} className="story-copy" style={{ visibility: i === 0 ? 'visible' : 'hidden' }}>
          <h2><span>{t(scene.heading.main)}</span>{' '}<span className="bronze">{t(scene.heading.bronze)}</span></h2>
        </div>)}</div>
        <div className="story-buyer"><span className="story-kicker">{t(scenes[0].buyer_label)}</span>
          <div className="story-slot">{scenes.map((scene, i) => <p data-story-question key={scene.id} className="story-copy" style={{ visibility: i === 0 ? 'visible' : 'hidden' }}>{t(scene.buyer_question)}</p>)}</div>
        </div>
      </header>
      <div className="story-j4-visual">
        <nav className="story-j4-route story-route" aria-label="Маршрут выбора" onKeyDown={event => {
          if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
          const buttons = [...event.currentTarget.querySelectorAll('button')], index = buttons.indexOf(event.target as HTMLButtonElement);
          if (index < 0) return;
          event.preventDefault();
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? 3 : (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : 3)) % 4;
          buttons[next].focus({ preventScroll: true }); buttons[next].click();
        }}>{scenes.map((scene, i) => <button id={`journey-variant-4-${scene.id}`} type="button" key={scene.id} aria-pressed={active === i} aria-current={active === i ? 'step' : undefined} onClick={() => jump.current(i)}><span>0{i + 1}</span>{t(scene.label)}</button>)}</nav>
        <div className="story-mobile-media-controls"><button aria-pressed={detail} onClick={() => setDetail(true)}>Деталь</button><button aria-pressed={!detail} onClick={() => setDetail(false)}>Весь экран</button><span>{scenes[active].label}</span></div>
        <div className="story-media-stage" data-detail={detail}>{scenes.map((scene, i) => <div className="story-photo" key={scene.id} data-state={scene.id} style={{ zIndex: i + 1, visibility: i === 0 ? 'visible' : 'hidden', '--focus-x': `${focusRegions[i].x}%`, '--focus-y': `${focusRegions[i].y}%`, '--focus-zoom': focusRegions[i].zoom } as CSSProperties}>
          <StoryImage kind="journey" id={scene.id} alt={`Иллюстрация выбора — ${scene.label}`} />
        </div>)}</div>
        <footer className="story-j4-sales">
          <div className="story-j4-application"><span className="story-kicker">{t(scenes[0].sales_label)}</span><div className="story-slot">{scenes.map((scene, i) => <p data-story-sales key={scene.id} className="story-copy" style={{ visibility: i === 0 ? 'visible' : 'hidden' }}>{t(scene.sales_application)}</p>)}</div></div>
          <a className="story-expand" href={storyOriginal(scenes[active].id)} aria-haspopup="dialog" onClick={event => {
            if (event.metaKey || event.ctrlKey) return;
            event.preventDefault(); setViewer({ src: storyOriginal(scenes[active].id), title: `${scenes[active].label} — полный кадр`, origin: event.currentTarget });
          }}>{content.expand} ↗</a>
          <small>{t(content.journey_disclaimer)}</small>
        </footer>
      </div>
    </div></div></div>
    <div className="story-nojs" hidden={mode !== 'flow'}>{scenes.map(scene => <article key={scene.id}><h2>{t(scene.heading.main)} <span className="bronze">{t(scene.heading.bronze)}</span></h2><span className="story-kicker">{scene.buyer_label}</span><p>{t(scene.buyer_question)}</p><StoryImage kind="journey" id={scene.id} alt={scene.label} /><span className="story-kicker">{scene.sales_label}</span><p>{t(scene.sales_application)}</p></article>)}</div>
    <MediaViewer image={viewer} onClose={() => setViewer(null)} />
  </section>;
}
