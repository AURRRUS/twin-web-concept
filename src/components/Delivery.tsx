import { useRef } from 'react';
import content from '../lib/salesStoryContent.json';
import { useQualityReveal } from '../lib/useQualityReveal';
import { bindShortWords as t } from '../lib/text';
import { Media, Arrow } from './Media';
import { sitePath } from '../lib/paths';
export function Delivery() {
  const host = useRef<HTMLDivElement>(null), copy = content.qualities;
  useQualityReveal(host);
  return <section className="story-qualities story-shell" id="delivery" aria-labelledby="delivery-heading">
    <div className="quality-layout">
      <div className="quality-copy" data-entry="title">
        <header className="story-quality-heading"><p>{copy.lead}</p><h2 id="delivery-heading">{copy.heading.main}{' '}<span className="bronze">{copy.heading.bronze}</span></h2></header>
        <a id="qualities-demo" className="text-link" href={sitePath('/demo')}>{content.cta.demo}<Arrow /></a>
      </div>
      <div ref={host} className="quality-canvas story-quality-diagram" data-enhanced="false">
        <svg viewBox="0 0 720 760" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path className="quality-edge-one" pathLength="1" d="M360 124 L110 557.013" />
          <path className="quality-edge-two" pathLength="1" d="M110 557.013 L610 557.013" />
          <path className="quality-edge-three" pathLength="1" d="M610 557.013 L360 124" />
          <circle cx="360" cy="124" r="4" /><circle cx="110" cy="557.013" r="4" /><circle cx="610" cy="557.013" r="4" />
        </svg>
        <article data-quality="time" className="story-quality-time"><h3>{copy.arguments[0].label}</h3><strong>{t(copy.arguments[0].value)}</strong><p>{t(copy.arguments[0].description)}</p></article>
        <article data-quality="budget" className="story-quality-budget"><h3>{copy.arguments[1].label}</h3><strong>{t(copy.arguments[1].value)}</strong><p>{copy.arguments[1].prefix}</p><p className="quality-mobile-description">{t(copy.arguments[1].description)}</p></article>
        <div className="story-quality-model"><Media name="core" alt="Модель демонстрационного проекта" /></div>
        <article data-quality="application" className="story-quality-application">
          <h3><span className="story-quality-word" aria-label="Эффективно"><span aria-hidden="true">Эффектно</span><span aria-hidden="true">Эффективно</span></span></h3>
          <strong>{t(copy.arguments[2].value)}</strong><p className="quality-diagram-description">{t(copy.arguments[2].diagram_description!)}</p><p className="quality-mobile-description">{t(copy.arguments[2].mobile_description!)}</p>
        </article>
      </div>
    </div>
    <div className="story-quality-footer"><p>{t(copy.note)}</p></div>
  </section>;
}
export function Launch() {
  return <section id="launch" className="story-launch story-shell" aria-labelledby="launch-heading"><h2 id="launch-heading" data-entry="title">{content.launch.heading}</h2><ol>{content.launch.steps.map(step => <li key={step.index} data-entry="launch"><span>{step.index}</span><h3>{t(step.title)}</h3><p>{t(step.description)}</p></li>)}</ol></section>;
}
