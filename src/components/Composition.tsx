import { sitePath } from '../lib/paths';
import { useEffect, useRef, useState } from 'react';
import content from '../../docs/handoff/04_DATA/twin-home-content.json';
import rawDialogs from '../../docs/handoff/06_UI_KIT/modal-content.json';
import { Media, Arrow } from './Media';

type DialogContent = [string, string, string, string, string[], string];
const dialogs = rawDialogs as DialogContent[];
const items = content.composition.components;
const getDialog = (id: string | null) => dialogs.find(d => d[0] === id);
function ComponentArt({ id }: { id: string }) {
  if (id === 'core') return <Media name="core" alt="Иллюстративная изометрическая модель проекта" />;
  if (id === 'client-tools') return <Media name="lot" alt="Материал выбранного лота" />;
  if (id === 'commercial') return <Media name="interior" alt="Пример интерьерного решения" />;
  return <img src={sitePath(`/media/${id}.svg`)} alt="" loading="lazy" width="800" height="500" />;
}

export function Composition({ onTopic }: { onTopic: (topic: string) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const origin = useRef<HTMLAnchorElement | null>(null);
  const createdEntry = useRef(false);
  const restorePending = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const readUrl = () => {
    const key = new URLSearchParams(window.location.search).get('component');
    setActive(getDialog(key) ? key : null);
  };
  useEffect(() => { readUrl(); window.addEventListener('popstate', readUrl); return () => window.removeEventListener('popstate', readUrl); }, []);
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
    const url = new URL(window.location.href); url.searchParams.set('component', id); url.hash = 'composition';
    window.history.pushState({ ...window.history.state, twinDialog: true }, '', url); createdEntry.current = true; setActive(id);
  }
  function close() {
    restorePending.current = true;
    if (createdEntry.current && window.history.state?.twinDialog) { createdEntry.current = false; window.history.back(); }
    else { const url = new URL(window.location.href); url.searchParams.delete('component'); window.history.replaceState({}, '', url); setActive(null); }
  }
  function discuss(title: string) {
    onTopic(title);
    const url = new URL(window.location.href); url.searchParams.delete('component'); url.hash = 'contact';
    window.history.replaceState({}, '', url); createdEntry.current = false; setActive(null);
    requestAnimationFrame(() => { document.getElementById('contact')?.scrollIntoView(); document.getElementById('contact-topic')?.focus({ preventScroll: true }); });
  }
  const info = getDialog(active);
  return <section id="composition" className="composition section" aria-labelledby="composition-heading">
    <div className="center-heading"><span className="eyebrow">ЕДИНАЯ СИСТЕМА</span><h2 id="composition-heading">Из чего состоит Twin</h2><p>Коммерческий цифровой двойник и связанные компоненты системы продаж</p></div>
    <div className="composition-map">
      <svg className="composition-lines" viewBox="0 0 1300 700" preserveAspectRatio="none" aria-hidden="true"><g><path d="M280 100H350L490 230 M280 335H410L485 350 M280 580H370L500 460 M1020 100H940L810 230 M1020 335H910L815 350 M1020 580H930L800 460" fill="none" /><circle cx="490" cy="230" r="5" /><circle cx="485" cy="350" r="5" /><circle cx="500" cy="460" r="5" /><circle cx="810" cy="230" r="5" /><circle cx="815" cy="350" r="5" /><circle cx="800" cy="460" r="5" /></g></svg>
      <a className="map-core" href="?component=core#composition" onClick={e => open(e, 'core')}><ComponentArt id="core" /><span className="badge">Ядро продукта</span><h3>Коммерческий<br />цифровой двойник <Arrow /></h3></a>
      {items.map((item, i) => <a key={item.id} className={`map-component component-${item.id}`} href={item.modalHref} onClick={e => open(e, item.id)} style={{ gridArea: ['1 / 1', '2 / 1', '3 / 1', '1 / 3', '2 / 3', '3 / 3'][i] }}>
        <div className="component-art"><ComponentArt id={item.id} /></div>
        {item.extension && <span className="extension">Расширение</span>}
        <h3>{item.title}<Arrow /></h3><p>{item.description}</p>
      </a>)}
    </div>
    <p className="section-note">Конфигурация собирается под задачи проекта</p>
    <details className="composition-descriptions"><summary>Состав и условия подключения — текстовая версия</summary><div>{dialogs.map(([id, title, intro, , list, note]) => <article key={id} id={`description-${id}`}><h3>{title}</h3><p>{intro}</p><ul>{list.map(text => <li key={text}>{text}</li>)}</ul><p>{note}</p></article>)}</div></details>
    <dialog ref={dialog} className="component-dialog" aria-labelledby="component-dialog-title" aria-describedby="component-dialog-intro" onKeyDown={e => {
      if (e.key !== 'Tab') return;
      const controls = [...e.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),[tabindex="0"]')];
      const first = controls[0]; const last = controls[controls.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }} onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }}>
      {info && <div className="dialog-inner"><button className="dialog-close" aria-label="Закрыть описание компонента" onClick={close}>×</button><span className="eyebrow">СОСТАВ TWIN {info[0] === 'commercial' ? '· РАСШИРЕНИЕ' : ''}</span><h2 ref={heading} tabIndex={-1} id="component-dialog-title">{info[1]}</h2><p id="component-dialog-intro" className="dialog-intro">{info[2]}</p><div className="dialog-body"><div className="dialog-art"><ComponentArt id={info[0]} /></div><div><h3>В составе решения</h3><ul>{info[4].map(text => <li key={text}>{text}</li>)}</ul><p>Связано с общей цифровой моделью проекта.</p></div></div><div className="dialog-footer"><p>{info[5]}</p><button className="button" onClick={() => discuss(info[1])}>Обсудить конфигурацию<Arrow /></button></div></div>}
    </dialog>
  </section>;
}
