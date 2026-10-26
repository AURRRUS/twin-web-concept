/** Scroll is the only timebase: a frame is entirely determined by p. */
export const stops = [0, 1 / 3, 2 / 3, 1] as const;
export const transitions = [[.14, .27], [.43, .56], [.72, .86]] as const;
export const clamp = (n: number) => Math.min(1, Math.max(0, n));
export const phase = (v: number, from: number, to: number) => {
  const x = clamp((v - from) / (to - from));
  return x * x * (3 - 2 * x);
};
export type Frame = { old: number; next: number; active: number; transitioning: boolean; q: number; oldCopy: number; nextLead: number; nextBody: number; expand: number; oldImage: number; nextImage: number; imageMotion: number };
export function journeyFrame(progress: number): Frame {
  const p = clamp(progress);
  const step = transitions.findIndex(([start, end]) => p >= start && p <= end);
  if (step < 0) {
    const index = p < .14 ? 0 : p < .43 ? 1 : p < .72 ? 2 : 3;
    return { old: index, next: index, active: index, transitioning: false, q: 0, oldCopy: 1, nextLead: 1, nextBody: 1, expand: 1, oldImage: 1, nextImage: 1, imageMotion: 1 };
  }
  const [start, end] = transitions[step], q = clamp((p - start) / (end - start));
  return { old: step, next: step + 1, active: p < start + (end - start) * .5 ? step : step + 1, transitioning: true, q,
    oldCopy: 1 - phase(q, 0, .2), expand: phase(q, .16, .55), nextLead: phase(q, .32, .67), nextBody: phase(q, .48, .8),
    oldImage: 1 - phase(q, .58, .82), nextImage: phase(q, .58, 1), imageMotion: phase(q, .58, 1) };
}
export const scrollDistance = (height: number) => 3 * Math.max(420, .70 * height) + Math.max(240, .35 * height);
