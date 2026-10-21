import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, isLocale, LOCALE_NAMES, LOCALES } from "./locales";

describe("locales", () => {
  it("has English as the default locale", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    expect(LOCALES).toContain(DEFAULT_LOCALE);
  });

  it("names every locale in its own language", () => {
    expect(LOCALE_NAMES).toEqual({
      en: "English",
      ru: "Русский",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
    });
  });
});

describe("isLocale", () => {
  it.each([...LOCALES])("accepts %s", (locale) => {
    expect(isLocale(locale)).toBe(true);
  });

  it.each([
    ["an unknown code", "kk"],
    ["a region tag", "en-US"],
    ["upper case", "EN"],
    ["an empty string", ""],
    ["null", null],
    ["a number", 1],
    ["an inherited key", "toString"],
  ])("rejects %s", (_case, value) => {
    expect(isLocale(value)).toBe(false);
  });
});
