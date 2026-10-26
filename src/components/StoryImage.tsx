import { useEffect, useRef, useState } from 'react';
import { storyImage } from '../lib/salesStoryMedia';
export function StoryImage({ kind, id, alt, eager = false }: { kind: 'journey' | 'channels'; id: string; alt: string; eager?: boolean }) {
  const image = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const img = image.current!;
    let alive = true;
    const notify = (next: 'ready' | 'error') => {
      if (!alive) return;
      setState(next);
      img.parentElement?.dispatchEvent(new CustomEvent('twin:story-media', { bubbles: true }));
    };
    const loaded = () => {
      if (!img.naturalWidth) { notify('error'); return; }
      void img.decode().then(() => notify('ready'), () => notify(img.naturalWidth ? 'ready' : 'error'));
    };
    const failed = () => notify('error');
    img.addEventListener('load', loaded); img.addEventListener('error', failed);
    if (img.complete) { if (img.naturalWidth) loaded(); else if (img.currentSrc) failed(); }
    return () => { alive = false; img.removeEventListener('load', loaded); img.removeEventListener('error', failed); };
  }, [kind, id, attempt]);
  const asset = (width = 1672) => storyImage(kind, id, width) + (attempt ? `?retry=${attempt}` : '');
  return <span className="story-image" data-state={state}>
    <img ref={image} hidden={state === 'error'} src={asset()} srcSet={`${asset(840)} 840w, ${asset()} 1672w`}
      sizes={kind === 'journey' ? '(max-width:1099px) 1672px, 90vw' : '(max-width:1099px) 100vw, 58vw'}
      width={kind === 'journey' && ['project', 'lot'].includes(id) ? 1671 : 1672} height={941}
      loading={eager ? 'eager' : 'lazy'} alt={alt} />
    {state === 'loading' && <span className="story-image-loading" role="status">Загружаем изображение…</span>}
    {state === 'error' && <span className="story-image-error" role="status">Изображение недоступно · {alt}<button type="button" onClick={() => { setState('loading'); setAttempt(n => n + 1); }}>Повторить</button></span>}
  </span>;
}
