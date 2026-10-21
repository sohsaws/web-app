import { describe, expect, it } from "vitest";
import { isPathUnder, splitLocaleFromPathname } from "./pathname";

describe("splitLocaleFromPathname", () => {
  it.each([
    ["/ru/settings/profile", "ru", "/settings/profile"],
    ["/en", "en", "/"],
    ["/de/", "de", "/"],
  ])("splits %s", (input, locale, pathname) => {
    expect(splitLocaleFromPathname(input)).toEqual({ locale, pathname });
  });

  it.each(["/", "/dashboard", "/eu/dashboard", "/EN/about", "/english"])(
    "finds no locale in %s",
    (input) => {
      expect(splitLocaleFromPathname(input)).toEqual({
        locale: null,
        pathname: input,
      });
    },
  );
});

describe("isPathUnder", () => {
  const prefixes = ["/dashboard", "/settings"];

  it.each(["/dashboard", "/settings/profile", "/settings/security/devices"])(
    "matches %s",
    (pathname) => {
      expect(isPathUnder(pathname, prefixes)).toBe(true);
    },
  );

  it.each(["/", "/settingsx", "/dash", "/about/dashboard"])(
    "does not match %s",
    (pathname) => {
      expect(isPathUnder(pathname, prefixes)).toBe(false);
    },
  );
});
