"use client";

import { AtSign, CheckCircle } from "lucide-react";
import type { ReactElement } from "react";
import { useChangeEmail } from "@/hooks/use-change-email";

interface ChangeEmailFormProps {
  currentEmail: string;
  currentEmailVerified: boolean;
}

export function ChangeEmailForm({
  currentEmail,
  currentEmailVerified,
}: ChangeEmailFormProps): ReactElement {
  const { form, isRequested, onSubmit, requestedEmail } =
    useChangeEmail(currentEmail);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  if (isRequested && requestedEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
        <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-white/5 px-8 py-12 text-center">
          <CheckCircle
            aria-hidden="true"
            size={48}
            strokeWidth={1.5}
            className="text-white"
          />
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-white">
              {currentEmailVerified
                ? "Check your current inbox"
                : "Check your new inbox"}
            </h1>
            <p className="text-sm text-neutral-500">
              {currentEmailVerified ? (
                <>
                  We sent a confirmation link to{" "}
                  <span className="text-white">{currentEmail}</span>. After you
                  approve the request, we will send a verification link to{" "}
                  <span className="text-white">{requestedEmail}</span>.
                </>
              ) : (
                <>
                  We sent a verification link to{" "}
                  <span className="text-white">{requestedEmail}</span>. Your
                  email will change only after verification.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-white/5 px-8 py-12">
        <AtSign
          aria-hidden="true"
          size={48}
          strokeWidth={1.5}
          className="text-white"
        />
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold text-white">
            Change your email
          </h1>
          <p className="text-sm text-neutral-500">
            Enter a new email address. We will verify the change before updating
            your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="new-email"
              className="block text-xs font-medium text-neutral-500"
            >
              New email address
            </label>
            <input
              id="new-email"
              type="email"
              {...register("newEmail")}
              autoComplete="email"
              aria-invalid={Boolean(errors.newEmail)}
              aria-describedby={errors.newEmail ? "new-email-error" : undefined}
              placeholder="you@example.com"
              className="block w-full rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white shadow-sm outline-none transition-colors placeholder:text-neutral-600 focus:border-white/20 focus:ring-1 focus:ring-white/20"
            />
            {errors.newEmail ? (
              <p id="new-email-error" className="text-xs text-red-500">
                {errors.newEmail.message}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full cursor-pointer rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
