"use client";

import type { LucideIcon } from "lucide-react";
import { Mail, Megaphone, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { useNotificationPreferences } from "@/hooks/account/use-notification-preferences";
import type {
  NotificationPreferenceKey,
  NotificationPreferences,
} from "@/lib/config/notifications";
import { NotificationSwitch } from "./notification-switch.client";

// The row text lives in messages under Settings.notifications.<key>.
interface PreferenceRow {
  key: NotificationPreferenceKey;
  icon: LucideIcon;
}

const preferenceRows: readonly PreferenceRow[] = [
  { key: "productUpdates", icon: Megaphone },
  { key: "weeklyDigest", icon: Mail },
];

interface NotificationSettingsProps {
  initialPreferences: NotificationPreferences;
}

export function NotificationSettings({
  initialPreferences,
}: NotificationSettingsProps): ReactElement {
  const t = useTranslations("Settings.notifications");
  const { preferences, isSaving, togglePreference } =
    useNotificationPreferences(initialPreferences);

  return (
    <section className="app-settings-card border-white/5">
      <div className="border-b border-white/5 p-6">
        <h2 className="mb-1 text-sm font-medium text-white">
          {t("emailTitle")}
        </h2>
        <p className="text-xs text-neutral-500">{t("emailDescription")}</p>
      </div>

      <ul className="divide-y divide-white/5">
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
                {t("securityEmails.title")}
                <span className="rounded-full border border-white/5 bg-neutral-800/80 px-2 py-0.5 text-xs font-medium text-neutral-400">
                  {t("alwaysOn")}
                </span>
              </h3>
              <p
                id="notification-securityEmails-description"
                className="mt-1 text-xs leading-relaxed text-neutral-500"
              >
                {t("securityEmails.description")}
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

        {preferenceRows.map(({ key, icon: Icon }) => (
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
                  {t(`${key}.title`)}
                </h3>
                <p
                  id={`notification-${key}-description`}
                  className="mt-1 text-xs leading-relaxed text-neutral-500"
                >
                  {t(`${key}.description`)}
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

      <div className="border-t border-white/5 px-6 py-4">
        <p className="text-xs text-neutral-500">{t("optionalHint")}</p>
      </div>
    </section>
  );
}
