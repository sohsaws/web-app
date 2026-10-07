"use client";

import { KeyRound } from "lucide-react";
import type { ReactElement } from "react";
import { useResetPassword } from "@/hooks/use-reset-password";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({
  token,
}: ResetPasswordFormProps): ReactElement {
  const { form, onSubmit } = useResetPassword(token);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="bg-[#080808] flex items-center justify-center min-h-screen px-4">
      <div className="flex flex-col items-center gap-6 max-w-md rounded-2xl border border-white px-12 py-12">
        <KeyRound
          aria-hidden="true"
          size={48}
          strokeWidth={1.5}
          className="text-white"
        />
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold text-white">Set new password</h1>
          <p className="text-sm text-neutral-500">
            Choose a strong password for your account.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="new-password"
              className="block text-xs font-medium text-neutral-500"
            >
              New password
            </label>
            <input
              id="new-password"
              type="password"
              {...register("newPassword")}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.newPassword)}
              aria-describedby={
                errors.newPassword ? "new-password-error" : undefined
              }
              placeholder="Min. 8 characters"
              className="block w-full rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-white/20 focus:ring-1 focus:ring-white/20 outline-none transition-all"
            />
            {errors.newPassword ? (
              <p id="new-password-error" className="text-xs text-red-500">
                {errors.newPassword.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="block text-xs font-medium text-neutral-500"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              {...register("confirmPassword")}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword ? "confirm-password-error" : undefined
              }
              placeholder="Repeat your password"
              className="block w-full rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-white/20 focus:ring-1 focus:ring-white/20 outline-none transition-all"
            />
            {errors.confirmPassword ? (
              <p id="confirm-password-error" className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? "Saving..." : "Set new password"}
          </button>
        </form>
      </div>
    </div>
  );
}
