export type StoryKind = 'journey' | 'channels';
export type StoryGeometry = { top: number; hostHeight: number; panelHeight: number; mediaHeight: number };
export function readStoryGeometry(root: HTMLElement): StoryGeometry {
  const panel = root.querySelector<HTMLElement>('.story-panel')!;
  return {
    top: root.getBoundingClientRect().top + scrollY,
    hostHeight: root.offsetHeight,
    panelHeight: panel.offsetHeight,
    mediaHeight: root.querySelector<HTMLElement>('.story-media-stage')!.offsetHeight,
  };
}
/** Runs only on layout invalidation. No scene transforms participate in measurement. */
export function measureStoryLayout(root: HTMLElement, kind: StoryKind, reduced: boolean) {
  const panel = root.querySelector<HTMLElement>('.story-panel')!;
  let fits = innerWidth >= 1100 && innerHeight >= 680 && !reduced;
  root.dataset.measuring = fits ? 'true' : 'false';
  root.style.removeProperty('--story-frame-width');
  if (fits && kind === 'journey') {
    const frame = root.querySelector<HTMLElement>('.story-j4-frame')!;
    const media = root.querySelector<HTMLElement>('.story-media-stage')!;
    const css = getComputedStyle(panel);
    const availableHeight = panel.clientHeight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom);
    const desired = Math.min(1360, panel.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight));
    let width = desired;
    for (let i = 0; i < 4; i++) {
      root.style.setProperty('--story-frame-width', `${Math.max(0, width)}px`);
      const bands = frame.scrollHeight - media.offsetHeight;
      const next = Math.min(desired, (availableHeight - bands - 2) * 1671 / 941);
      if (Math.abs(next - width) < 1) break;
      width = next;
    }
    root.style.setProperty('--story-frame-width', `${Math.max(0, width)}px`);
    fits = width >= 800 && frame.scrollHeight <= availableHeight - 2;
  } else if (fits) {
    const layout = root.querySelector<HTMLElement>('.story-channel-layout')!;
    const css = getComputedStyle(panel);
    const available = panel.clientHeight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom);
    fits = layout.scrollHeight <= available - 2;
  }
  if (!fits) root.style.removeProperty('--story-frame-width');
  root.dataset.mode = fits ? 'pin' : 'switch';
  delete root.dataset.measuring;
  root.dataset.layoutCount = String(Number(root.dataset.layoutCount || 0) + 1);
  return fits;
}
