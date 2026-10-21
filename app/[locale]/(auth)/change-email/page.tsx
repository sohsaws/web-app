import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import type { ReactElement } from "react";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { ChangeEmailForm } from "./_components/change-email-form.client";

export default async function ChangeEmailPage(): Promise<ReactElement> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect({
      href: "/login?callbackUrl=/change-email",
      locale: await getLocale(),
    });
  }

  return (
    <ChangeEmailForm
      currentEmail={session.user.email}
      currentEmailVerified={session.user.emailVerified}
    />
  );
}
