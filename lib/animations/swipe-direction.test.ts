import { describe, expect, it } from "vitest";
import { getSwipeDirection } from "./swipe-direction";

// The threshold equals the card width.
const WIDTH = 300;

describe("getSwipeDirection", () => {
  it.each([
    ["right past the threshold", 320, 1],
    ["right exactly at the threshold", 300, 1],
    ["left past the threshold", -320, -1],
  ])("swipes when the card is dragged %s", (_case, offset, expected) => {
    expect(getSwipeDirection(offset, 0, WIDTH)).toBe(expected);
  });

  it.each([
    ["a short slow drag right", 100, 50],
    ["a short slow drag left", -100, -50],
    ["no movement", 0, 0],
  ])("snaps back after %s", (_case, offset, velocity) => {
    expect(getSwipeDirection(offset, velocity, WIDTH)).toBe(0);
  });

  it("treats a short fast flick as a swipe", () => {
    // 100 px + 1000 px/s × 0.3 s = 400 px projected, past the threshold.
    expect(getSwipeDirection(100, 1000, WIDTH)).toBe(1);
    expect(getSwipeDirection(-100, -1000, WIDTH)).toBe(-1);
  });

  it("follows the flick when it reverses the drag", () => {
    // 100 px − 2000 px/s × 0.3 s = −500 px projected.
    expect(getSwipeDirection(100, -2000, WIDTH)).toBe(-1);
  });
});
