"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useServerErrorMessage } from "@/hooks/i18n/use-server-error-message";
import { updateNotificationPreferences } from "@/lib/actions/notification-preferences.action";
import type {
  NotificationPreferenceKey,
  NotificationPreferences,
} from "@/lib/config/notifications";

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
  const serverErrorMessage = useServerErrorMessage();

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
          toast.error(serverErrorMessage(result.code));
        }
      } catch (error: unknown) {
        // A throw inside an async transition would reach the error boundary.
        console.error("Notification preferences request failed:", error);
        setPreferences(previous);
        toast.error(serverErrorMessage("NOTIFICATIONS_SAVE_FAILED"));
      }
    });
  }

  return { preferences, isSaving, togglePreference };
}
