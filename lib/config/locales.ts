import { z } from "zod";

// English is the default and the source language every translation is made
// from. The order is the order of the language picker.
export const LOCALES = ["en", "ru", "es", "fr", "de"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// The cookie next-intl reads to pick a language for URLs without a prefix.
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

// A year instead of a session cookie, so the chosen language survives
// closing the browser.
export const LOCALE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

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

// The first candidate that is a supported locale, in priority order, or
// English. Cookies and stored values come from outside, so none is trusted.
export function resolveLocale(...candidates: unknown[]): Locale {
  return candidates.find(isLocale) ?? DEFAULT_LOCALE;
}
