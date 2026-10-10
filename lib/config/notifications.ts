export interface NotificationPreferences {
  productUpdates: boolean;
  weeklyDigest: boolean;
}

export type NotificationPreferenceKey = keyof NotificationPreferences;

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  productUpdates: false,
  weeklyDigest: false,
};

// A server action is a public endpoint: anyone can call it with any payload,
// and the TypeScript interface does not exist at runtime. This check keeps the
// input to exactly two booleans.
export function isNotificationPreferences(
  value: unknown,
): value is NotificationPreferences {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const fields = new Map(Object.entries(value));
  return (
    typeof fields.get("productUpdates") === "boolean" &&
    typeof fields.get("weeklyDigest") === "boolean"
  );
}
