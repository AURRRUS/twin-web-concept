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
  root.style.removeProperty('--story-media-height');
  if (fits && kind === 'journey') {
    const frame = root.querySelector<HTMLElement>('.story-j4-frame')!;
    const media = root.querySelector<HTMLElement>('.story-media-stage')!;
    const css = getComputedStyle(panel);
    const availableHeight = panel.clientHeight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom);
    const heading = root.querySelector<HTMLElement>('.story-j4-header')!;
    const aside = root.querySelector<HTMLElement>('.story-j4-aside')!;
    const sales = root.querySelector<HTMLElement>('.story-j4-sales')!;
    const visual = root.querySelector<HTMLElement>('.story-j4-visual')!;
    const naturalHeight = visual.clientWidth * 941 / 1671;
    const columnHeight = availableHeight - heading.offsetHeight - parseFloat(getComputedStyle(heading).marginBottom);
    const mediaBudget = columnHeight - sales.scrollHeight - parseFloat(getComputedStyle(sales).marginTop) - 2;
    const height = Math.min(naturalHeight, mediaBudget);
    root.style.setProperty('--story-media-height', `${Math.max(0, height)}px`);
    fits = height >= 240 && aside.scrollHeight <= columnHeight && frame.scrollHeight <= availableHeight;
  } else if (fits) {
    const layout = root.querySelector<HTMLElement>('.story-channel-layout')!;
    const css = getComputedStyle(panel);
    const available = panel.clientHeight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom);
    fits = layout.scrollHeight <= available - 2;
  }
  if (!fits) root.style.removeProperty('--story-media-height');
  root.dataset.mode = fits ? 'pin' : 'switch';
  delete root.dataset.measuring;
  root.dataset.layoutCount = String(Number(root.dataset.layoutCount || 0) + 1);
  return fits;
}
