import type { CSSProperties } from 'react';

const paths = {
  arrow: 'M4 12h15m-6-6 6 6-6 6',
  chevron: 'm9 5 7 7-7 7',
  down: 'm6 9 6 6 6-6',
  close: 'm6 6 12 12M18 6 6 18',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  plan: 'M4 3h16v18H4V3Zm0 9h9m0-9v13m0 1v4m0-9h7M8 7h1m7 10h1',
  building: 'M5 21V4l9-2v19M14 8h5v13M2 21h20M8 7h3M8 11h3M8 15h3',
  grid: 'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z',
  check: 'm5 12 4 4L19 6',
  document: 'M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8M8 16h6',
  layers: 'm12 2 10 6-10 6L2 8l10-6ZM2 12l10 6 10-6M2 16l10 6 10-6',
  settings: 'M8 3v18M16 3v18M3 8h10M11 16h10M5 8a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm8 8a3 3 0 1 0 6 0 3 3 0 0 0-6 0',
  message: 'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-5 8 8 0 0 1 8-8h2a8 8 0 0 1 8 8ZM7 10h10M7 14h6',
  compass: 'm16 8-3 5-5 3 3-5 5-3ZM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z',
};
export type IconName = keyof typeof paths;
export function Icon({ name, className = '', style }: { name: IconName; className?: string; style?: CSSProperties }) {
  return <svg className={`icon ${className}`} style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
