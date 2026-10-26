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
        <header className="story-quality-heading"><p>{copy.lead}</p><h2 id="delivery-heading">{t(copy.heading.main)}{' '}<span className="bronze">{t(copy.heading.bronze)}</span></h2></header>
        <a id="qualities-demo" className="text-link" href={sitePath('/demo')}>{content.cta.demo}<Arrow /></a>
      </div>
      <div ref={host} className="quality-scene story-quality-diagram" data-enhanced="false">
        <article data-quality="time" aria-labelledby="quality-time-label" className="story-quality-time"><div className="quality-group-content"><p id="quality-time-label" className="quality-label">{copy.arguments[0].label}</p><strong>{t(copy.arguments[0].value)}</strong><p>{t(copy.arguments[0].description)}</p></div></article>
        <div className="quality-graphic">
          <svg viewBox="0 0 600 520" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <path className="quality-edge-one" pathLength="1" d="M300 20 L30 487.654" />
            <path className="quality-edge-two" pathLength="1" d="M30 487.654 L570 487.654" />
            <path className="quality-edge-three" pathLength="1" d="M570 487.654 L300 20" />
            <circle cx="300" cy="20" r="4" /><circle cx="30" cy="487.654" r="4" /><circle cx="570" cy="487.654" r="4" />
          </svg>
          <div className="story-quality-model"><Media name="core" alt="Модель демонстрационного проекта" /></div>
        </div>
        <div className="quality-bottom-facts">
          <article data-quality="budget" aria-labelledby="quality-budget-label" className="story-quality-budget"><div className="quality-group-content"><p id="quality-budget-label" className="quality-label">{copy.arguments[1].label}</p><strong>{t(copy.arguments[1].value)}</strong><p>{copy.arguments[1].prefix}</p><p>{t(copy.arguments[1].description)}</p></div></article>
          <article data-quality="application" aria-labelledby="quality-application-label" className="story-quality-application"><div className="quality-group-content">
            <p className="quality-label" id="quality-application-label"><span className="story-quality-word" aria-label="Эффективно"><span aria-hidden="true">Эффектно</span><span aria-hidden="true">Эффективно</span></span></p>
            <strong>{t(copy.arguments[2].value)}</strong><p>{t(copy.arguments[2].description)}</p>
          </div></article>
        </div>
      </div>
    </div>
    <div className="story-quality-footer"><p>{t(copy.note)}</p></div>
  </section>;
}
export function Launch() {
  return <section id="launch" className="story-launch story-shell" aria-labelledby="launch-heading"><h2 id="launch-heading" data-entry="title">{content.launch.heading}</h2><ol>{content.launch.steps.map(step => <li key={step.index} data-entry="launch"><span>{step.index}</span><h3>{t(step.title)}</h3><p>{t(step.description)}</p></li>)}</ol></section>;
}
