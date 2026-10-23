import { sitePath } from '../lib/paths';
import { Arrow, Media } from './Media';

export function Header({ demo = false }: { demo?: boolean }) {
  return <header className={`site-header content-container ${demo ? 'on-demo' : ''}`}>
    <a className="brand" href={sitePath('/')} aria-label="Twin by TALENT — главная"><Media name="logo" alt="Twin by TALENT" eager /></a>
    <nav aria-label="Основная навигация"><a href={sitePath('/#product')}>Продукт</a><a href={sitePath('/#channels')}>Сценарии</a><a href={sitePath('/#composition')}>Запуск</a></nav>
    <details className="mobile-navigation"><summary>Меню</summary><nav aria-label="Мобильная навигация"><a href={sitePath('/#product')}>Продукт</a><a href={sitePath('/#channels')}>Сценарии</a><a href={sitePath('/#composition')}>Запуск</a></nav></details>
    <a className={demo ? 'text-link' : 'button header-cta'} href={sitePath(demo ? '/' : '/#contact')}>{demo ? 'Вернуться на сайт' : 'Обсудить проект'}<Arrow /></a>
  </header>;
}
export function Hero() {
  return <section className="hero" aria-labelledby="hero-heading">
    <Media name="topHero" alt="Иллюстративный прибрежный девелоперский проект" eager className="hero-image" />
    <Header />
    <div className="content-container hero-content"><div className="hero-copy">
      <h1 id="hero-heading"><span className="hero-line">Цифровая <em className="bronze">инфраструктура продаж</em></span>{' '}<span className="hero-line">девелоперского проекта</span></h1>
      <p className="hero-description"><span>Раскрывайте преимущества проекта</span>{' '}<span>и помогайте покупателю выбирать:</span></p>
      <p className="hero-channels">на сайте, дистанционно, через агентов, в офисе продаж.</p>
      <div className="actions"><a className="button" href={sitePath('/demo')}>Посмотреть Twin<Arrow /></a></div>
    </div></div>
    <span className="hero-caption"><span />Демонстрационный проект</span>
  </section>;
}
