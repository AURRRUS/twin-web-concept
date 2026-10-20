import { sitePath } from '../lib/paths';
import { useEffect, useRef, useState } from 'react';
import dimensions from '../lib/media.json';
import { Icon } from './Icon';

export function Media({ name, alt, className = '', eager = false }: { name: keyof typeof dimensions; alt: string; className?: string; eager?: boolean }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => { if (image.current?.complete) setState(image.current.naturalWidth ? 'ready' : 'error'); }, [name]);
  const size = dimensions[name];
  const asset = (file: string) => `${sitePath(`/media/${file}`)}?v=${size.revision}`;
  return <span className={`media ${className} ${state === 'error' ? 'media-failed' : ''}`} data-media-state={state}>
    <img ref={image} src={asset(`${name}${name === 'hero' ? '-1672' : ''}.webp`)}
      srcSet={name === 'hero' ? `${asset('hero-640.webp')} 640w, ${asset('hero-1280.webp')} 1280w, ${asset('hero-1672.webp')} 1672w` : undefined}
      sizes={name === 'hero' ? '100vw' : undefined} width={size.width} height={size.height} alt={alt}
      loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'}
      onLoad={() => setState('ready')} onError={() => setState('error')} hidden={state === 'error'} />
    {state === 'error' && <span className="media-error-content" role="status"><Icon name="layers" /><span>Изображение недоступно.<br />{alt}</span></span>}
  </span>;
}
export function Arrow() { return <Icon name="arrow" className="arrow" />; }
