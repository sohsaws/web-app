"use client";

import { type ReactElement, useId, useState } from "react";
import {
  DELETE_ACCOUNT_CONFIRMATION,
  useDeleteAccount,
} from "@/hooks/use-delete-account";

interface DeleteAccountProps {
  requiresPassword: boolean;
}

const inputClassName =
  "w-full sm:w-80 rounded-lg border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-red-500/40 focus:ring-1 focus:ring-red-500/40";

export function DeleteAccount({
  requiresPassword,
}: DeleteAccountProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const formId = useId();
  const {
    form: {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
    },
    onSubmit,
  } = useDeleteAccount(requiresPassword);

  function closeForm(): void {
    reset();
    setIsOpen(false);
  }

  // Renders the panel's footer itself so the trigger sits on the right of the
  // "Danger Zone" label, while the confirmation form opens above the footer.
  return (
    <>
      {isOpen ? (
        <form
          id={formId}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 px-6 pb-6"
        >
          <div className="space-y-1.5">
            <label
              htmlFor={`${formId}-confirmation`}
              className="block text-xs font-medium text-neutral-400"
            >
              Type {DELETE_ACCOUNT_CONFIRMATION} to confirm
            </label>
            <input
              id={`${formId}-confirmation`}
              {...register("confirmation")}
              autoComplete="off"
              aria-invalid={Boolean(errors.confirmation)}
              aria-describedby={
                errors.confirmation ? `${formId}-confirmation-error` : undefined
              }
              placeholder={DELETE_ACCOUNT_CONFIRMATION}
              className={inputClassName}
            />
            {errors.confirmation ? (
              <p
                id={`${formId}-confirmation-error`}
                className="text-xs text-red-400"
              >
                {errors.confirmation.message}
              </p>
            ) : null}
          </div>

          {requiresPassword ? (
            <div className="space-y-1.5">
              <label
                htmlFor={`${formId}-password`}
                className="block text-xs font-medium text-neutral-400"
              >
                Password
              </label>
              <input
                id={`${formId}-password`}
                type="password"
                {...register("password")}
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? `${formId}-password-error` : undefined
                }
                className={inputClassName}
              />
              {errors.password ? (
                <p
                  id={`${formId}-password-error`}
                  className="text-xs text-red-400"
                >
                  {errors.password.message}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="max-w-xl text-xs leading-5 text-neutral-500">
              You signed in with Google, so no password is needed. If your last
              sign-in was more than a day ago, we will ask you to sign in again.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Deleting..." : "Delete my account permanently"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              disabled={isSubmitting}
              className="cursor-pointer px-3 py-2 text-sm font-medium text-neutral-500 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="flex items-center justify-between gap-4 border-t border-red-500/10 bg-red-500/2 px-6 py-4">
        <p className="text-xs font-medium tracking-wide text-red-500/60 uppercase">
          Danger Zone
        </p>
        {isOpen ? null : (
          <button
            type="button"
            aria-expanded={false}
            aria-controls={formId}
            onClick={(): void => setIsOpen(true)}
            className="shrink-0 cursor-pointer rounded-lg border border-red-500/30 px-4 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            Delete account
          </button>
        )}
      </div>
    </>
  );
}
