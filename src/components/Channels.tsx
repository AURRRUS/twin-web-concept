import { sitePath } from '../lib/paths';
import content from '../lib/salesStoryContent.json';
import { bindShortWords as t } from '../lib/text';
import { useStoryTrack } from '../lib/useStoryTrack';
import { StoryImage } from './StoryImage';
import { Arrow } from './Media';
export function Channels() {
  const { host, mode, active, jump } = useStoryTrack('channels');
  const scenes = content.channels;
  return <section ref={host} className="story-channels" id="channels" data-mode={mode} data-story-ready="false" aria-labelledby="channels-heading">
    <div className="story-panel story-shell"><div className="story-channel-layout entry-shell" data-entry="story-frame">
      <div className="story-channel-left">
        <header className="story-channel-heading"><h2 id="channels-heading"><span>{content.channels_heading.main}</span>{' '}<span className="bronze">{content.channels_heading.bronze}</span></h2><p>{t(content.channels_description)}</p></header>
        <nav className="story-channel-nav story-route" aria-label="Каналы продаж" onKeyDown={event => {
          if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
          const links = [...event.currentTarget.querySelectorAll('a')], index = links.indexOf(event.target as HTMLAnchorElement);
          if (index < 0) return;
          event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 3 : (index + (event.key === 'ArrowDown' ? 1 : 3)) % 4;
          links[next].focus({ preventScroll: true }); links[next].click();
        }}>{scenes.map((scene, i) => <a key={scene.id} href={`#channel-${scene.id}`} aria-current={active === i ? 'step' : undefined} onClick={event => {
          if (event.metaKey || event.ctrlKey) return;
          event.preventDefault(); const url = new URL(location.href); url.hash = `channel-${scene.id}`; history.pushState({}, '', url); jump.current(i);
        }}><span>0{i + 1}</span>{t(scene.label)}</a>)}</nav>
        <div className="story-channel-copy"><div className="story-slot">{scenes.map((scene, i) => <h3 key={scene.id} data-story-title className="story-copy" style={{ visibility: i === 0 ? 'visible' : 'hidden' }}>{t(scene.title)}</h3>)}</div><div className="story-slot">{scenes.map((scene, i) => <p key={scene.id} data-story-question className="story-copy" style={{ visibility: i === 0 ? 'visible' : 'hidden' }}>{t(scene.description)}</p>)}</div></div>
        <a id="channels-demo" className="text-link story-channel-cta" href={sitePath('/demo')}>{content.cta.demo}<Arrow /></a>
      </div>
      <div className="story-channel-art"><div className="story-media-stage">{scenes.map((scene, i) => <div className="story-photo" key={scene.id} id={`channel-${scene.id}`} style={{ zIndex: i + 1, visibility: i === 0 ? 'visible' : 'hidden' }}><StoryImage kind="channels" id={scene.id} alt={`Сценарий продаж — ${scene.label}`} /></div>)}</div></div>
    </div></div>
    <div className="story-channel-stories story-shell">{scenes.map(scene => <article key={scene.id} id={`channel-story-${scene.id}`}><span className="story-kicker">0{scene.index} · {t(scene.label)}</span><h3 data-entry="title">{t(scene.title)}</h3><p data-entry="body">{t(scene.description)}</p><div data-entry="media"><StoryImage kind="channels" id={scene.id} alt={`Сценарий продаж — ${scene.label}`} /></div></article>)}<a id="channels-mobile-demo" className="text-link" href={sitePath('/demo')}>{content.cta.demo}<Arrow /></a></div>
  </section>;
}
