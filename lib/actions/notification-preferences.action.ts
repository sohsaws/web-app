"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { ActionFailure } from "@/lib/config/action-errors";
import { isNotificationPreferences } from "@/lib/config/notifications";
import prisma from "@/lib/prisma";

export type UpdateNotificationPreferencesResult =
  | { success: true }
  | ActionFailure;

export async function updateNotificationPreferences(
  input: unknown,
): Promise<UpdateNotificationPreferencesResult> {
  if (!isNotificationPreferences(input)) {
    return { success: false, code: "INVALID_NOTIFICATION_SETTINGS" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      code: "NOT_SIGNED_IN",
    };
  }

  // Built field by field, never spread from input: extra keys such as
  // securityEmails or userId must not reach the database.
  const data = {
    productUpdates: input.productUpdates,
    weeklyDigest: input.weeklyDigest,
  };

  try {
    await prisma.notificationPreference.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, ...data },
      update: data,
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Notification preferences update failed:", error);
    return { success: false, code: "NOTIFICATIONS_SAVE_FAILED" };
  }
}
