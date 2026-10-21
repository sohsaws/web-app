import { defineRouting } from "next-intl/routing";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALES,
} from "@/lib/config/locales";

// Kept apart from navigation.ts: proxy.ts imports this file, and the
// navigation helpers pull in code that only works inside the App Router.
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  // A year instead of next-intl's session cookie, so a guest's chosen
  // language survives closing the browser.
  localeCookie: {
    name: LOCALE_COOKIE_NAME,
    maxAge: 60 * 60 * 24 * 365,
  },
});
