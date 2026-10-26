import { sitePath } from '../lib/paths';
import { useEffect, useState, useRef } from 'react';
import { initCraftReveals } from '../lib/craftReveal';
import { Header, Hero } from './HeaderHero';
import { JourneyComparisons } from './JourneyComparisons';
import { ProductDemo } from './ProductDemo';
import { Composition } from './Composition';
import { Channels } from './Channels';
import { Delivery, Launch } from './Delivery';
import { JourneyAccordion } from './JourneyAccordion';
import storyContent from '../lib/salesStoryContent.json';
import {bindShortWords} from '../lib/text';
import { ContactForm } from './ContactForm';
import { Media } from './Media';
import { fixture, initialSelection, validateSelection, type Selection } from '../lib/config';

export default function App({ page }: { page: 'home' | 'demo' }) {
  const [selection, setSelection] = useState<Selection>(initialSelection);
  const selectionRef=useRef(selection);selectionRef.current=selection;
  const [hydrated, setHydrated] = useState(false);
  const [compare,setCompare]=useState(false);
  const [topic, setTopic] = useState('');
  const [selectionNotice, setSelectionNotice] = useState('');
  useEffect(() => {
    const load = () => {
      const params = new URLSearchParams(window.location.search);
      const keys = ['projectId', 'buildingId', 'floorId', 'lotId', 'view'] as const;
      if (keys.some(key => params.has(key))) {
        const input = Object.fromEntries(keys.map(key => [key, params.get(key)]));
        const valid = validateSelection(input);
        setSelection(valid);
        const invalid = keys.some(key => params.has(key) && params.get(key) !== valid[key]);
        setSelectionNotice(invalid ? 'Часть выбора из ссылки недоступна. Показан доступный уровень демонстрационного проекта.' : '');
      } else {
        try { const stored = sessionStorage.getItem('twin-selection-v1'); if (stored) setSelection(validateSelection(JSON.parse(stored))); } catch { /* Storage is optional. */ }
      }
    };
    const compareMode=()=>{const u=new URL(location.href),legacy=/^#journey-(?:original|variant-[12356])(?:-|$)/.test(u.hash);if(legacy&&u.searchParams.get('compare')!=='journey'){u.searchParams.set('compare','journey');history.replaceState(history.state,'',u)}setCompare(u.searchParams.get('compare')==='journey')};
    const demoEntry=(e:MouseEvent)=>{const link=(e.target as Element).closest<HTMLAnchorElement>('a[href]');if(page!=='home'||!link||!new URL(link.href).pathname.replace(/\/$/,'').endsWith('/demo'))return;const target=new URL(link.href);target.searchParams.delete('compare');for(const key of ['projectId','buildingId','floorId','lotId','view']as const){const v=selectionRef.current[key];if(v)target.searchParams.set(key,v);else target.searchParams.delete(key)}link.href=target.href;try{sessionStorage.setItem('twin-demo-origin',JSON.stringify({url:location.href,scroll:scrollY,focus:link.id||'',journeyScene:document.querySelector<HTMLElement>('.twin-journey, .story-journey')?.dataset.active,detail:document.querySelector<HTMLElement>('.story-journey .story-media-stage')?.dataset.detail}))}catch{}};document.addEventListener('click',demoEntry);
    compareMode();load();
    if(page==='home'){try{if(sessionStorage.getItem('twin-demo-restore')==='true'){sessionStorage.removeItem('twin-demo-restore');const origin=JSON.parse(sessionStorage.getItem('twin-demo-origin')||'null');if(origin)void document.fonts.ready.then(()=>requestAnimationFrame(()=>{scrollTo({top:origin.scroll,behavior:'instant'});document.getElementById(origin.focus||'open-demo')?.focus({preventScroll:true})}))}}catch{}}
     setHydrated(true); window.addEventListener('popstate', load);window.addEventListener('hashchange',compareMode);window.addEventListener('popstate',compareMode);
    document.documentElement.classList.add('has-js');
    return () => {document.removeEventListener('click',demoEntry);window.removeEventListener('popstate', load);window.removeEventListener('hashchange',compareMode);window.removeEventListener('popstate',compareMode)};
  }, []);
  function updateSelection(next: Selection) {
    const valid = validateSelection(next); setSelection(valid); setSelectionNotice('');
    try { sessionStorage.setItem('twin-selection-v1', JSON.stringify(valid)); } catch { /* Navigation carries selection even without storage. */ }
    const url = new URL(window.location.href);
    for (const key of ['projectId', 'buildingId', 'floorId', 'lotId', 'view'] as const) {
      if (valid[key]) url.searchParams.set(key, valid[key]!); else url.searchParams.delete(key);
    }
    window.history.replaceState(window.history.state, '', url);
  }
  useEffect(() => {
    const cleanup = initCraftReveals();
    const leave = () => cleanup();
    document.addEventListener('astro:before-swap', leave);
    return () => { cleanup(); document.removeEventListener('astro:before-swap', leave); };
  }, [compare]);
  return <><a className="skip-link" href="#main">Перейти к содержанию</a>{page === 'demo' && <Header demo />}
    <main id="main" data-hydrated={hydrated}>{page === 'home' && <><Hero />{compare?<><a className="story-compare-exit story-shell" href="#journey-variant-4" onClick={e=>{e.preventDefault();const u=new URL(location.href);u.searchParams.delete('compare');u.hash='journey-variant-4';history.replaceState(history.state,'',u);setCompare(false);requestAnimationFrame(()=>document.getElementById('journey-variant-4')?.scrollIntoView())}}>Вернуться к основному сайту</a><JourneyComparisons /></>:<section id="journey-variant-4"><JourneyAccordion/></section>}<p className="story-bridge story-shell">{bindShortWords(storyContent.bridges.after_journey)}</p></>}
      {selectionNotice && <p className="selection-notice" role="status">{selectionNotice}</p>}
      <ProductDemo selection={selection} onChange={updateSelection} full={page === 'demo'} />
      {page === 'home' && <><Composition onTopic={setTopic} /><p className="story-bridge story-shell">{bindShortWords(storyContent.bridges.before_channels)}</p><Channels /><Delivery /><Launch /><ContactForm topic={topic} onTopic={setTopic} selection={selection} /></>}
    </main>
    <footer className="site-footer"><a href={sitePath('/')} aria-label="Twin by TALENT — главная"><Media name="logo" alt="Twin by TALENT" /></a><nav aria-label="Навигация внизу страницы"><a href={sitePath('/#product')}>Продукт</a><a href={sitePath('/#channels')}>Сценарии</a><a href={sitePath('/#composition')}>Состав</a><a href={sitePath('/#launch')}>Запуск</a></nav><span>Демонстрационный проект</span></footer>
  </>;
}
