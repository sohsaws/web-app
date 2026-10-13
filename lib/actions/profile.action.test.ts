import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProfileFormValues } from "@/lib/config/profile";
import { updateProfile } from "./profile.action";

const { requestHeaders, getSession, updateUser } = vi.hoisted(() => ({
  requestHeaders: new Headers({ cookie: "session=abc" }),
  getSession: vi.fn(),
  updateUser: vi.fn(),
}));

vi.mock("next/headers", () => ({ headers: async () => requestHeaders }));
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession, updateUser } } }));

// A server action is a public endpoint, so it is called here with payloads
// its TypeScript signature would never allow.
function callWithUntypedInput(input: unknown) {
  return updateProfile(input as ProfileFormValues);
}

beforeEach(() => {
  getSession.mockResolvedValue({ user: { id: "u1" } });
  updateUser.mockResolvedValue({ status: true });
});

describe("updateProfile", () => {
  it.each([
    ["null", null],
    ["a blank name", { name: "   ", bio: "" }],
    ["a name over 50 characters", { name: "a".repeat(51), bio: "" }],
    ["a bio over 2000 characters", { name: "Ann", bio: "a".repeat(2001) }],
    ["a missing bio", { name: "Ann" }],
  ])("refuses %s before reading the session", async (_case, input) => {
    const result = await callWithUntypedInput(input);

    expect(result.success).toBe(false);
    expect(getSession).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("refuses without a session", async () => {
    getSession.mockResolvedValue(null);

    const result = await updateProfile({ name: "Ann", bio: "" });

    expect(result).toEqual({
      success: false,
      message: "You must be signed in to update your profile",
    });
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("sends only the trimmed name and bio with the caller's headers", async () => {
    const result = await callWithUntypedInput({
      name: "  Ann ",
      bio: " Likes hiking. ",
      image: "https://store.public.blob.vercel-storage.com/avatars/u2/a.png",
      email: "attacker@example.com",
    });

    expect(result.success).toBe(true);
    expect(updateUser).toHaveBeenCalledWith({
      body: { name: "Ann", bio: "Likes hiking." },
      headers: requestHeaders,
    });
  });

  it("reports a failed update without throwing", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    updateUser.mockRejectedValue(new Error("database down"));

    await expect(updateProfile({ name: "Ann", bio: "" })).resolves.toEqual({
      success: false,
      message: "Profile update failed",
    });
    expect(consoleError).toHaveBeenCalled();
  });
});
