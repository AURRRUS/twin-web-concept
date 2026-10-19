import { sitePath } from '../lib/paths';
import { useId, useState } from 'react';
import type { CSSProperties } from 'react';
import { Media, Arrow } from './Media';

const channels = [
  { id: 'site', title: 'Сайт', description: 'Самостоятельное изучение проекта и обращение с сохранённым выбором.', label: 'Исследовать в своём темпе' },
  { id: 'online', title: 'Онлайн-показ', description: 'Совместный просмотр выбранного лота с менеджером — независимо от расстояния.', label: 'Быть рядом на расстоянии' },
  { id: 'agent', title: 'Агент', description: 'Проект и подборка под рукой — на встрече с покупателем или дистанционно.', label: 'Продолжить разговор о выборе' },
  { id: 'office', title: 'Офис продаж', description: 'Большой экран и предметное обсуждение проекта, пространства и конкретного лота.', label: 'Показать больше на встрече' },
] as const;

export function Channels() {
  const [active, setActive] = useState(3);
  const prefix = useId();
  const channel = channels[active];
  return <section className="channels" id="channels" aria-labelledby="channels-heading">
    <div className="channels-heading"><span className="eyebrow">ЧЕТЫРЕ КАНАЛА · ОДНА ОСНОВА</span><h2 id="channels-heading">Один цифровой проект.<br />Вся система продаж.</h2>
      <div role="tablist" aria-label="Каналы продаж" className="tabs channel-tabs" style={{ '--active-tab': active } as CSSProperties} onKeyDown={e => { if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) { e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? 3 : (active + (e.key === 'ArrowRight' ? 1 : 3)) % 4; setActive(next); document.getElementById(`${prefix}-${channels[next].id}`)?.focus(); } }}>
        {channels.map((item, i) => <button key={item.id} type="button" role="tab" id={`${prefix}-${item.id}`} aria-selected={active === i} tabIndex={active === i ? 0 : -1} aria-controls={`${prefix}-panel`} onClick={() => setActive(i)}>{item.title}</button>)}
      </div><p>Единая цифровая основа<br />для всех каналов продаж</p>
    </div>
    <div id={`${prefix}-panel`} role="tabpanel" aria-labelledby={`${prefix}-${channel.id}`}>
      <Media key={channel.id} name={channel.id} alt={`Иллюстрация канала «${channel.title}» — демонстрационный проект`} className="channel-scene" />
      <div className="channel-story" key={`story-${channel.id}`}><div><h3>{channel.label}</h3><p>{channel.description}</p></div><a className="text-link" href={sitePath('/demo')}>Посмотреть Twin<Arrow /></a></div>
    </div>
    <noscript><div className="noscript-channels">{channels.map(item => <p key={item.id}><strong>{item.title}.</strong> {item.description}</p>)}</div></noscript>
  </section>;
}
