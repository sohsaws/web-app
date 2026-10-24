import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateLocale } from "./locale.action";

const { requestHeaders, cookieStore, getSession, updateUser } = vi.hoisted(
  () => ({
    requestHeaders: new Headers({ cookie: "session=abc" }),
    cookieStore: { set: vi.fn() },
    getSession: vi.fn(),
    updateUser: vi.fn(),
  }),
);

vi.mock("next/headers", () => ({
  headers: async () => requestHeaders,
  cookies: async () => cookieStore,
}));
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession, updateUser } } }));

beforeEach(() => {
  getSession.mockResolvedValue({ user: { id: "u1", locale: "en" } });
  updateUser.mockResolvedValue({ status: true });
});

describe("updateLocale", () => {
  it.each([
    ["an unsupported code", "kk"],
    ["a region tag", "de-DE"],
    ["null", null],
    ["an object", { locale: "de" }],
  ])("refuses %s before reading the session", async (_case, input) => {
    await expect(updateLocale(input)).resolves.toEqual({
      success: false,
      code: "UNSUPPORTED_LANGUAGE",
    });
    expect(getSession).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
    expect(cookieStore.set).not.toHaveBeenCalled();
  });

  it("refuses without a session", async () => {
    getSession.mockResolvedValue(null);

    const result = await updateLocale("de");

    expect(result.success).toBe(false);
    expect(updateUser).not.toHaveBeenCalled();
    expect(cookieStore.set).not.toHaveBeenCalled();
  });

  it("saves the language through Better Auth and mirrors it in the cookie", async () => {
    await expect(updateLocale("de")).resolves.toEqual({
      success: true,
      locale: "de",
    });

    expect(updateUser).toHaveBeenCalledWith({
      body: { locale: "de" },
      headers: requestHeaders,
    });
    expect(cookieStore.set).toHaveBeenCalledWith(
      "NEXT_LOCALE",
      "de",
      expect.objectContaining({ path: "/", sameSite: "lax" }),
    );
  });

  it("keeps the old cookie when saving fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    updateUser.mockRejectedValue(new Error("database down"));

    await expect(updateLocale("de")).resolves.toEqual({
      success: false,
      code: "LANGUAGE_UPDATE_FAILED",
    });
    expect(cookieStore.set).not.toHaveBeenCalled();
  });
});
