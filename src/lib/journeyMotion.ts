const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

/** Reversible scroll mapping: no timers or queued transitions. */
export function journeyFrame(progress: number) {
  const p = clamp(progress);
  const from = p < .4 ? 0 : p < .8 ? 1 : 2;
  const transitioning = (p >= .2 && p < .4) || (p >= .6 && p < .8);
  const to = transitioning ? from + 1 : from;
  const q = transitioning ? (p - (from === 0 ? .2 : .6)) / .2 : 0;
  const heading = [0, 0, 0], headingY = [0, 0, 0];
  const media = [0, 0, 0], mediaY = [0, 0, 0];
  const copy = [0, 0, 0], copyY = [0, 0, 0];
  heading[from] = media[from] = copy[from] = 1;
  if (transitioning) {
    heading[from] = 1 - ease(q / .15);
    headingY[from] = -8 * (1 - heading[from]);
    heading[to] = ease((q - .15) / .25);
    headingY[to] = 12 * (1 - heading[to]);
    // Compositing over an opaque previous frame prevents a white dip.
    media[to] = ease((q - .4) / .4);
    mediaY[to] = 12 * (1 - media[to]);
    copy[from] = 1 - ease((q - .4) / .3);
    copy[to] = ease((q - .8) / .2);
    copyY[to] = 6 * (1 - copy[to]);
  }
  return { heading, headingY, media, mediaY, copy, copyY,
    active: transitioning && q >= .8 ? to : from,
    title: transitioning && q >= .15 ? to : from,
    explanation: transitioning && q >= .8 ? to : from };
}
