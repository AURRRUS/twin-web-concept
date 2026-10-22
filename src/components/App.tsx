import { sitePath } from '../lib/paths';
import { useEffect, useState } from 'react';
import { initCraftReveals } from '../lib/craftReveal';
import { Header, Hero } from './HeaderHero';
import { Journey } from './Journey';
import { ProductDemo } from './ProductDemo';
import { Composition } from './Composition';
import { Channels } from './Channels';
import { Delivery } from './Delivery';
import { ContactForm } from './ContactForm';
import { Media } from './Media';
import { fixture, initialSelection, validateSelection, type Selection } from '../lib/config';

export default function App({ page }: { page: 'home' | 'demo' }) {
  const [selection, setSelection] = useState<Selection>(initialSelection);
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
        setSelectionNotice(invalid ? 'Часть выбора из ссылки недоступна. Показан доступный уровень демонстрационного проекта.' : '');
      } else {
        try { const stored = sessionStorage.getItem('twin-selection-v1'); if (stored) setSelection(validateSelection(JSON.parse(stored))); } catch { /* Storage is optional. */ }
      }
    };
    load(); window.addEventListener('popstate', load);
    document.documentElement.classList.add('has-js');
    return () => window.removeEventListener('popstate', load);
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
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } }, { threshold: 0.15 });
    document.querySelectorAll('.delivery').forEach(el => observer.observe(el));
    const cleanup = initCraftReveals();
    const leave = () => cleanup();
    document.addEventListener('astro:before-swap', leave);
    return () => { observer.disconnect(); cleanup(); document.removeEventListener('astro:before-swap', leave); };
  }, []);
  return <><a className="skip-link" href="#main">Перейти к содержанию</a>{page === 'demo' && <Header demo />}
    <main id="main">{page === 'home' && <><Hero /><Journey /></>}
      {selectionNotice && <p className="selection-notice" role="status">{selectionNotice}</p>}
      <ProductDemo selection={selection} onChange={updateSelection} full={page === 'demo'} />
      {page === 'home' && <><Composition onTopic={setTopic} /><Channels /><Delivery /><ContactForm topic={topic} onTopic={setTopic} selection={selection} /></>}
    </main>
    <footer className="site-footer"><a href={sitePath('/')} aria-label="Twin by TALENT — главная"><Media name="logo" alt="Twin by TALENT" /></a><nav aria-label="Навигация внизу страницы"><a href={sitePath('/#product')}>Продукт</a><a href={sitePath('/#channels')}>Сценарии</a><a href={sitePath('/#composition')}>Состав и запуск</a></nav><span>Демонстрационный проект</span></footer>
  </>;
}
