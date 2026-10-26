const DEFAULT_RETRY_AFTER_SECONDS = 60;

// Seconds until `resetAt` (a Unix time in milliseconds), never below one so a
// client is not told to retry immediately into the same limit.
export function getRetryAfterSeconds(resetAt: number, now: number): number {
  return Math.max(1, Math.ceil((resetAt - now) / 1000));
}

// Reads the seconds form of the Retry-After header. HTTP also allows a date,
// which our API never sends; anything unusable falls back to one minute.
export function parseRetryAfterSeconds(value: string | null): number {
  const trimmed = value?.trim() ?? "";
  if (!/^\d+$/.test(trimmed)) {
    return DEFAULT_RETRY_AFTER_SECONDS;
  }

  return Math.max(1, Number(trimmed));
}
