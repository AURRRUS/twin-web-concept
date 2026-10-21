const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

/** Pure, reversible scroll choreography. Images remain opaque; only their masks change. */
export function journeyFrame(progress: number) {
  const p = clamp(progress);
  const from = p < .38 ? 0 : p < .82 ? 1 : 2;
  const start = from === 0 ? .18 : .62;
  const transitioning = from < 2 && p >= start && p < start + .2;
  const to = transitioning ? from + 1 : from;
  const q = transitioning ? (p - start) / .2 : 0;
  const text = [0, 0, 0], textY = [0, 0, 0];
  const clip = [100, 100, 100], stack = [0, 0, 0];
  text[from] = 1; clip[from] = 0;
  if (transitioning) {
    text[from] = 1 - ease(q / .15);
    textY[from] = -8 * (1 - text[from]);
    text[to] = ease((q - .15) / .2);
    textY[to] = 12 * (1 - text[to]);
    clip[to] = 100 * (1 - ease((q - .35) / .55));
    stack[to] = 1;
  }
  const active = transitioning && q >= .35 ? to : from;
  return { text, textY, clip, stack, active, title: transitioning && q >= .15 ? to : from, explanation: transitioning && q >= .15 ? to : from };
}
