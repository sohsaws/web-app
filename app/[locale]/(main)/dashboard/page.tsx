import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import type { ReactElement } from "react";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import DashBoard from "./_components/dashboard.server";
import { DashboardFavorites } from "./_components/dashboard-favorites.client";

export default async function Dashboard(): Promise<ReactElement> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect({ href: "/login?reason=unauthorized", locale: await getLocale() });
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-app-bg text-app-fg flex flex-col">
      <DashBoard user={user}>
        <DashboardFavorites userId={user.id} />
      </DashBoard>
    </div>
  );
}
