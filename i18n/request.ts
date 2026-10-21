import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import type { AbstractIntlMessages } from "next-intl";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, type Locale } from "@/lib/config/locales";
import { mergeMessages } from "./merge-messages";
import { MESSAGE_NAMESPACES } from "./namespaces";
import { routing } from "./routing";

async function loadMessages(locale: Locale): Promise<AbstractIntlMessages> {
  const files = await Promise.all(
    MESSAGE_NAMESPACES.map(
      async (namespace): Promise<AbstractIntlMessages> =>
        (await import(`../messages/${locale}/${namespace}.json`)).default,
    ),
  );

  return files.reduce(mergeMessages, {});
}

export default getRequestConfig(async ({ locale: requestedLocale }) => {
  // Server actions and route handlers have no [locale] segment and pass the
  // locale explicitly; pages and layouts read it from the URL.
  const locale = requestedLocale ?? (await rootParams.locale());

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const englishMessages = await loadMessages(DEFAULT_LOCALE);
  const messages =
    locale === DEFAULT_LOCALE
      ? englishMessages
      : mergeMessages(englishMessages, await loadMessages(locale));

  return { locale, messages };
});
