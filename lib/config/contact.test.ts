import { describe, expect, it, vi } from "vitest";
import { getContactEmail } from "./contact";

describe("getContactEmail", () => {
  it("returns the address from CONTACT_EMAIL_ADDRESS", () => {
    vi.stubEnv("CONTACT_EMAIL_ADDRESS", "hello@example.com");
    expect(getContactEmail()).toBe("hello@example.com");
  });

  it.each([
    ["missing", undefined],
    ["empty", ""],
    ["not an email", "hello at example dot com"],
  ])("throws when the value is %s", (_case, value) => {
    vi.stubEnv("CONTACT_EMAIL_ADDRESS", value);
    expect(() => getContactEmail()).toThrow(
      "CONTACT_EMAIL_ADDRESS must be a valid email address",
    );
  });
});
