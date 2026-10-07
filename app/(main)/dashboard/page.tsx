import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { auth } from "@/lib/auth";
import DashBoard from "./_components/dashboard.server";
import { DashboardFavorites } from "./_components/dashboard-favorites.client";

export default async function Dashboard(): Promise<ReactElement> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?reason=unauthorized");
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
