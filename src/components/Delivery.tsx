import { useRef } from 'react';
import { DeliveryWord } from './DeliveryWord';
import { useDeliveryMotion } from '../lib/useDeliveryMotion';
import { sitePath } from '../lib/paths';
import { Arrow, Media } from './Media';
import { Icon, type IconName } from './Icon';
import content from '../lib/designContent.json';
const steps: [string,string,IconName][] = [
  ['Материалы и задачи','Изучаем проект и цели','document'],
  ['Состав решения','Предлагаем конфигурацию и фиксируем параметры','layers'],
  ['Разработка','Создаём и наполняем двойник','settings'],
  ['Проверка и запуск','Тестируем и запускаем','check'],
];
export function Delivery(){
  const host=useRef<HTMLDivElement>(null);useDeliveryMotion(host);
  const copy=content.triangle;
  return <section className="delivery section" id="delivery" aria-labelledby="delivery-heading">
    <div ref={host} className="delivery-host" data-enhanced="false"><div className="delivery-panel"><div className="delivery-composition">
      <div className="delivery-copy"><p className="delivery-lead">{copy.lead}</p><h2 className="delivery-answer" id="delivery-heading">В Twin сходятся <span className="bronze">все три качества</span></h2>
        <div className="delivery-qualities"><span>Быстро</span><span>Доступно</span><span><DeliveryWord /></span></div>
      </div>
      <div className="delivery-stage">
        <div className="delivery-triangle"><svg viewBox="0 0 600 500" aria-hidden="true"><path className="triangle-edge edge-one" pathLength="1" d="M300 55 575 450"/><path className="triangle-edge edge-two" pathLength="1" d="M575 450H25"/><path className="triangle-edge edge-three" pathLength="1" d="M25 450 300 55"/><circle className="vertex-one" cx="300" cy="55" r="3"/><circle className="vertex-two" cx="575" cy="450" r="3"/><circle className="vertex-three" cx="25" cy="450" r="3"/></svg><Media name="core" alt="Модель демонстрационного проекта"/></div>
        <div className="delivery-time"><span className="quality-label">Быстро</span><strong>{copy.time}</strong><p>{copy.time_description}</p></div>
        <div className="delivery-budget"><span className="quality-label">Доступно</span><p className="price-prefix">{copy.price_prefix}</p><strong>{copy.price}</strong><p>{copy.price_description}</p></div>
        <div className="delivery-quality"><span className="quality-label" data-proof-label="">Эффективно</span><h3>{copy.proof_heading}</h3><a className="delivery-proof" href={sitePath('/demo')}><Media name="interior" alt="Иллюстративное пространство у моря"/><p className="proof-caption">{copy.proof_caption}</p><span className="text-link">{copy.action.label}<Arrow/></span></a></div>
      </div>
    </div></div></div>
    <ol className="launch-steps">{steps.map(([title,body,icon],i)=><li data-craft-reveal="fact" key={title}><span className="launch-number"><Icon name={icon}/></span><div><span className="launch-index">0{i+1}</span><h3>{title}</h3><p>{body}</p></div>{i<3&&<Arrow/>}</li>)}</ol>
    <p className="section-note">Состав решения, стоимость и график фиксируем для конкретного проекта.</p>
  </section>;
}
