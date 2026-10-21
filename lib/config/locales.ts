import { z } from "zod";

// English is the default and the source language every translation is made
// from. The order is the order of the language picker.
export const LOCALES = ["en", "ru", "es", "fr", "de"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// The cookie next-intl reads to pick a language for URLs without a prefix.
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

// Each language is written in itself, so a user who cannot read the current
// language still finds their own.
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};

export const localeSchema = z.enum(LOCALES);

export function isLocale(value: unknown): value is Locale {
  return localeSchema.safeParse(value).success;
}
