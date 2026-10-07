"use client";

import type { LucideIcon } from "lucide-react";
import { Mail, Megaphone, ShieldCheck } from "lucide-react";
import type { ReactElement } from "react";
import { useNotificationPreferences } from "@/hooks/use-notification-preferences";
import type {
  NotificationPreferenceKey,
  NotificationPreferences,
} from "@/lib/config/notifications";
import { NotificationSwitch } from "./notification-switch.client";

interface PreferenceRow {
  key: NotificationPreferenceKey;
  title: string;
  description: string;
  icon: LucideIcon;
}

const preferenceRows: readonly PreferenceRow[] = [
  {
    key: "productUpdates",
    title: "Product updates",
    description:
      "News about new features, like personalized picks in For you. Sent rarely.",
    icon: Megaphone,
  },
  {
    key: "weeklyDigest",
    title: "Weekly digest",
    description:
      "A short weekly summary of the ideas you saved and a nudge to swipe a fresh deck.",
    icon: Mail,
  },
];

interface NotificationSettingsProps {
  initialPreferences: NotificationPreferences;
}

export function NotificationSettings({
  initialPreferences,
}: NotificationSettingsProps): ReactElement {
  const { preferences, isSaving, togglePreference } =
    useNotificationPreferences(initialPreferences);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900/30 shadow-lg shadow-black/20 backdrop-blur-md">
      <div className="border-b border-white/10 px-6 py-5">
        <h2 className="text-base font-medium text-white">Email</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Choose which emails Swiipy sends you.
        </p>
      </div>

      <ul className="divide-y divide-white/10">
        <li className="flex items-center justify-between gap-6 px-6 py-5">
          <div className="flex min-w-0 items-start gap-3">
            <ShieldCheck
              aria-hidden="true"
              size={18}
              strokeWidth={1.5}
              className="mt-0.5 shrink-0 text-neutral-400"
            />
            <div className="min-w-0">
              <h3
                id="notification-securityEmails-label"
                className="flex flex-wrap items-center gap-2 text-sm font-medium text-white"
              >
                Security emails
                <span className="rounded-full border border-white/5 bg-neutral-800/80 px-2 py-0.5 text-xs font-medium text-neutral-400">
                  Always on
                </span>
              </h3>
              <p
                id="notification-securityEmails-description"
                className="mt-1 text-sm leading-relaxed text-neutral-400"
              >
                Password resets, email changes and verification links. They keep
                your account safe, so they cannot be turned off.
              </p>
            </div>
          </div>
          <NotificationSwitch
            checked
            disabled
            labelId="notification-securityEmails-label"
            descriptionId="notification-securityEmails-description"
          />
        </li>

        {preferenceRows.map(({ key, title, description, icon: Icon }) => (
          <li
            key={key}
            className="flex items-center justify-between gap-6 px-6 py-5"
          >
            <div className="flex min-w-0 items-start gap-3">
              <Icon
                aria-hidden="true"
                size={18}
                strokeWidth={1.5}
                className="mt-0.5 shrink-0 text-neutral-400"
              />
              <div className="min-w-0">
                <h3
                  id={`notification-${key}-label`}
                  className="text-sm font-medium text-white"
                >
                  {title}
                </h3>
                <p
                  id={`notification-${key}-description`}
                  className="mt-1 text-sm leading-relaxed text-neutral-400"
                >
                  {description}
                </p>
              </div>
            </div>
            <NotificationSwitch
              checked={preferences[key]}
              disabled={isSaving}
              labelId={`notification-${key}-label`}
              descriptionId={`notification-${key}-description`}
              onToggle={(): void => togglePreference(key)}
            />
          </li>
        ))}
      </ul>

      <div className="border-t border-white/10 bg-white/2 px-6 py-4">
        <p className="text-xs text-neutral-500">
          Optional emails are only sent if you turn them on.
        </p>
      </div>
    </div>
  );
}
