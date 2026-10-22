import { useEffect, useRef } from 'react';
import { sitePath } from '../lib/paths';
import { Arrow, Media } from './Media';

export function Header({ demo = false }: { demo?: boolean }) {
  return <header className={`site-header content-container ${demo ? 'on-demo' : ''}`}>
    <a className="brand" href={sitePath('/')} aria-label="Twin by TALENT — главная"><Media name="logo" alt="Twin by TALENT" eager /></a>
    <nav aria-label="Основная навигация"><a href={sitePath('/#product')}>Продукт</a><a href={sitePath('/#channels')}>Сценарии</a><a href={sitePath('/#composition')}>Состав и запуск</a></nav>
    <a className={demo ? 'text-link' : 'button header-cta'} href={sitePath(demo ? '/' : '/#contact')}>{demo ? 'Вернуться на сайт' : 'Обсудить проект'}<Arrow /></a>
  </header>;
}
export function Hero() {
  const subtitle = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    let alive = true;
    const measure = () => {
      if (!alive || !subtitle.current) return;
      const row = subtitle.current.querySelector<HTMLElement>('.hero-subtitle-row:last-child')!;
      row.dataset.fits = 'false';
      if (innerWidth >= 1280) {
        // Measure a real unwrapped glyph run without forcing a wide page.
        const canvas = document.createElement('canvas').getContext('2d')!;
        canvas.font = getComputedStyle(row).font;
        row.dataset.fits = String(canvas.measureText(row.textContent || '').width <= subtitle.current.clientWidth);
      }
    };
    void document.fonts.ready.then(measure); window.addEventListener('resize', measure);
    return () => { alive = false; window.removeEventListener('resize', measure); };
  }, []);
  return <section className="hero" aria-labelledby="hero-heading">
    <Media name="topHero" alt="Иллюстративный прибрежный девелоперский проект" eager className="hero-image" />
    <Header />
    <div className="content-container hero-content"><div className="hero-copy">
      <h1 id="hero-heading"><span className="hero-line">Цифровая инфраструктура продаж</span>{' '}<span className="hero-line">девелоперского проекта</span></h1>
      <p ref={subtitle}><span className="hero-subtitle-row">Раскрывайте преимущества проекта</span>{' '}<span className="hero-subtitle-row">и помогайте покупателю выбирать — на сайте, дистанционно, через агентов и в офисе продаж.</span></p>
      <div className="actions"><a className="button" href={sitePath('/demo')}>Посмотреть Twin<Arrow /></a></div>
    </div></div>
    <span className="hero-caption"><span />Демонстрационный проект</span>
  </section>;
}
