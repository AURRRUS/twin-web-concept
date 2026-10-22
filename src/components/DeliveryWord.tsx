import { useEffect, useRef } from 'react';

/** The outer slot is always the width of Эффективно; only the measured insertion expands. */
export function DeliveryWord() {
  const word = useRef<HTMLSpanElement>(null), probe = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let alive = true;
    const measure = () => { if(alive && word.current && probe.current) word.current.style.setProperty('--iv-unit',`${probe.current.getBoundingClientRect().width}px`); };
    void document.fonts.ready.then(measure);window.addEventListener('resize',measure);
    return () => {alive=false;window.removeEventListener('resize',measure);};
  },[]);
  return <><span className="iv-probe" ref={probe} aria-hidden="true">ив</span><span className="delivery-word" ref={word}><span className="delivery-word-sr" data-word-label="">Эффективно</span><span className="word-probe" aria-hidden="true">Эффективно</span><span className="delivery-word-static" aria-hidden="true">Эффективно</span><span className="effect-row" aria-hidden="true"><span>Эффект</span><span className="iv-window"><span>ив</span></span><span>но</span></span></span></>;
}
