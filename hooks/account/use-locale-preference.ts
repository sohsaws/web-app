"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { usePathname, useRouter } from "@/i18n/navigation";
import { updateLocale } from "@/lib/actions/locale.action";
import { LOCALE_NAMES, type Locale, resolveLocale } from "@/lib/config/locales";

interface UseLocalePreferenceResult {
  locale: Locale;
  isSaving: boolean;
  changeLocale: (next: Locale) => void;
}

// The language applies as soon as it is chosen: the profile is saved, then
// the same page is rendered under the new locale prefix.
export function useLocalePreference(): UseLocalePreferenceResult {
  const currentLocale = resolveLocale(useLocale());
  const t = useTranslations("Settings.language");
  const router = useRouter();
  const pathname = usePathname();
  // The language being switched to. After a successful save it stays set
  // until the page renders under the new locale (which remounts this hook),
  // so the field keeps showing the choice and a second switch cannot start
  // while the new page is still loading.
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);
  const [, startTransition] = useTransition();

  function changeLocale(next: Locale): void {
    if (pendingLocale !== null) {
      return;
    }

    setPendingLocale(next);
    startTransition(async () => {
      try {
        const result = await updateLocale(next);

        if (!result.success) {
          setPendingLocale(null);
          // One message for every refusal: the user can only retry here.
          toast.error(t("error"));
          return;
        }

        // Shown before navigating, so it is in the language the user just
        // left and can still read.
        toast.success(t("updated", { language: LOCALE_NAMES[result.locale] }));
        router.replace(pathname, { locale: result.locale });
      } catch (error: unknown) {
        // A throw inside an async transition would reach the error boundary.
        console.error("Language update request failed:", error);
        setPendingLocale(null);
        toast.error(t("error"));
      }
    });
  }

  return {
    locale: pendingLocale ?? currentLocale,
    isSaving: pendingLocale !== null,
    changeLocale,
  };
}
