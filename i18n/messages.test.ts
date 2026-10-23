import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/config/locales";
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
