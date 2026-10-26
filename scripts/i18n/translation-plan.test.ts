import { describe, expect, it } from "vitest";
import type { MessageTree } from "./message-tree";
import { applyDrafts, planTranslation } from "./translation-plan";

const source: MessageTree = {
  Ns: {
    reviewed: "Reviewed",
    limit: "Max {max} characters",
    count: "{count, plural, one {# idea} other {# ideas}}",
    fresh: "Fresh",
  },
};

const target: MessageTree = {
  Ns: { reviewed: "Проверено", stale: "Устарело" },
};

describe("planTranslation", () => {
  it("sends only missing keys and leaves ICU arguments for hand translation", () => {
    expect(planTranslation(source, target)).toEqual({
      automatic: [
        ["Ns.limit", "Max {max} characters"],
        ["Ns.fresh", "Fresh"],
      ],
      manual: ["Ns.count"],
      removed: ["Ns.stale"],
    });
  });

  it("has nothing to do when every key is translated", () => {
    const plan = planTranslation({ Ns: { a: "A" } }, { Ns: { a: "А" } });

    expect(plan).toEqual({ automatic: [], manual: [], removed: [] });
  });

  it("plans the whole file for an empty locale", () => {
    expect(planTranslation({ Ns: { a: "A" } }, {}).automatic).toEqual([
      ["Ns.a", "A"],
    ]);
  });
});

describe("applyDrafts", () => {
  const automatic: [string, string][] = [
    ["Ns.limit", "Max {max} characters"],
    ["Ns.fresh", "Fresh"],
  ];

  it("restores placeholders, keeps reviewed text and drops stale keys", () => {
    const result = applyDrafts(source, target, automatic, [
      "Не более <x>{max}</x> символов",
      "Свежее",
    ]);

    expect(result.tree).toEqual({
      Ns: {
        reviewed: "Проверено",
        limit: "Не более {max} символов",
        fresh: "Свежее",
      },
    });
    expect(result.translated).toEqual(["Ns.limit", "Ns.fresh"]);
    expect(result.rejected).toEqual([]);
  });

  it("never overwrites an existing translation with a draft", () => {
    const result = applyDrafts(
      source,
      target,
      [["Ns.reviewed", "Reviewed"]],
      ["Черновик"],
    );

    expect(result.tree.Ns).toMatchObject({ reviewed: "Проверено" });
  });

  it.each([
    ["a renamed placeholder", "Не более {maximum} символов"],
    ["a dropped placeholder", "Не более символов"],
    ["an empty draft", "  "],
    ["a draft with an extra tag", "Не более <b>{max}</b> символов"],
  ])("rejects %s", (_case, draft) => {
    const result = applyDrafts(source, target, automatic, [draft, "Свежее"]);

    expect(result.rejected).toEqual(["Ns.limit"]);
    expect(result.translated).toEqual(["Ns.fresh"]);
    expect(result.tree.Ns).not.toHaveProperty("limit");
  });

  it("rejects keys DeepL returned no draft for", () => {
    expect(applyDrafts(source, target, automatic, []).rejected).toEqual([
      "Ns.limit",
      "Ns.fresh",
    ]);
  });
});
