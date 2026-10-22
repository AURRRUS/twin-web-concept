import { useRef } from 'react';
import { DeliveryWord } from './DeliveryWord';
import { useDeliveryMotion } from '../lib/useDeliveryMotion';
import { sitePath } from '../lib/paths';
import { Arrow, Media } from './Media';
import { Icon, type IconName } from './Icon';
const steps: [string, string, IconName][] = [
  ['Материалы и задачи', 'Изучаем проект и цели', 'document'],
  ['Состав решения', 'Предлагаем конфигурацию и фиксируем параметры', 'layers'],
  ['Разработка', 'Создаём и наполняем двойник', 'settings'],
  ['Проверка и запуск', 'Тестируем и запускаем', 'check'],
];
export function Delivery() {
  const host = useRef<HTMLDivElement>(null);
  useDeliveryMotion(host);
  return <section className="delivery section" id="delivery" aria-labelledby="delivery-heading">
    <div ref={host} className="delivery-host" data-enhanced="false"><div className="delivery-panel"><div className="delivery-composition">
      <div className="delivery-copy"><span className="eyebrow">ОТ ЗАДАЧИ К РЕЗУЛЬТАТУ</span><h2 id="delivery-heading">Быстро<br />Доступно<br /><DeliveryWord /></h2><p>Обычно предлагают выбрать два.</p><h3 className="delivery-answer">В Twin сходятся все три</h3></div>
      <div className="delivery-triangle"><svg viewBox="0 0 600 500" aria-hidden="true"><path className="triangle-edge edge-one" pathLength="1" d="M300 55 575 450" /><path className="triangle-edge edge-two" pathLength="1" d="M575 450H25" /><path className="triangle-edge edge-three" pathLength="1" d="M25 450 300 55" /><circle className="delivery-vertex vertex-one" cx="300" cy="55" r="8" /><circle className="delivery-vertex vertex-two" cx="575" cy="450" r="8" /><circle className="delivery-vertex vertex-three" cx="25" cy="450" r="8" /></svg><Media name="core" alt="Модель демонстрационного проекта" /></div>
      <div className="delivery-time"><span className="badge">Быстро</span><strong>3 месяца</strong><p>Разработка и сдача проекта</p></div>
      <div className="delivery-budget"><span className="badge">Доступно</span><p>В среднем</p><strong>5 млн ₽</strong><p>Конфигурация под задачи проекта</p></div>
      <div className="delivery-quality"><span className="badge delivery-quality-label"><DeliveryWord /></span><h3>Посмотрите в работе</h3><a href={sitePath('/demo')} className="demo-poster" aria-label="Открыть демонстрационный интерфейс Twin"><Media name="interior" alt="Иллюстративное пространство у моря" /><span className="poster-action" aria-hidden="true"><Arrow /></span></a><p>Архитектура. Интерфейс. Сценарий выбора.</p><a className="button" href={sitePath('/demo')}>Посмотреть Twin<Arrow /></a></div>
    </div></div></div>
    <ol className="launch-steps">{steps.map(([title, body, icon], i) => <li key={title}><span className="launch-number"><Icon name={icon} /></span><div><span className="launch-index">0{i + 1}</span><h3>{title}</h3><p>{body}</p></div>{i < 3 && <Arrow />}</li>)}</ol>
    <p className="section-note">Состав решения, стоимость и график фиксируем для конкретного проекта.</p>
  </section>;
}
