import { describe, expect, it } from "vitest";
import { mergeMessages } from "./merge-messages";

describe("mergeMessages", () => {
  it("keeps English for keys the translation does not have yet", () => {
    const english = { Settings: { title: "Settings", save: "Save" } };
    const russian = { Settings: { title: "Настройки" } };

    expect(mergeMessages(english, russian)).toEqual({
      Settings: { title: "Настройки", save: "Save" },
    });
  });

  it("merges at every depth", () => {
    const english = {
      Auth: { errors: { invalid: "Invalid", expired: "Expired" } },
    };
    const german = { Auth: { errors: { invalid: "Ungültig" } } };

    expect(mergeMessages(english, german)).toEqual({
      Auth: { errors: { invalid: "Ungültig", expired: "Expired" } },
    });
  });

  it("adds namespaces that only the override has", () => {
    expect(mergeMessages({ A: { x: "1" } }, { B: { y: "2" } })).toEqual({
      A: { x: "1" },
      B: { y: "2" },
    });
  });

  it("does not change its inputs", () => {
    const english = { A: { x: "1" } };
    const override = { A: { x: "2" } };

    mergeMessages(english, override);

    expect(english).toEqual({ A: { x: "1" } });
    expect(override).toEqual({ A: { x: "2" } });
  });
});
