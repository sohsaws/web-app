import { describe, expect, it } from "vitest";
import {
  buildMessageTree,
  flattenMessages,
  isMessageTree,
  type MessageTree,
} from "./message-tree";

const source: MessageTree = {
  Settings: {
    profile: { saved: "Saved", title: "Profile" },
    language: { label: "Language" },
  },
};

describe("isMessageTree", () => {
  it.each([
    ["an empty file", {}],
    ["nested strings", source],
  ])("accepts %s", (_case, value) => {
    expect(isMessageTree(value)).toBe(true);
  });

  it.each([
    ["null", null],
    ["an array", ["a"]],
    ["a string", "a"],
    ["a number leaf", { a: 1 }],
    ["a deep array leaf", { a: { b: ["c"] } }],
  ])("rejects %s", (_case, value) => {
    expect(isMessageTree(value)).toBe(false);
  });
});

describe("flattenMessages", () => {
  it("maps dotted paths to texts", () => {
    expect([...flattenMessages(source)]).toEqual([
      ["Settings.profile.saved", "Saved"],
      ["Settings.profile.title", "Profile"],
      ["Settings.language.label", "Language"],
    ]);
  });

  it("returns nothing for an empty tree", () => {
    expect(flattenMessages({}).size).toBe(0);
  });
});

describe("buildMessageTree", () => {
  it("keeps the source order and drops paths without a value", () => {
    const values = new Map([
      ["Settings.language.label", "Sprache"],
      ["Settings.profile.saved", "Gespeichert"],
    ]);

    const tree = buildMessageTree(source, (key) => values.get(key));

    expect(tree).toEqual({
      Settings: {
        profile: { saved: "Gespeichert" },
        language: { label: "Sprache" },
      },
    });
    expect(Object.keys(tree.Settings ?? {})).toEqual(["profile", "language"]);
  });

  it("returns an empty tree when nothing has a value", () => {
    expect(buildMessageTree(source, () => undefined)).toEqual({});
  });
});
