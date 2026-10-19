import { sitePath } from '../lib/paths';
import { useState } from 'react';
import dimensions from '../lib/media.json';

export function Media({ name, alt, className = '', eager = false }: { name: keyof typeof dimensions; alt: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  const size = dimensions[name];
  const src = sitePath(`/media/${name}${name === 'hero' ? '-1672' : ''}.webp`);
  return <span className={`media ${className} ${failed ? 'media-failed' : ''}`}>
    <img src={src} srcSet={name === 'hero' ? `${sitePath('/media/hero-640.webp')} 640w, ${sitePath('/media/hero-1280.webp')} 1280w, ${sitePath('/media/hero-1672.webp')} 1672w` : undefined}
      sizes={name === 'hero' ? '(min-width: 1280px) 100vw, 100vw' : undefined}
      width={size.width} height={size.height} alt={alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'}
      onError={() => setFailed(true)} hidden={failed} />
    {failed && <span role="status">Изображение недоступно. {alt}</span>}
  </span>;
}

export function Arrow() { return <span aria-hidden="true" className="arrow">→</span>; }
