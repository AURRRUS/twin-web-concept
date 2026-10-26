import { test, expect } from '@playwright/test';
import { journeyFrame, scrollDistance, stops, transitions } from '../src/lib/v2/journeyFrame';

test('Journey reading pauses retain one complete scene', () => {
  for (const [p, expected] of [[.10, 0], [.35, 1], [.65, 2], [.95, 3]] as const) {
    const f = journeyFrame(p);
    expect(f.active).toBe(expected);
    expect(f.transitioning).toBe(false);
    expect(f.oldCopy).toBe(1);
    expect(f.oldImage).toBe(1);
  }
  expect(stops).toEqual([0, 1 / 3, 2 / 3, 1]);
});

test('Journey cascades label, lead, body and photo at the specified transition phases', () => {
  for (const [index, [start, end]] of transitions.entries()) {
    const at = (q: number) => journeyFrame(start + (end - start) * q);
    const early = at(.25);
    expect(early.oldCopy).toBe(0);
    expect(early.expand).toBeGreaterThan(0);
    expect(early.nextLead).toBe(0);
    expect(early.oldImage).toBe(1);
    const middle = at(.5);
    expect(middle.active).toBe(index + 1);
    expect(middle.nextLead).toBeGreaterThan(0);
    expect(middle.nextImage).toBe(0);
    const late = at(.9);
    expect(late.nextLead).toBe(1);
    expect(late.nextBody).toBe(1);
    expect(late.oldImage).toBe(0);
    expect(late.nextImage).toBeGreaterThan(0);
  }
});

test('Journey frame is reversible and independent of request order', () => {
  const positions = [.1, .2, .35, .49, .65, .79, .95];
  const forward = positions.map(journeyFrame);
  const reverse = [...positions].reverse().map(journeyFrame).reverse();
  expect(reverse).toEqual(forward);
  expect(journeyFrame(.2)).toEqual(journeyFrame(.2));
  expect(scrollDistance(900)).toBe(2205);
  expect(scrollDistance(500)).toBe(1500);
});
