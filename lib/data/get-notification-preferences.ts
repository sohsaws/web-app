import "server-only";

import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  type NotificationPreferences,
} from "@/lib/config/notifications";
import prisma from "@/lib/prisma";

// The row is created on the first save, so a missing row means defaults.
export async function getNotificationPreferences(
  userId: string,
): Promise<NotificationPreferences> {
  const preferences = await prisma.notificationPreference.findUnique({
    where: { userId },
    select: { productUpdates: true, weeklyDigest: true },
  });

  return preferences ?? DEFAULT_NOTIFICATION_PREFERENCES;
}
