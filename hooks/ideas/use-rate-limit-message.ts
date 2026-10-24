"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";

// Rounds up so the user is never told to retry before the limit resets, and
// never shows "0 minutes".
function getRetryAfterMinutes(retryAfterSeconds: number): number {
  return Math.max(1, Math.ceil(retryAfterSeconds / 60));
}

// The translated "try again in N minutes" text for a 429. Memoized, so an
// effect that depends on it does not re-run (and re-toast) on every render.
export function useRateLimitMessage(): (retryAfterSeconds: number) => string {
  const t = useTranslations("Ideas.rateLimit");

  return useCallback(
    (retryAfterSeconds: number): string =>
      t("message", { minutes: getRetryAfterMinutes(retryAfterSeconds) }),
    [t],
  );
}
