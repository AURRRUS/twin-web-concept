/** R2 pure frame calculator. Integrate with the repository DOM driver, not a second driver. */
import motion from './salesStoryMotion.json' with { type: 'json' };

export const clamp = value => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;

export function phase(value, start, end) {
  if (end <= start) return value >= end ? 1 : 0;
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

function base(progress, intervals, navAt) {
  const p = clamp(progress);
  let from = 0;
  for (let i = 0; i < intervals.length; i++) {
    const [a, b] = intervals[i];
    if (p < a) break;
    if (p <= b) {
      const t = clamp((p - a) / (b - a));
      return { p, from: i, to: i + 1, t, moving: true, active: t >= navAt ? i + 1 : i };
    }
    from = i + 1;
  }
  return { p, from, to: from, t: 1, moving: false, active: from };
}

export const journeyTargets = motion.journey.nav_targets;
const channelTravel = motion.channels.host_svh - motion.channels.panel_svh;
export const channelTargets = motion.channels.nav_targets_svh.map(value => value / channelTravel);

export function journeyStoryFrame(progress) {
  const spec = motion.journey;
  const frame = base(progress, spec.transition_intervals, spec.transition_local.nav_active_at);
  const v = spec.transition_local;
  const at = key => frame.moving ? phase(frame.t, ...v[key]) : 1;
  return {
    ...frame,
    titleOut: at('title_out'), titleIn: at('title_in'),
    questionOut: at('question_out'), questionIn: at('question_in'),
    salesOut: at('sales_out'), salesIn: at('sales_in'),
    oldOpacity: frame.moving ? 1 - at('image_out_opacity') : 1,
    newOpacity: frame.moving ? at('image_in_opacity') : 0,
    imageTransform: at('image_in_transform')
  };
}

export function channelStoryFrame(progress) {
  const spec = motion.channels;
  const intervals = spec.transition_intervals_svh.map(pair => pair.map(value => value / channelTravel));
  const frame = base(progress, intervals, spec.transition_local.nav_active_at);
  const v = spec.transition_local;
  const at = key => frame.moving ? phase(frame.t, ...v[key]) : 1;
  return { ...frame, textOut: at('old_text_out'), titleIn: at('new_title_in'), bodyIn: at('new_body_in'), photo: at('photo_in') };
}

export function qualityStoryFrame(progress) {
  return Object.fromEntries(Object.entries(motion.delivery.phases).map(([key, [a, b]]) => [key, phase(clamp(progress), a, b)]));
}

/** Pass document-relative top and measured heights. Zero travel never returns NaN. */
export function localProgress(scrollY, top, hostHeight, panelHeight) {
  return clamp((scrollY - top) / Math.max(1, hostHeight - panelHeight));
}
