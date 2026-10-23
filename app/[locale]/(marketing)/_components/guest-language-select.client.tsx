"use client";

import { useLocale, useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { LanguageSelect } from "@/components/ui/language-select.client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, resolveLocale } from "@/lib/config/locales";

// Guests have no profile to store a language in, so the choice lives only in
// the URL (and the NEXT_LOCALE cookie next-intl writes on the switch).
export function GuestLanguageSelect(): ReactElement {
  const t = useTranslations("Marketing.languageSelect");
  const locale = resolveLocale(useLocale());
  const router = useRouter();
  const pathname = usePathname();

  function handleLanguageChange(nextLocale: Locale): void {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <LanguageSelect
      value={locale}
      onChange={handleLanguageChange}
      label={t("label")}
      variant="pill"
    />
  );
}
