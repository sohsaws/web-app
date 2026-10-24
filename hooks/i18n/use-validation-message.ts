"use client";

import { useTranslations } from "next-intl";

type ValidationValues = Record<string, string | number>;

// Zod schemas carry message keys ("nameRequired"), so one schema serves the
// client, the server and Better Auth; the text is chosen here, at display.
// `values` fills placeholders such as {max}.
export function useValidationMessage(): (
  message: string | undefined,
  values?: ValidationValues,
) => string | undefined {
  const t = useTranslations("Validation");

  return (message, values) => {
    if (message === undefined) {
      return undefined;
    }

    // Zod's own default messages are not keys; show a generic one instead.
    return t.has(message) ? t(message, values) : t("invalid");
  };
}
