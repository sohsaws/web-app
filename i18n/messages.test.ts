import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ACTION_ERROR_CODES } from "@/lib/config/action-errors";
import { API_ERRORS } from "@/lib/config/api-errors";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/config/locales";
import { flattenMessages, isMessageTree } from "@/scripts/i18n/message-tree";
import { placeholderNames, richTagNames } from "@/scripts/i18n/placeholders";
import { MESSAGE_NAMESPACES, namespaceMessageKey } from "./namespaces";

const MESSAGES_DIR = path.join(process.cwd(), "messages");

function readMessages(locale: string, namespace: string): unknown {
  const file = path.join(MESSAGES_DIR, locale, `${namespace}.json`);
  return JSON.parse(readFileSync(file, "utf8"));
}

const files = LOCALES.flatMap((locale) =>
  MESSAGE_NAMESPACES.map((namespace) => [locale, namespace] as const),
);

// A wrong top-level key would not fail loudly: next-intl would quietly fall
// back to English, so the convention is enforced here.
describe("message files", () => {
  it.each(files)(
    "messages/%s/%s.json is empty or holds only its namespace key",
    (locale, namespace) => {
      const messages = readMessages(locale, namespace);

      // typeof null and typeof [] are both "object", so rule them out first.
      expect(messages).not.toBeNull();
      expect(Array.isArray(messages)).toBe(false);
      expect(messages).toBeTypeOf("object");
      const keys = Object.keys(messages ?? {});
      if (keys.length > 0) {
        expect(keys).toEqual([namespaceMessageKey(namespace)]);
      }
    },
  );
});

describe("namespaceMessageKey", () => {
  it.each([
    ["marketing", "Marketing"],
    ["apiErrors", "ApiErrors"],
  ] as const)("maps %s to %s", (namespace, key) => {
    expect(namespaceMessageKey(namespace)).toBe(key);
  });
});

describe("server error messages", () => {
  // A code without an English message would reach users as the generic
  // "Something went wrong", hiding a real, specific error.
  it("has an English message for every route and action error code", () => {
    const messages = readMessages("en", "apiErrors");
    const apiErrors =
      typeof messages === "object" &&
      messages !== null &&
      "ApiErrors" in messages
        ? messages.ApiErrors
        : {};
    const keys = Object.keys(apiErrors ?? {});

    for (const code of [...Object.keys(API_ERRORS), ...ACTION_ERROR_CODES]) {
      expect(keys).toContain(code);
    }
    expect(keys).toContain("UNKNOWN");
  });
});

function readMessageMap(
  locale: string,
  namespace: string,
): Map<string, string> {
  const messages = readMessages(locale, namespace);
  if (!isMessageTree(messages)) {
    throw new Error(
      `messages/${locale}/${namespace}.json has a non-string leaf`,
    );
  }
  return flattenMessages(messages);
}

const translatedFiles = files.filter(([locale]) => locale !== DEFAULT_LOCALE);

// English is the source: a key it lacks is dead, and a placeholder a
// translation renamed or dropped ({max} → {maximum}) would show up raw, and
// a lost rich tag (<muted>) would drop its styling. An
// apostrophe right before "{" quotes it in ICU (French "l'{name}"), so the
// user would see a literal "{name}".
describe("translations", () => {
  it.each(translatedFiles)(
    "messages/%s/%s.json matches the English keys and placeholders",
    (locale, namespace) => {
      const english = readMessageMap(DEFAULT_LOCALE, namespace);

      for (const [key, text] of readMessageMap(locale, namespace)) {
        expect(english.has(key), `${key} is not in English`).toBe(true);
        expect(placeholderNames(text), key).toEqual(
          placeholderNames(english.get(key) ?? ""),
        );
        expect(richTagNames(text), key).toEqual(
          richTagNames(english.get(key) ?? ""),
        );
        expect(text, key).not.toMatch(/'\{/);
      }
    },
  );
});
