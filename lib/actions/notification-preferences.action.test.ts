import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateNotificationPreferences } from "./notification-preferences.action";

const { getSession, upsert } = vi.hoisted(() => ({
  getSession: vi.fn(),
  upsert: vi.fn(),
}));

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession } } }));
vi.mock("@/lib/prisma", () => ({
  default: { notificationPreference: { upsert } },
}));

beforeEach(() => {
  getSession.mockResolvedValue({ user: { id: "u1" } });
  upsert.mockResolvedValue({});
});

describe("updateNotificationPreferences", () => {
  it.each([
    ["null", null],
    ["an array", [true, false]],
    ["a string", "productUpdates=true"],
    ["a missing field", { productUpdates: true }],
    ["a string boolean", { productUpdates: "true", weeklyDigest: false }],
  ])(
    "refuses %s before reading the session or the database",
    async (_case, input) => {
      await expect(updateNotificationPreferences(input)).resolves.toEqual({
        success: false,
        message: "Invalid notification settings",
      });
      expect(getSession).not.toHaveBeenCalled();
      expect(upsert).not.toHaveBeenCalled();
    },
  );

  it("refuses without a session", async () => {
    getSession.mockResolvedValue(null);

    const result = await updateNotificationPreferences({
      productUpdates: true,
      weeklyDigest: false,
    });

    expect(result.success).toBe(false);
    expect(upsert).not.toHaveBeenCalled();
  });

  it("writes only the two optional switches for the session user", async () => {
    const result = await updateNotificationPreferences({
      productUpdates: true,
      weeklyDigest: false,
      securityEmails: false,
      userId: "u2",
    });

    expect(result).toEqual({ success: true });
    expect(upsert).toHaveBeenCalledWith({
      where: { userId: "u1" },
      create: { userId: "u1", productUpdates: true, weeklyDigest: false },
      update: { productUpdates: true, weeklyDigest: false },
    });
  });

  it("reports a database failure without throwing", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    upsert.mockRejectedValue(new Error("database down"));

    await expect(
      updateNotificationPreferences({
        productUpdates: true,
        weeklyDigest: true,
      }),
    ).resolves.toEqual({
      success: false,
      message: "Unable to save notification settings",
    });
    expect(consoleError).toHaveBeenCalled();
  });
});
