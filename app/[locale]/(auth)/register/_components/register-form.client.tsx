"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Lock, Mail, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactElement, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { GoogleAuthButton } from "@/app/[locale]/(auth)/_components/google-sign-button.client";
import { useAuthErrorMessage } from "@/hooks/i18n/use-auth-error-message";
import { useValidationMessage } from "@/hooks/i18n/use-validation-message";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth/auth-client";
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "@/lib/config/auth";
import { PROFILE_NAME_MAX_LENGTH } from "@/lib/config/profile";

// Messages are keys of the Validation namespace; the shared limits fill their
// {min}/{max} placeholders when the error is shown.
const userSchema = z
  .object({
    name: z
      .string({ error: "nameRequired" })
      .min(1, "nameRequired")
      .max(PROFILE_NAME_MAX_LENGTH, "nameTooLong"),
    username: z
      .string({ error: "usernameRequired" })
      .min(USERNAME_MIN_LENGTH, "usernameTooShort")
      .max(USERNAME_MAX_LENGTH, "usernameTooLong")
      .regex(/^[a-z0-9_]+$/i, "usernameInvalidCharacters"),
    email: z
      .email("emailInvalid")
      .min(1, "emailRequired")
      .max(EMAIL_MAX_LENGTH, "emailTooLong"),
    password: z
      .string({ error: "passwordRequired" })
      .min(PASSWORD_MIN_LENGTH, "passwordTooShort")
      .max(PASSWORD_MAX_LENGTH, "passwordTooLong"),
    passwordConfirm: z
      .string({ error: "passwordConfirmRequired" })
      .min(1, "passwordConfirmRequired"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "passwordsDoNotMatch",
  });

type registerForm = z.infer<typeof userSchema>;

export function RegisterForm(): ReactElement {
  const t = useTranslations("Auth");
  const validationMessage = useValidationMessage();
  const authErrorMessage = useAuthErrorMessage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerForm>({
    resolver: zodResolver(userSchema),
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const router = useRouter();

  const onSubmitHandler: SubmitHandler<registerForm> = async (Data) => {
    try {
      setSubmitting(true);

      const { error } = await authClient.signUp.email(
        {
          name: Data.name,
          username: Data.username,
          password: Data.password,
          email: Data.email,
          callbackURL: "/dashboard",
        },
        {
          onError: (ctx) => {
            console.error(JSON.stringify(ctx.error, null, 2));
            setError(authErrorMessage(ctx.error, t("register.failed")));
          },
          onSuccess: () => {
            router.push("/dashboard");
          },
        },
      );

      if (error) {
        setError(authErrorMessage(error, t("register.failed")));
        console.error(JSON.stringify(error, null, 2));
      }
    } catch (error) {
      console.error(error);
      setError(authErrorMessage(null, t("register.failed")));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="grid gap-3">
        <GoogleAuthButton />
      </div>

      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-neutral-800"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-2 text-neutral-600">
            {t("google.continueWith")}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitHandler)} className="mt-6 space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="name"
            className="block text-xs font-medium text-neutral-400"
          >
            {t("register.nameLabel")}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="text-neutral-600" size={18} strokeWidth={1.5} />
            </div>
            <input
              id="name"
              {...register("name")}
              className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
              placeholder={t("register.namePlaceholder")}
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs mt-2">
              {validationMessage(errors.name.message, {
                max: PROFILE_NAME_MAX_LENGTH,
              })}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="username"
            className="block text-xs font-medium text-neutral-400"
          >
            {t("register.usernameLabel")}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <AtSign
                className="text-neutral-600"
                size={18}
                strokeWidth={1.5}
              />
            </div>
            <input
              {...register("username")}
              id="username"
              type="text"
              className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
              placeholder={t("register.usernamePlaceholder")}
            />
          </div>
          {errors.username && (
            <p className="text-red-500 text-xs mt-2">
              {validationMessage(errors.username.message, {
                min: USERNAME_MIN_LENGTH,
                max: USERNAME_MAX_LENGTH,
              })}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-xs font-medium text-neutral-400"
          >
            {t("register.emailLabel")}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="text-neutral-600" size={18} strokeWidth={1.5} />
            </div>
            <input
              id="email"
              {...register("email")}
              type="email"
              className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
              placeholder="name@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-2">
              {validationMessage(errors.email.message, {
                max: EMAIL_MAX_LENGTH,
              })}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-neutral-400"
          >
            {t("register.passwordLabel")}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="text-neutral-600" size={18} strokeWidth={1.5} />
            </div>
            <input
              id="password"
              {...register("password")}
              type="password"
              className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-2">
              {validationMessage(errors.password.message, {
                min: PASSWORD_MIN_LENGTH,
                max: PASSWORD_MAX_LENGTH,
              })}
            </p>
          )}

          <label
            htmlFor="passwordConfirm"
            className="block text-xs font-medium mt-5 text-neutral-400"
          >
            {t("register.passwordConfirmLabel")}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="text-neutral-600" size={18} strokeWidth={1.5} />
            </div>
            <input
              id="passwordConfirm"
              {...register("passwordConfirm")}
              type="password"
              className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
              placeholder="••••••••"
            />
          </div>
          {errors.passwordConfirm && (
            <p className="text-red-500 text-xs mt-2">
              {validationMessage(errors.passwordConfirm.message)}
            </p>
          )}

          <div className="flex gap-1 pt-1">
            <div className="h-1 flex-1 rounded-full bg-neutral-800"></div>
            <div className="h-1 flex-1 rounded-full bg-neutral-800"></div>
            <div className="h-1 flex-1 rounded-full bg-neutral-800"></div>
            <div className="h-1 flex-1 rounded-full bg-neutral-800"></div>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-white focus:ring-white focus:ring-offset-0 cursor-pointer accent-white"
            />
          </div>
          <div className="ml-2 text-xs">
            <label htmlFor="terms" className="font-normal text-neutral-500">
              {t.rich("register.termsAgreement", {
                terms: (chunks) => (
                  <Link
                    href="#"
                    className="font-medium text-white hover:underline"
                  >
                    {chunks}
                  </Link>
                ),
                privacy: (chunks) => (
                  <Link
                    href="#"
                    className="font-medium text-white hover:underline"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            onClick={(event: React.FormEvent) => {
              if (!termsAccepted) {
                setError(t("register.termsRequired"));
                event.preventDefault();
              }
            }}
            disabled={submitting}
            style={{ backgroundColor: submitting ? "#171717" : "white" }}
            className="flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all"
          >
            {t("register.submit")}
          </button>
        </div>

        {error ? (
          <p className="flex items-center justify-center text-sm text-red-500">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}
