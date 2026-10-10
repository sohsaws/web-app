const SWIPE_THRESHOLD_RATIO = 1;
const SWIPE_PROJECTION_SECONDS = 0.3;

// Returns 1 (right), -1 (left) or 0 (snap back). A short but fast flick
// counts as a swipe too: the release velocity is projected forward and
// compared with the same threshold.
export function getSwipeDirection(
  offset: number,
  velocity: number,
  width: number,
): number {
  const threshold = width * SWIPE_THRESHOLD_RATIO;
  if (Math.abs(offset) >= threshold) {
    return Math.sign(offset);
  }

  const projectedOffset = offset + velocity * SWIPE_PROJECTION_SECONDS;
  return Math.abs(projectedOffset) >= threshold
    ? Math.sign(projectedOffset)
    : 0;
}
