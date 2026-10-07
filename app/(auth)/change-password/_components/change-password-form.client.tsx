"use client";

import { KeyRound } from "lucide-react";
import type { ReactElement } from "react";
import { useChangePassword } from "@/hooks/use-change-password";

export function ChangePasswordForm(): ReactElement {
  const { form, onSubmit } = useChangePassword();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-white/5 px-8 py-12">
        <KeyRound
          aria-hidden="true"
          size={48}
          strokeWidth={1.5}
          className="text-white"
        />
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold text-white">
            Change your password
          </h1>
          <p className="text-sm text-neutral-500">
            Enter your current password and choose a new one.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="current-password"
              className="block text-xs font-medium text-neutral-500"
            >
              Current password
            </label>
            <input
              id="current-password"
              type="password"
              {...register("currentPassword")}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.currentPassword)}
              aria-describedby={
                errors.currentPassword ? "current-password-error" : undefined
              }
              className="block w-full rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white shadow-sm outline-none transition-colors focus:border-white/20 focus:ring-1 focus:ring-white/20"
            />
            {errors.currentPassword ? (
              <p id="current-password-error" className="text-xs text-red-500">
                {errors.currentPassword.message}
              </p>
            ) : null}
          </div>

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
              className="block w-full rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white shadow-sm outline-none transition-colors focus:border-white/20 focus:ring-1 focus:ring-white/20"
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
              Confirm new password
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
              className="block w-full rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white shadow-sm outline-none transition-colors focus:border-white/20 focus:ring-1 focus:ring-white/20"
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
            className="mt-2 w-full cursor-pointer rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
}
