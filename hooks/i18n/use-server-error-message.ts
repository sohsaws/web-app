"use client";

import { useTranslations } from "next-intl";
import { isServerErrorCode } from "@/lib/config/action-errors";
import { ApiResponseError } from "@/lib/utils/responseError";

// Turns a server error, either a failed API response or a server action's
// code, into a message in the user's language. Unknown errors get a generic
// message instead of the server's English text.
export function useServerErrorMessage(): (source: unknown) => string {
  const t = useTranslations("ApiErrors");

  return (source) => {
    const code = source instanceof ApiResponseError ? source.code : source;
    return isServerErrorCode(code) ? t(code) : t("UNKNOWN");
  };
}
