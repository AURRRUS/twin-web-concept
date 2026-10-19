import { sitePath } from '../lib/paths';
import { useEffect, useState } from 'react';
import content from '../../docs/handoff/04_DATA/twin-home-content.json';
import { Arrow, Media } from './Media';

export function Header({ demo = false }: { demo?: boolean }) {
  return <header className={`site-header ${demo ? 'on-demo' : ''}`}>
    <a className="brand" href={sitePath('/')} aria-label="Twin by TALENT — главная"><Media name="logo" alt="Twin by TALENT" eager /></a>
    <nav aria-label="Основная навигация"><a href={sitePath('/#product')}>Продукт</a><a href={sitePath('/#channels')}>Сценарии</a><a href={sitePath('/#composition')}>Состав и запуск</a></nav>
    <a className={demo ? 'text-link' : 'button header-cta'} href={sitePath(demo ? '/' : '/demo')}>{demo ? 'Вернуться на сайт' : 'Посмотреть Twin'}<Arrow /></a>
  </header>;
}
export function Hero() {
  const [active, setActive] = useState('project');
  useEffect(() => {
    const update = (e: Event) => setActive((e as CustomEvent<string>).detail);
    window.addEventListener('twin:scene-active', update);
    return () => window.removeEventListener('twin:scene-active', update);
  }, []);
  const chapterIds = ['project', 'space', 'lot', 'composition'];
  return <section className="hero" aria-labelledby="hero-heading">
    <Media name="hero" alt="Иллюстративный прибрежный девелоперский проект" eager className="hero-image" />
    <div className="hero-wash" aria-hidden="true" />
    <Header />
    <nav className="chapter-rail" aria-label="Путь по проекту">
      {['Проект', 'Пространство', 'Лот', 'Система'].map((name, i) => <a key={name} href={`#${chapterIds[i]}`} aria-current={active === chapterIds[i] ? 'location' : undefined} onClick={e => {
        if (i < 3 && document.querySelector('.journey[data-enhanced="true"]')) { e.preventDefault(); window.history.pushState(null, '', `#${chapterIds[i]}`); window.dispatchEvent(new CustomEvent('twin:journey', { detail: chapterIds[i] })); }
      }}><span>0{i + 1}</span>{name}</a>)}
    </nav>
    <div className="hero-copy">
      <h1 id="hero-heading"><span>Цифровая </span><span>инфраструктура </span><span>продаж девелоперского </span><span>проекта.</span></h1>
      <p>{content.hero.body}</p>
      <div className="actions"><a className="button" href={sitePath('/demo')}>Посмотреть Twin<Arrow /></a><a className="text-link" href="#contact">Обсудить проект</a></div>
    </div>
    <span className="hero-caption"><span />Демонстрационный проект</span>
  </section>;
}
