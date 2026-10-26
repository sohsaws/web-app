import { defineRouting } from "next-intl/routing";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_MAX_AGE_SECONDS,
  LOCALE_COOKIE_NAME,
  LOCALES,
} from "@/lib/config/locales";

// Kept apart from navigation.ts: proxy.ts imports this file, and the
// navigation helpers pull in code that only works inside the App Router.
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  localeCookie: {
    name: LOCALE_COOKIE_NAME,
    maxAge: LOCALE_COOKIE_MAX_AGE_SECONDS,
  },
});
