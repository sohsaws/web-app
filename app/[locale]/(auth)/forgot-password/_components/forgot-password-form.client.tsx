"use client";

import { AtSign, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { useForgotPassword } from "@/hooks/auth/use-forgot-password";
import { useValidationMessage } from "@/hooks/i18n/use-validation-message";
import { EMAIL_MAX_LENGTH } from "@/lib/config/auth";

export function ForgotPasswordForm(): ReactElement {
  const t = useTranslations("Auth.forgotPassword");
  const validationMessage = useValidationMessage();
  const { form, onSubmit, requestedEmail } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  if (requestedEmail) {
    return (
      <div
        aria-live="polite"
        className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-white/5 px-6 py-8 text-center"
      >
        <CheckCircle
          aria-hidden="true"
          className="text-white"
          size={40}
          strokeWidth={1.5}
        />
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-white">
            {t("checkInboxTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-neutral-500">
            {t.rich("checkInboxDescription", {
              email: requestedEmail,
              highlight: (chunks) => (
                <span className="text-neutral-300">{chunks}</span>
              ),
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-xs font-medium text-neutral-400"
        >
          {t("emailLabel")}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <AtSign
              aria-hidden="true"
              className="text-neutral-600"
              size={18}
              strokeWidth={1.5}
            />
          </div>
          <input
            id="email"
            type="email"
            {...register("email")}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="block h-10 w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pr-3 pl-10 text-sm text-white placeholder-neutral-600 shadow-sm transition-colors focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 focus:outline-none"
            placeholder="name@example.com"
          />
        </div>
        {errors.email ? (
          <p id="email-error" className="mt-2 text-xs text-red-500">
            {validationMessage(errors.email.message, {
              max: EMAIL_MAX_LENGTH,
            })}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition-all hover:bg-neutral-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900"
      >
        {isSubmitting ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
