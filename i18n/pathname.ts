import { isLocale, type Locale } from "@/lib/config/locales";

interface LocalizedPathname {
  // null when the first segment is not one of our locales.
  locale: Locale | null;
  // The path without the locale prefix, always starting with "/".
  pathname: string;
}

export function splitLocaleFromPathname(pathname: string): LocalizedPathname {
  const [, firstSegment = "", ...rest] = pathname.split("/");

  if (!isLocale(firstSegment)) {
    return { locale: null, pathname };
  }

  return { locale: firstSegment, pathname: `/${rest.join("/")}` };
}

// Matches the path itself and everything below it, but not a longer name:
// "/settings" covers "/settings/profile", never "/settingsx".
export function isPathUnder(pathname: string, prefixes: readonly string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
