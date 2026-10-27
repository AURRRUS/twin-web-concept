export function sitePath(path: string): string {
  // Standalone V2 packaging retains shared components but owns their media bytes.
  if (path.startsWith('/media/') && import.meta.env.PUBLIC_TWIN_MEDIA_BASE) return `${import.meta.env.PUBLIC_TWIN_MEDIA_BASE}${path}`;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
