import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { auth } from "@/lib/auth";
import { getNotificationPreferences } from "@/lib/data/get-notification-preferences";
import { NotificationSettings } from "./_components/notification-settings.client";

export default async function NotificationsPage(): Promise<ReactElement> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/settings/notifications");
  }

  const preferences = await getNotificationPreferences(session.user.id);

  return (
    <div className="min-w-0 flex-1 px-4 sm:px-10">
      <div className="max-w-3xl space-y-8">
        <div className="mb-10 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Notifications
          </h1>
          <p className="mt-5 text-sm font-normal text-neutral-500">
            Decide what Swiipy may send to {session.user.email}.
          </p>
        </div>

        <NotificationSettings initialPreferences={preferences} />
      </div>
    </div>
  );
}
