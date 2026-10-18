import { randomUUID } from "node:crypto";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { getNotificationPreferences } from "@/lib/data/get-notification-preferences";
import prisma from "@/lib/prisma";
import { updateNotificationPreferences } from "./notification-preferences.action";

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }));

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession } } }));

// The test branch is a copy of production: only rows created here are
// touched, and they are removed in afterAll.
const run = randomUUID();
const userId = `test-notify-${run}`;
const otherUserId = `test-notify-other-${run}`;

beforeAll(async () => {
  await prisma.user.createMany({
    data: [
      { id: userId, name: "User", email: `${userId}@example.test` },
      { id: otherUserId, name: "Other", email: `${otherUserId}@example.test` },
    ],
  });
});

beforeEach(() => {
  getSession.mockResolvedValue({ user: { id: userId } });
});

afterAll(async () => {
  // Preference rows are removed by the cascade on their users.
  await prisma.user.deleteMany({
    where: { id: { in: [userId, otherUserId] } },
  });
  await prisma.$disconnect();
});

describe("notification preferences with a real database", () => {
  it("reads the defaults while the user has no row", async () => {
    await expect(getNotificationPreferences(userId)).resolves.toEqual({
      productUpdates: false,
      weeklyDigest: false,
    });
  });

  it("creates the row on the first save without letting the client set other fields", async () => {
    const result = await updateNotificationPreferences({
      productUpdates: true,
      weeklyDigest: false,
      securityEmails: false,
      userId: otherUserId,
    });

    expect(result).toEqual({ success: true });

    const row = await prisma.notificationPreference.findUnique({
      where: { userId },
    });
    expect(row).toMatchObject({
      productUpdates: true,
      weeklyDigest: false,
      // Security emails stay on whatever the client sends.
      securityEmails: true,
    });
    await expect(
      prisma.notificationPreference.count({ where: { userId: otherUserId } }),
    ).resolves.toBe(0);
  });

  it("updates the same row on the next save", async () => {
    await updateNotificationPreferences({
      productUpdates: false,
      weeklyDigest: true,
    });

    await expect(getNotificationPreferences(userId)).resolves.toEqual({
      productUpdates: false,
      weeklyDigest: true,
    });
    await expect(
      prisma.notificationPreference.count({ where: { userId } }),
    ).resolves.toBe(1);
  });

  it("leaves other users on the defaults", async () => {
    await expect(getNotificationPreferences(otherUserId)).resolves.toEqual({
      productUpdates: false,
      weeklyDigest: false,
    });
  });
});
