import { describe, expect, it } from "vitest";
import { PROFILE_BIO_MAX_LENGTH, profileFormSchema } from "./profile";

const validProfile = { name: "Alex", bio: "I like climbing." };

describe("profileFormSchema", () => {
  it("accepts a valid profile and trims both fields", () => {
    const profile = profileFormSchema.parse({
      name: "  Alex  ",
      bio: "  I like climbing.  ",
    });
    expect(profile).toEqual(validProfile);
  });

  describe("name", () => {
    it.each([
      ["empty", ""],
      ["only spaces", "   "],
    ])("rejects a name that is %s", (_, name) => {
      const result = profileFormSchema.safeParse({ ...validProfile, name });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toBe("Name cannot be empty");
    });

    it("accepts 50 characters and rejects 51", () => {
      expect(
        profileFormSchema.safeParse({ ...validProfile, name: "a".repeat(50) })
          .success,
      ).toBe(true);
      expect(
        profileFormSchema.safeParse({ ...validProfile, name: "a".repeat(51) })
          .success,
      ).toBe(false);
    });
  });

  describe("bio", () => {
    it("accepts an empty bio", () => {
      expect(
        profileFormSchema.safeParse({ ...validProfile, bio: "" }).success,
      ).toBe(true);
    });

    it("accepts the maximum length and rejects one character more", () => {
      const atLimit = "a".repeat(PROFILE_BIO_MAX_LENGTH);
      expect(
        profileFormSchema.safeParse({ ...validProfile, bio: atLimit }).success,
      ).toBe(true);
      expect(
        profileFormSchema.safeParse({ ...validProfile, bio: `${atLimit}a` })
          .success,
      ).toBe(false);
    });

    it("measures the length after trimming", () => {
      const bio = `   ${"a".repeat(PROFILE_BIO_MAX_LENGTH)}   `;
      expect(
        profileFormSchema.safeParse({ ...validProfile, bio }).success,
      ).toBe(true);
    });
  });
});
