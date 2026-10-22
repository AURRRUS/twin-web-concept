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
    <div className="channels-heading"><span data-craft-reveal="eyebrow" className="eyebrow">Один цифровой проект · Вся система продаж</span><h2 data-craft-reveal="title" id="channels-heading">Четыре канала —<br /><span className="bronze">одна основа</span></h2>
      <div role="tablist" aria-label="Каналы продаж" className="tabs channel-tabs" style={{ '--active-tab': active } as CSSProperties} onKeyDown={e => { if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) { e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? 3 : (active + (e.key === 'ArrowRight' ? 1 : 3)) % 4; setActive(next); document.getElementById(`${prefix}-${channels[next].id}`)?.focus(); } }}>
        {channels.map((item, i) => <button data-craft-reveal="fact" data-craft-delay={400 + i * 90} key={item.id} type="button" role="tab" id={`${prefix}-${item.id}`} aria-selected={active === i} tabIndex={active === i ? 0 : -1} aria-controls={`${prefix}-panel`} onClick={() => setActive(i)}>{item.title}</button>)}
      </div><p data-craft-reveal="body">Единая цифровая основа<br />для всех каналов продаж</p>
    </div>
    <div id={`${prefix}-panel`} role="tabpanel" aria-labelledby={`${prefix}-${channel.id}`}>
      <div className="channel-image-reveal"><div data-craft-reveal="media" className="channel-image-motion"><Media key={channel.id} name={channel.id} alt={`Иллюстрация канала «${channel.title}» — демонстрационный проект`} className="channel-scene" /></div></div>
      <div className="channel-story" key={`story-${channel.id}`}><div><h3>{channel.label}</h3><p>{channel.description}</p></div><a className="text-link" href={sitePath('/demo')}>Посмотреть Twin<Arrow /></a></div>
    </div>
    <noscript><div className="noscript-channels">{channels.map(item => <p key={item.id}><strong>{item.title}.</strong> {item.description}</p>)}</div></noscript>
  </section>;
}
