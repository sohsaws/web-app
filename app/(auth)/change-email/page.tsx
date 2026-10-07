import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { auth } from "@/lib/auth";
import { ChangeEmailForm } from "./_components/change-email-form.client";

export default async function ChangeEmailPage(): Promise<ReactElement> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/change-email");
  }

  return (
    <ChangeEmailForm
      currentEmail={session.user.email}
      currentEmailVerified={session.user.emailVerified}
    />
  );
}
