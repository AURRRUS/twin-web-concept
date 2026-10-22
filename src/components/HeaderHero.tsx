import { sitePath } from '../lib/paths';
import content from '../../docs/handoff/04_DATA/twin-home-content.json';
import { Arrow, Media } from './Media';

export function Header({ demo = false }: { demo?: boolean }) {
  return <header className={`site-header content-container ${demo ? 'on-demo' : ''}`}>
    <a className="brand" href={sitePath('/')} aria-label="Twin by TALENT — главная"><Media name="logo" alt="Twin by TALENT" eager /></a>
    <nav aria-label="Основная навигация"><a href={sitePath('/#product')}>Продукт</a><a href={sitePath('/#channels')}>Сценарии</a><a href={sitePath('/#composition')}>Состав и запуск</a></nav>
    <a className={demo ? 'text-link' : 'button header-cta'} href={sitePath(demo ? '/' : '/demo')}>{demo ? 'Вернуться на сайт' : 'Посмотреть Twin'}<Arrow /></a>
  </header>;
}
export function Hero() {
  return <section className="hero" aria-labelledby="hero-heading">
    <Media name="topHero" alt="Иллюстративный прибрежный девелоперский проект" eager className="hero-image" />
    <Header />
    <div className="content-container hero-content"><div className="hero-copy">
      <h1 id="hero-heading"><span className="hero-line">Цифровая инфраструктура продаж</span>{' '}<span className="hero-line">девелоперского проекта</span></h1>
      <p>{content.hero.body}</p>
      <div className="actions"><a className="button" href={sitePath('/demo')}>Посмотреть Twin<Arrow /></a><a className="text-link" href="#contact">Обсудить проект</a></div>
    </div></div>
    <span className="hero-caption"><span />Демонстрационный проект</span>
  </section>;
}
