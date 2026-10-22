import { useEffect, useRef } from 'react';

/** Shared host progress, locally measured glyphs; no React render on scroll. */
export function DeliveryWord() {
  const word = useRef<HTMLSpanElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let alive = true;
    const measure = () => {
      if (alive && word.current && probe.current) word.current.style.setProperty('--iv-unit', `${probe.current.getBoundingClientRect().width}px`);
    };
    void document.fonts.ready.then(measure); window.addEventListener('resize', measure);
    return () => { alive = false; window.removeEventListener('resize', measure); };
  }, []);
  return <><span ref={probe} className="iv-probe" aria-hidden="true">ив</span><span className="delivery-word-sr">Качественно, эффектно, эффективно</span><span className="delivery-word-static" aria-hidden="true">Качественно · Эффектно · Эффективно</span><span ref={word} className="delivery-word" aria-hidden="true"><span className="word-probe">Качественно</span><span className="word-probe">Эффективно</span><span className="quality-row">Качественно</span><span className="effect-row"><span>Эффект</span><span className="iv-window"><span>ив</span></span><span>но</span></span></span></>;
}
