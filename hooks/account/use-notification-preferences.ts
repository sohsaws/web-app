"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateNotificationPreferences } from "@/lib/actions/notification-preferences.action";
import type {
  NotificationPreferenceKey,
  NotificationPreferences,
} from "@/lib/config/notifications";

const SAVE_ERROR_MESSAGE = "Unable to save notification settings";

interface UseNotificationPreferencesResult {
  preferences: NotificationPreferences;
  isSaving: boolean;
  togglePreference: (key: NotificationPreferenceKey) => void;
}

export function useNotificationPreferences(
  initialPreferences: NotificationPreferences,
): UseNotificationPreferencesResult {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [isSaving, startTransition] = useTransition();

  function togglePreference(key: NotificationPreferenceKey): void {
    const previous = preferences;
    const next = { ...preferences, [key]: !preferences[key] };

    // Set outside the transition so the switch flips instantly; an update
    // inside it would wait for the server. Roll back on failure.
    setPreferences(next);
    startTransition(async () => {
      try {
        const result = await updateNotificationPreferences(next);

        if (!result.success) {
          setPreferences(previous);
          toast.error(result.message);
        }
      } catch (error: unknown) {
        // A throw inside an async transition would reach the error boundary.
        console.error("Notification preferences request failed:", error);
        setPreferences(previous);
        toast.error(SAVE_ERROR_MESSAGE);
      }
    });
  }

  return { preferences, isSaving, togglePreference };
}
