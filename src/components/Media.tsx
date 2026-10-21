import { sitePath } from '../lib/paths';
import { useEffect, useRef, useState } from 'react';
import dimensions from '../lib/media.json';
import { Icon } from './Icon';

export function Media({ name, alt, className = '', eager = false }: { name: keyof typeof dimensions; alt: string; className?: string; eager?: boolean }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => { if (image.current?.complete) setState(image.current.naturalWidth ? 'ready' : 'error'); }, [name]);
  const size: { width: number; height: number; revision: string; file?: string; variants?: Record<string, string> } = dimensions[name];
  const asset = (file: string) => `${sitePath(`/media/${file}`)}?v=${size.revision}`;
  return <span className={`media ${className} ${state === 'error' ? 'media-failed' : ''}`} data-media-state={state}>
    <img ref={image} src={asset(size.file || `${name}${name === 'hero' ? '-1672' : ''}.webp`)}
      srcSet={size.variants ? Object.entries(size.variants).map(([width, file]) => `${asset(file)} ${width}w`).join(', ') : name === 'hero' ? `${asset('hero-640.webp')} 640w, ${asset('hero-1280.webp')} 1280w, ${asset('hero-1672.webp')} 1672w` : undefined}
      sizes={name === 'topHero' ? '(max-width: 950px) 1800px, 100vw' : name === 'hero' ? '100vw' : undefined} width={size.width} height={size.height} alt={alt}
      loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'}
      onLoad={() => setState('ready')} onError={() => setState('error')} hidden={state === 'error'} />
    {state === 'error' && <span className="media-error-content" role="status"><Icon name="layers" /><span>Изображение недоступно.<br />{alt}</span></span>}
  </span>;
}
export function Arrow() { return <Icon name="arrow" className="arrow" />; }
