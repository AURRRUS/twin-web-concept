import { sitePath } from '../lib/paths';
import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import content from '../../docs/handoff/04_DATA/twin-home-content.json';
import rawDialogs from '../../docs/handoff/06_UI_KIT/modal-content.json';
import { Media, Arrow } from './Media';
import { Icon } from './Icon';

type DialogContent = [string, string, string, string, string[], string];
const dialogs = rawDialogs as DialogContent[];
const items = content.composition.components;
const getDialog = (id: string | null) => dialogs.find(d => d[0] === id);
function ComponentArt({ id, detail = false }: { id: string; detail?: boolean }) {
  const [failed, setFailed] = useState(false);
  const clipId = useId().replace(/:/g, '');
  if (id === 'core') return <Media name="core" alt="Иллюстративная изометрическая модель проекта" />;
  if (!detail && !failed) {
    const index = items.findIndex(item => item.id === id);
    return <svg className="component-illustration" viewBox={`${index * 362} 175 362 350`} role="img" aria-label={`Иллюстрация: ${items[index].title}`}>
      <defs><clipPath id={clipId}><rect x={index * 362} y="175" width="362" height="350" /></clipPath></defs><g clipPath={`url(#${clipId})`}><image href={sitePath('/media/components-sprite.webp')} width="2172" height="724" onError={() => setFailed(true)} /></g>
    </svg>;
  }
  if (id === 'client-tools') return <Media name="lot" alt="Материал выбранного лота" />;
  if (id === 'commercial') return <Media name="interior" alt="Пример интерьерного решения" />;
  return <img src={sitePath(`/media/${id}.svg`)} alt="" loading="lazy" width="1000" height="700" />;
}
const routes = [
  'M300 110H365L492 230', 'M300 350H400L487 360', 'M300 590H380L500 475',
  'M1000 110H930L805 230', 'M1000 350H900L815 360', 'M1000 590H920L800 475',
];
export function Composition({ onTopic }: { onTopic: (topic: string) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const activeRef = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const origin = useRef<HTMLAnchorElement | null>(null);
  const createdEntry = useRef(false);
  const restorePending = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const assign = (id: string | null) => { activeRef.current = id; setActive(id); setClosing(false); };
  function readUrl() {
    const key = new URLSearchParams(window.location.search).get('component');
    const next = getDialog(key) ? key : null;
    if (activeRef.current && !next) {
      setClosing(true); restorePending.current = true;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => assign(null), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180);
    } else { if (timer.current) clearTimeout(timer.current); assign(next); }
  }
  useEffect(() => { readUrl(); window.addEventListener('popstate', readUrl); return () => { window.removeEventListener('popstate', readUrl); if (timer.current) clearTimeout(timer.current); }; }, []);
  useEffect(() => {
    const node = dialog.current;
    if (active && node) {
      if (!node.open) node.showModal();
      heading.current?.focus();
      const previous = document.body.style.overflow;
      const previousPadding = document.body.style.paddingRight;
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
      document.body.style.overflow = 'hidden';
      return () => { node.close(); document.body.style.overflow = previous; document.body.style.paddingRight = previousPadding; if (restorePending.current) { origin.current?.focus({ preventScroll: true }); restorePending.current = false; } };
    }
  }, [active]);
  function open(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault(); origin.current = e.currentTarget;
    if (timer.current) clearTimeout(timer.current);
    const url = new URL(window.location.href); url.searchParams.set('component', id); url.hash = 'composition';
    window.history.pushState({ ...window.history.state, twinDialog: true }, '', url); createdEntry.current = true; assign(id);
  }
  function close() {
    if (closing) return;
    restorePending.current = true;
    if (createdEntry.current && window.history.state?.twinDialog) { createdEntry.current = false; window.history.back(); }
    else { const url = new URL(window.location.href); url.searchParams.delete('component'); window.history.replaceState({}, '', url); readUrl(); }
  }
  function discuss(title: string) {
    onTopic(title); restorePending.current = false;
    const url = new URL(window.location.href); url.searchParams.delete('component'); url.hash = 'contact';
    window.history.replaceState({}, '', url); createdEntry.current = false; assign(null);
    requestAnimationFrame(() => { document.getElementById('contact')?.scrollIntoView(); document.getElementById('contact-topic')?.focus({ preventScroll: true }); });
  }
  const info = getDialog(active);
  return <section id="composition" className="composition section" aria-labelledby="composition-heading">
    <div className="center-heading"><span data-craft-reveal="eyebrow" className="eyebrow">Из чего состоит Twin</span><h2 data-craft-reveal="title" id="composition-heading">Единая <span className="bronze">цифровая основа</span></h2><p data-craft-reveal="body">Коммерческий цифровой двойник и связанные компоненты системы продаж</p></div>
    <div className="composition-map" data-focused={focused || ''}>
      <svg className="composition-lines" viewBox="0 0 1300 700" preserveAspectRatio="none" aria-hidden="true">
        {routes.map((route, i) => <g data-craft-pair={items[i].id} data-craft-reveal="fact" key={items[i].id} data-active={focused === items[i].id}><path d={route} fill="none" /><circle cx={i < 3 ? 300 : 1000} cy={[110, 350, 590, 110, 350, 590][i]} r="4" /></g>)}
      </svg>
      <a data-craft-reveal="composition-core" className="map-core" href="?component=core#composition" onClick={e => open(e, 'core')} onFocus={() => setFocused('core')} onBlur={() => setFocused(null)}><ComponentArt id="core" /><span className="badge">Ядро продукта</span><h3>Коммерческий<br />цифровой двойник</h3><span className="core-explore">Исследовать ядро <Arrow /></span></a>
      {items.map((item, i) => <a data-craft-pair={item.id} data-craft-reveal="fact" key={item.id} className={`map-component component-${item.id}`} href={item.modalHref} onClick={e => open(e, item.id)} onPointerEnter={() => setFocused(item.id)} onPointerLeave={() => setFocused(null)} onFocus={() => setFocused(item.id)} onBlur={() => setFocused(null)} style={{ gridArea: ['1 / 1', '2 / 1', '3 / 1', '1 / 3', '2 / 3', '3 / 3'][i], '--component-index': i } as CSSProperties}>
        <div className="component-art"><ComponentArt id={item.id} /></div>
        {item.extension && <span className="extension">Расширение</span>}
        <h3>{item.title}<Arrow /></h3><p>{item.description}</p>
      </a>)}
    </div>
    <p className="section-note">Конфигурация собирается под задачи проекта</p>
    <details className="composition-descriptions"><summary>Состав и условия подключения — текстовая версия<Icon name="down" /></summary><div>{dialogs.map(([id, title, intro, , list, note]) => <article key={id} id={`description-${id}`}><h3>{title}</h3><p>{intro}</p><ul>{list.map(text => <li key={text}>{text}</li>)}</ul><p>{note}</p></article>)}</div></details>
    <dialog ref={dialog} className="component-dialog" data-closing={closing} aria-labelledby="component-dialog-title" aria-describedby="component-dialog-intro" onKeyDown={e => {
      if (e.key !== 'Tab') return;
      const controls = [...e.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),[tabindex="0"]')];
      const first = controls[0]; const last = controls[controls.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }} onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }}>
      {info && <div className="dialog-inner"><button className="dialog-close" aria-label="Закрыть описание компонента" onClick={close}><Icon name="close" /></button><span className="eyebrow">СОСТАВ TWIN {info[0] === 'commercial' ? '· РАСШИРЕНИЕ' : ''}</span><h2 ref={heading} tabIndex={-1} id="component-dialog-title">{info[1]}</h2><p id="component-dialog-intro" className="dialog-intro">{info[2]}</p><div className="dialog-body"><div className="dialog-art"><ComponentArt id={info[0]} detail /></div><div><h3>В составе решения</h3><ul>{info[4].map(text => <li key={text}><Icon name="check" />{text}</li>)}</ul><p>Связано с общей цифровой моделью проекта.</p></div></div><div className="dialog-footer"><p>{info[5]}</p><button className="button" onClick={() => discuss(info[1])}>Обсудить конфигурацию<Arrow /></button></div></div>}
    </dialog>
  </section>;
}
