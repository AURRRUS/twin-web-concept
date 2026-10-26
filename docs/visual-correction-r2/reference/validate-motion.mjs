/** Validation of this reference core only. This is not browser, layout, or website QA. */
import assert from 'node:assert/strict';
import { journeyStoryFrame, channelStoryFrame, qualityStoryFrame, journeyTargets, channelTargets, localProgress } from './salesStoryFrame.mjs';

for (const fn of [journeyStoryFrame, channelStoryFrame]) {
  for (let step = 0; step <= 2000; step++) {
    const p = step / 2000;
    const frame = fn(p);
    assert(frame.active >= 0 && frame.active <= 3);
    assert(frame.from >= 0 && frame.from <= 3);
    assert(frame.to >= 0 && frame.to <= 3);
    for (const value of Object.values(frame)) if (typeof value === 'number') assert(Number.isFinite(value));
    // A reverse/out-of-order traversal must not leave mutable playback state.
    fn(1 - p);
    assert.deepEqual(fn(p), frame);
    if (frame.oldOpacity !== undefined) assert(!(frame.oldOpacity > 0 && frame.newOpacity > 0));
  }
}
for (const [fn, targets] of [[journeyStoryFrame, journeyTargets], [channelStoryFrame, channelTargets]]) {
  targets.forEach((p, i) => {
    const frame = fn(p);
    assert.equal(frame.active, i);
    assert.equal(frame.moving, false);
    assert.equal(frame.from, frame.to);
  });
}
assert.equal(localProgress(1200, 1000, 1000, 1000), 1);
assert.equal(localProgress(800, 1000, 4600, 1000), 0);
assert.equal(localProgress(4600, 1000, 4600, 1000), 1);
for (const value of Object.values(qualityStoryFrame(1))) assert.equal(value, 1);
assert.equal(journeyStoryFrame(NaN).active, 0);
console.log('Reference motion invariants PASS: bounded progress, read holds, reverse/out-of-order, exclusive image opacity, final qualities, zero travel. Website QA still required.');
