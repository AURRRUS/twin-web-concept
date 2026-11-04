/** VIS-008: absolute native scroll distance; no wheel counters or autonomous timers. */
export const openingTravel = height => Math.round(Math.max(2800, Math.min(4600, 4.2 * height)));
export const holdTarget = index => Math.max(0, Math.min(3, index)) / 4 + (1 / 21 + 1 / 4) / 2;
export function openingFrame(progress) {
 const p = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
 const to = Math.min(3, Math.floor(p * 4));
 const local = p - to / 4;
 const raw = Math.max(0, Math.min(1, local * 21));
 const q = raw * raw * (3 - 2 * raw);
 const from = Math.max(0, to - 1);
 const active = to === 0 || q >= .5 ? to : from;
 const moving = to > 0 && raw < 1;
 return {p, from, to, q, active, phase: moving ? 'reveal' : 'hold', copyOpacity: !moving ? 1 : q < .5 ? Math.max(0, 1-q/.4) : Math.min(1, (q-.5)/.35), copyY: !moving ? 0 : q < .5 ? -8*q : 12*(1-q)};
}
