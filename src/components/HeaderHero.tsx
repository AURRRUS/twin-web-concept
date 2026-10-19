import content from '../../docs/handoff/04_DATA/twin-home-content.json';
import { Arrow, Media } from './Media';

export function Header({ demo = false }: { demo?: boolean }) {
  return <header className={`site-header ${demo ? 'on-demo' : ''}`}>
    <a className="brand" href="/" aria-label="Twin by TALENT — главная"><Media name="logo" alt="Twin by TALENT" eager /></a>
    <nav aria-label="Основная навигация"><a href="/#product">Продукт</a><a href="/#channels">Сценарии</a><a href="/#composition">Состав и запуск</a></nav>
    <a className={demo ? 'text-link' : 'button'} href={demo ? '/' : '/demo'}>{demo ? 'Вернуться на сайт' : 'Посмотреть Twin'}<Arrow /></a>
  </header>;
}

export function Hero() {
  return <section className="hero" aria-labelledby="hero-heading">
    <Media name="hero" alt="Иллюстративный прибрежный девелоперский проект" eager className="hero-image" />
    <div className="hero-wash" aria-hidden="true" />
    <Header />
    <nav className="chapter-rail" aria-label="Путь по проекту">
      {['Проект', 'Пространство', 'Лот', 'Система'].map((name, i) => <a key={name} href={['#project', '#space', '#lot', '#composition'][i]}><span>0{i + 1}</span>{name}</a>)}
    </nav>
    <div className="hero-copy">
      <h1 id="hero-heading">{content.hero.title}</h1>
      <p>{content.hero.body}</p>
      <div className="actions"><a className="button" href="/demo">Посмотреть Twin<Arrow /></a><a className="text-link" href="#contact">Обсудить проект</a></div>
    </div>
    <span className="hero-caption">Демонстрационный проект</span>
  </section>;
}
