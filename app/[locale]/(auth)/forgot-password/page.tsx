import { getTranslations } from "next-intl/server";
import type { ReactElement } from "react";
import { TokenStatusCard } from "@/app/[locale]/(auth)/_components/token-status-card.client";
import { Link } from "@/i18n/navigation";
import { ForgotPasswordForm } from "./_components/forgot-password-form.client";
import { ResetPasswordForm } from "./_components/reset-password-form.client";

interface ForgotPasswordPageProps {
  searchParams: Promise<{
    error?: string | string[];
    token?: string | string[];
  }>;
}

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps): Promise<ReactElement> {
  const { error, token } = await searchParams;

  if (error !== undefined) {
    return <TokenStatusCard status="invalid_token" />;
  }

  if (typeof token === "string") {
    return <ResetPasswordForm token={token} />;
  }

  if (token !== undefined) {
    return <TokenStatusCard status="invalid_token" />;
  }

  const t = await getTranslations("Auth.forgotPassword");

  return (
    <div className="flex grow items-center justify-center bg-zinc-950 px-4 py-12 pt-50 sm:px-6 lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div className="text-left">
          <h1 className="font-serif text-2xl font-medium tracking-tight text-white">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">{t("subtitle")}</p>
        </div>

        <ForgotPasswordForm />

        <div className="mt-6 text-center text-xs">
          <Link
            href="/login"
            className="font-medium text-neutral-500 transition-colors hover:text-white"
          >
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
