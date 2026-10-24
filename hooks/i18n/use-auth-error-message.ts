"use client";

import { useTranslations } from "next-intl";

interface AuthErrorDetails {
  code: string | null;
  status: number | null;
}

function readAuthErrorDetails(error: unknown): AuthErrorDetails {
  if (typeof error !== "object" || error === null) {
    return { code: null, status: null };
  }
  const code =
    "code" in error && typeof error.code === "string" ? error.code : null;
  const status =
    "status" in error && typeof error.status === "number" ? error.status : null;
  return { code, status };
}

// Better Auth answers with English text plus a stable error code; the code
// picks the translated message. Unknown codes get `fallback` (an
// already-translated message naming the action, such as "Unable to change
// your email") or a generic one. The error is `unknown` because Better Auth
// types it differently in `onError` and in the returned result.
export function useAuthErrorMessage(): (
  error: unknown,
  fallback?: string,
) => string {
  const t = useTranslations("Auth.errors");

  return (error, fallback) => {
    const { code, status } = readAuthErrorDetails(error);
    // Better Auth's rate limiter answers 429 without a code; the generic
    // "try again" would send the user straight into the limit again.
    if (status === 429) {
      return t("RATE_LIMITED");
    }
    if (code !== null && t.has(code)) {
      return t(code);
    }
    return fallback ?? t("default");
  };
}
