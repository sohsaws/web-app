import Link from "next/link";
import type { ReactElement } from "react";
import { TokenStatusCard } from "@/components/token-status-card";
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

  return (
    <div className="flex grow items-center justify-center bg-zinc-950 px-4 py-12 pt-50 sm:px-6 lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div className="text-left">
          <h1 className="font-serif text-2xl font-medium tracking-tight text-white">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Enter your email address and we will send you a reset link.
          </p>
        </div>

        <ForgotPasswordForm />

        <div className="mt-6 text-center text-xs">
          <Link
            href="/login"
            className="font-medium text-neutral-500 transition-colors hover:text-white"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
