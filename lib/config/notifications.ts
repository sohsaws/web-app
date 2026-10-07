export interface NotificationPreferences {
  productUpdates: boolean;
  weeklyDigest: boolean;
}

export type NotificationPreferenceKey = keyof NotificationPreferences;

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  productUpdates: false,
  weeklyDigest: false,
};
