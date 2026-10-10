"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isNotificationPreferences } from "@/lib/config/notifications";
import prisma from "@/lib/prisma";

export type UpdateNotificationPreferencesResult =
  | { success: true }
  | { success: false; message: string };

export async function updateNotificationPreferences(
  input: unknown,
): Promise<UpdateNotificationPreferencesResult> {
  if (!isNotificationPreferences(input)) {
    return { success: false, message: "Invalid notification settings" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "You must be signed in to change notifications",
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
    return { success: false, message: "Unable to save notification settings" };
  }
}
