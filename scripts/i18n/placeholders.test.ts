import { describe, expect, it } from "vitest";
import {
  hasSamePlaceholders,
  hasSameRichTags,
  needsManualTranslation,
  placeholderNames,
  protectPlaceholders,
  restorePlaceholders,
  richTagNames,
} from "./placeholders";

describe("needsManualTranslation", () => {
  it.each([
    "{count, plural, one {# idea} other {# ideas}}",
    "{ count , plural, one {#} other {#}}",
    "{gender, select, female {She} other {They}}",
    "{place, selectordinal, one {#st} other {#th}}",
    "Saved {count, number} ideas",
    "Since {when, date, short}",
  ])("flags %s", (text) => {
    expect(needsManualTranslation(text)).toBe(true);
  });

  it.each([
    "Name cannot be longer than {max} characters.",
    "No placeholders here.",
    "",
  ])("lets DeepL draft %s", (text) => {
    expect(needsManualTranslation(text)).toBe(false);
  });
});

describe("placeholderNames", () => {
  it("lists names sorted, repeats included", () => {
    expect(placeholderNames("{b} and {a} then {b}")).toEqual(["a", "b", "b"]);
  });

  it("returns nothing for text without placeholders", () => {
    expect(placeholderNames("")).toEqual([]);
  });
});

describe("richTagNames", () => {
  it("lists opening tags sorted, ignoring placeholders", () => {
    expect(
      richTagNames("<muted>a</muted> {name} <br></br><link>b</link>"),
    ).toEqual(["br", "link", "muted"]);
  });
});

describe("hasSameRichTags", () => {
  it("accepts moved tags", () => {
    expect(hasSameRichTags("<b>x</b> y", "y <b>x</b>")).toBe(true);
  });

  it.each([
    ["a dropped tag", "Hi <muted>there</muted>", "Hallo da"],
    ["a renamed tag", "Hi <muted>there</muted>", "Hallo <stumm>da</stumm>"],
  ])("rejects %s", (_case, source, translation) => {
    expect(hasSameRichTags(source, translation)).toBe(false);
  });
});

describe("hasSamePlaceholders", () => {
  it("accepts a reordered translation", () => {
    expect(hasSamePlaceholders("{a} of {b}", "{b} von {a}")).toBe(true);
  });

  it.each([
    ["a renamed placeholder", "{max} chars", "{maximum} Zeichen"],
    ["a dropped placeholder", "{max} chars", "Zeichen"],
    ["an added placeholder", "chars", "{max} Zeichen"],
  ])("rejects %s", (_case, source, translation) => {
    expect(hasSamePlaceholders(source, translation)).toBe(false);
  });
});

describe("protectPlaceholders and restorePlaceholders", () => {
  it("wraps placeholders and escapes ampersands for XML", () => {
    expect(protectPlaceholders("Terms & {name}")).toBe(
      "Terms &amp; <x>{name}</x>",
    );
  });

  it("round-trips text unchanged", () => {
    const text = 'Say "hi" to {name} & {other}';
    expect(restorePlaceholders(protectPlaceholders(text))).toBe(text);
  });

  it("unescapes entities DeepL may return", () => {
    expect(restorePlaceholders("&quot;a&quot; &apos;b&apos; &amp;quot;")).toBe(
      "\"a\" 'b' &quot;",
    );
  });

  it("replaces an apostrophe before a placeholder so ICU does not quote it", () => {
    expect(restorePlaceholders("l'<x>{name}</x>")).toBe("l’{name}");
  });

  it("keeps other apostrophes", () => {
    expect(restorePlaceholders("l'idée")).toBe("l'idée");
  });
});
