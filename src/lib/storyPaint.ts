import { journeyStoryFrame, channelStoryFrame } from './salesStoryFrame.mjs';
import type { StoryKind } from './storyLayout';
type Frame = ReturnType<typeof journeyStoryFrame>;
function paintText(nodes: HTMLElement[], from: number, to: number, moving: boolean, out: number, enter: number) {
  nodes.forEach((node, i) => {
    const old = moving && i === from, next = moving && i === to;
    const show = moving ? (old && out < 1) || (next && enter > 0) : i === from;
    node.style.visibility = show ? 'visible' : 'hidden';
    node.style.clipPath = old ? `inset(0 0 ${out * 100}% 0)` : next ? `inset(${(1 - enter) * 100}% 0 0 0)` : 'none';
    node.style.transform = `translateY(${old ? -10 * out : next ? 12 * (1 - enter) : 0}px)`;
    node.setAttribute('aria-hidden', String(!show));
  });
}
export function createStoryPainter(root: HTMLElement, kind: StoryKind) {
  const titles = [...root.querySelectorAll<HTMLElement>('[data-story-title]')];
  const questions = [...root.querySelectorAll<HTMLElement>('[data-story-question]')];
  const sales = [...root.querySelectorAll<HTMLElement>('[data-story-sales]')];
  const photos = [...root.querySelectorAll<HTMLElement>('.story-photo')];
  const ids = kind === 'journey' ? ['project', 'corpus', 'floor', 'lot'] : ['site', 'online', 'agent', 'office'];
  return (progress: number, pinned: boolean, selected: number, mediaHeight: number) => {
    const frame = kind === 'journey' ? journeyStoryFrame(progress) : channelStoryFrame(progress);
    const from = pinned ? frame.from : selected, to = pinned ? frame.to : selected;
    const moving = pinned && frame.moving, active = pinned ? frame.active : selected;
    root.dataset.active = String(active);
    root.dataset.scene = ids[active];
    root.dataset.progress = String(progress);
    root.style.setProperty('--story-progress', String(progress));
    if (kind === 'journey') {
      const f = frame as Frame;
      paintText(titles, from, to, moving, f.titleOut, f.titleIn);
      paintText(questions, from, to, moving, f.questionOut, f.questionIn);
      paintText(sales, from, to, moving, f.salesOut, f.salesIn);
      photos.forEach((photo, i) => {
        const old = i === from, next = i === to;
        const opacity = moving ? old ? f.oldOpacity : next ? f.newOpacity : 0 : old ? 1 : 0;
        photo.style.opacity = String(opacity);
        photo.style.visibility = opacity > 0 ? 'visible' : 'hidden';
        photo.style.transform = moving && next ? `translateY(${12 * (1 - f.imageTransform)}px) scale(${1 + .025 * (1 - f.imageTransform)})` : 'none';
        photo.inert = moving || i !== active;
        photo.setAttribute('aria-hidden', String(i !== active));
      });
    } else {
      const f = frame as ReturnType<typeof channelStoryFrame>;
      paintText(titles, from, to, moving, f.textOut, f.titleIn);
      paintText(questions, from, to, moving, f.textOut, f.bodyIn);
      photos.forEach((photo, i) => {
        const old = i === from, next = i === to;
        photo.style.visibility = (moving ? old || next : old) ? 'visible' : 'hidden';
        photo.style.transform = moving && next ? `translateY(${(mediaHeight + 24) * (1 - f.photo)}px)` : moving && old ? `translateY(${-10 * f.photo}px) scale(${1 - .025 * f.photo})` : 'none';
        photo.style.opacity = '1';
        photo.inert = moving || i !== active;
        photo.setAttribute('aria-hidden', String(i !== active));
      });
    }
    return active;
  };
}
