import { describe, expect, it } from "vitest";
import { isNotificationPreferences } from "./notifications";

describe("isNotificationPreferences", () => {
  it("accepts an object with both booleans", () => {
    expect(
      isNotificationPreferences({ productUpdates: true, weeklyDigest: false }),
    ).toBe(true);
  });

  // Extra keys pass the guard on purpose: the server action copies only the
  // two known fields into the database, so securityEmails can never be set.
  it("accepts extra keys, which the action never copies", () => {
    expect(
      isNotificationPreferences({
        productUpdates: false,
        weeklyDigest: false,
        securityEmails: false,
      }),
    ).toBe(true);
  });

  it.each([
    ["null", null],
    ["undefined", undefined],
    ["a string", "productUpdates"],
    ["a number", 1],
    ["an array", [true, false]],
    ["an empty object", {}],
    ["a missing field", { productUpdates: true }],
    [
      "strings instead of booleans",
      { productUpdates: "true", weeklyDigest: "false" },
    ],
    ["numbers instead of booleans", { productUpdates: 1, weeklyDigest: 0 }],
    ["null fields", { productUpdates: null, weeklyDigest: null }],
  ])("rejects %s", (_case, value) => {
    expect(isNotificationPreferences(value)).toBe(false);
  });
});
