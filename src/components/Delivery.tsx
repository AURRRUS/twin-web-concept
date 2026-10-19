import { sitePath } from '../lib/paths';
import { Arrow, Media } from './Media';

const steps = [
  ['Материалы и задачи', 'Изучаем проект и цели'],
  ['Состав решения', 'Предлагаем конфигурацию и фиксируем параметры'],
  ['Разработка', 'Создаём и наполняем двойник'],
  ['Проверка и запуск', 'Тестируем и запускаем'],
];

export function Delivery() {
  return <section className="delivery section" id="delivery" aria-labelledby="delivery-heading">
    <div className="delivery-composition">
      <div className="delivery-copy"><span className="eyebrow">ОТ ЗАДАЧИ К РЕЗУЛЬТАТУ</span><h2 id="delivery-heading">Быстро.<br />Доступно.<br />Качественно.</h2><h3>В Twin сходятся все три.</h3><p>Обычно предлагают выбрать два.</p></div>
      <div className="delivery-triangle"><svg viewBox="0 0 600 500" aria-hidden="true"><path pathLength="1" d="M300 55L575 450H25Z" /><circle cx="300" cy="55" r="9" /><circle cx="575" cy="450" r="9" /><circle cx="25" cy="450" r="9" /></svg><Media name="core" alt="Модель демонстрационного проекта" /></div>
      <div className="delivery-time"><span className="badge">Быстро</span><strong>3 месяца</strong><p>Разработка и сдача проекта</p></div>
      <div className="delivery-budget"><span className="badge">Доступно</span><p>В среднем</p><strong>5 млн ₽</strong><p>Конфигурация под задачи проекта</p></div>
      <div className="delivery-quality"><span className="badge">Качественно</span><h3>Посмотрите в работе</h3><a href={sitePath('/demo')} className="demo-poster" aria-label="Открыть демонстрационный интерфейс Twin"><Media name="interior" alt="Иллюстративное пространство у моря" /><span aria-hidden="true">→</span></a><p>Архитектура. Интерфейс. Сценарий выбора.</p><a className="button" href={sitePath('/demo')}>Посмотреть Twin<Arrow /></a></div>
    </div>
    <ol className="launch-steps">{steps.map(([title, body], i) => <li key={title}><span className="launch-number">0{i + 1}</span><div><h3>{title}</h3><p>{body}</p></div>{i < 3 && <Arrow />}</li>)}</ol>
    <p className="section-note">Состав решения, стоимость и график фиксируем для конкретного проекта.</p>
  </section>;
}
