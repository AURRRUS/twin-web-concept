/** Pure distance-to-frame helpers. Adapt to project; does not attach listeners. */
export const clamp01 = n => Math.max(0, Math.min(1, n));
export function progressAt(scrollY, hostTop, hostHeight, panelHeight) {
  if (![scrollY,hostTop,hostHeight,panelHeight].every(Number.isFinite)) throw new TypeError('Finite geometry required');
  const travel = hostHeight - panelHeight;
  return travel > 0 ? clamp01((scrollY-hostTop)/travel) : (scrollY >= hostTop ? 1 : 0);
}
export function phase(p, start, end) {
  if (!(end > start)) throw new RangeError('Phase end must exceed start');
  return clamp01((p-start)/(end-start));
}
export function frameAt(p, sceneCount) {
  if (!Number.isInteger(sceneCount) || sceneCount < 1) throw new RangeError('Positive scene count required');
  const scaled=clamp01(p)*sceneCount, index=Math.min(sceneCount-1,Math.floor(scaled));
  const local=scaled-index;
  // Example phase positions, NOT a project-approved choreography.
  return {index, local, label:phase(local,0,.12), lead:phase(local,.10,.25),
    body:phase(local,.20,.38), image:phase(local,.30,.58), hold:local>=.58};
}
