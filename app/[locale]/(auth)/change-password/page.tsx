import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import type { ReactElement } from "react";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { ChangePasswordForm } from "./_components/change-password-form.client";
import { PasswordUnavailable } from "./_components/password-unavailable.server";

export default async function ChangePasswordPage(): Promise<ReactElement> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect({
      href: "/login?callbackUrl=/change-password",
      locale: await getLocale(),
    });
  }

  const accounts = await auth.api.listUserAccounts({
    headers: requestHeaders,
  });
  const hasCredentialAccount = accounts.some(({ providerId }) => {
    return providerId === "credential";
  });

  if (!hasCredentialAccount) {
    return <PasswordUnavailable />;
  }

  return <ChangePasswordForm />;
}
