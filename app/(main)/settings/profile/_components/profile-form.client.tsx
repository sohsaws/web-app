"use client";

import { Save } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import { useProfileForm } from "@/hooks/use-profile-form";
import {
  PROFILE_BIO_MAX_LENGTH,
  type ProfileFormValues,
} from "@/lib/entities/profile";
import EmailVerificationWarning from "./email-verification-warning.client";

interface ProfileFormProps {
  defaultValues: ProfileFormValues;
  email: string;
  emailVerified: boolean;
}

export default function ProfileForm({
  defaultValues,
  email,
  emailVerified,
}: ProfileFormProps): ReactElement {
  const { form, onSubmit, resetForm } = useProfileForm(defaultValues);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = form;

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-xs font-medium text-neutral-500"
          >
            Name
          </label>
          <input
            id="name"
            {...register("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            placeholder="Your name"
            className="block w-full min-w-0 rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white shadow-sm outline-none transition-colors placeholder:text-neutral-600 focus:border-white/20 focus:ring-1 focus:ring-white/20"
          />
          {errors.name ? (
            <p id="name-error" className="text-xs text-red-500">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="email"
              className="text-xs font-medium text-neutral-500"
            >
              Email
            </label>
            {!emailVerified ? <EmailVerificationWarning email={email} /> : null}
          </div>
          <input
            id="email"
            value={email}
            readOnly
            className={`block w-full rounded-md border px-3 py-2 text-sm text-neutral-400 shadow-sm outline-none ${
              emailVerified ? "border-neutral-800" : "border-amber-600"
            }`}
          />
          <div className="flex justify-end">
            <Link
              href="/change-email/pending"
              className="text-xs text-blue-400 transition-colors hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Change my email address
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="bio"
          className="block text-xs font-medium text-neutral-500"
        >
          Bio
        </label>
        <textarea
          id="bio"
          {...register("bio")}
          aria-invalid={Boolean(errors.bio)}
          aria-describedby={errors.bio ? "bio-error" : "bio-description"}
          rows={4}
          placeholder="Write something about yourself…"
          maxLength={PROFILE_BIO_MAX_LENGTH}
          className="block w-full resize-none rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white shadow-sm outline-none transition-colors placeholder:text-neutral-600 focus:border-white/20 focus:ring-1 focus:ring-white/20"
        />
        <div
          id="bio-description"
          className="flex justify-between pl-2 text-xs text-neutral-600"
        >
          <span>Write a short introduction.</span>
          <span>
            {watch("bio").length}/{PROFILE_BIO_MAX_LENGTH}
          </span>
        </div>
        {errors.bio ? (
          <p id="bio-error" className="text-xs text-red-500">
            {errors.bio.message}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={resetForm}
          disabled={!isDirty || isSubmitting}
          className="cursor-pointer px-4 py-2 text-sm font-medium text-neutral-500 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-medium text-black shadow-sm outline-none transition-colors hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save aria-hidden="true" size={16} strokeWidth={1.5} />
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
