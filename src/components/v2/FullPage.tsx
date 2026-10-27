import { useEffect, useRef, useState } from 'react';
import { ProductDemo } from '../ProductDemo';
import { Composition } from '../Composition';
import { Channels } from '../Channels';
import { Delivery, Launch } from '../Delivery';
import { ContactForm } from '../ContactForm';
import { initialSelection, validateSelection, type Selection } from '../../lib/config';

/** V2 orchestrates the existing product controls and honest demo form; V1 stays untouched. */
export function FullPage() {
  const [selection, setSelection] = useState(initialSelection), [topic, setTopic] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const changeSelection = (next: Selection) => { setSelection(next); try { sessionStorage.setItem('twin-v2-selection',JSON.stringify(next)); } catch { /* optional local restoration */ } };
  useEffect(() => {
    try { const saved=sessionStorage.getItem('twin-v2-selection');if(saved)setSelection(validateSelection(JSON.parse(saved))); } catch { /* original example remains available */ }
    const el = root.current!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const groups = [...el.querySelectorAll<HTMLElement>('.section-heading,.center-heading,.map-component,.map-core,.story-channel-heading,.story-quality-heading,.story-launch li,.contact-copy,.contact form')];
    // Entry is a separate wrapper/WAAPI owner, never a scroll-controlled photo or quality layer.
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      if (!reduced.matches) animations.push(entry.target.animate([{opacity:.25,translate:'0 16px'},{opacity:1,translate:'0 0'}],{duration:560,easing:'cubic-bezier(.22,1,.36,1)'}));
    } }, {threshold:0,rootMargin:'0px 0px -5% 0px'});
    groups.forEach(n => observer.observe(n));
    const restore = () => animations.forEach(a => a.finish());
    window.addEventListener('pageshow',restore);
    return () => {observer.disconnect();animations.forEach(a=>a.cancel());window.removeEventListener('pageshow',restore);};
  }, []);
  return <div className="tv2-rest" ref={root}>
    <section className="tv2-demo-chapter tv2-wrap" aria-labelledby="demo-chapter-title">
      <header className="tv2-chapter-heading"><span className="eyebrow">От исследования — к выбору</span><h2 id="demo-chapter-title">Попробуйте <span className="bronze">Twin в работе</span></h2><p>От знакомства с проектом — к обсуждению конкретного лота</p></header>
      <ProductDemo selection={selection} onChange={changeSelection}/>
    </section>
    <div className="tv2-system-chapter tv2-wrap"><Composition onTopic={setTopic}/></div>
    <div className="tv2-section-bridge tv2-wrap"><span>Один проект</span><p>Используйте эту основу во всех каналах продаж</p></div>
    <div className="tv2-channel-chapter tv2-wrap"><Channels/></div>
    <div className="tv2-quality-chapter tv2-wrap"><Delivery/></div>
    <div className="tv2-launch-chapter tv2-wrap"><Launch/></div>
    <div className="tv2-contact-chapter tv2-wrap"><ContactForm topic={topic} onTopic={setTopic} selection={selection}/></div>
  </div>;
}
