"use client";

import { AtSign, Lock } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import { GoogleAuthButton } from "@/components/GoogleSignButton";
import { useLoginForm } from "@/hooks/use-login-form";

interface LoginFormProps {
  callbackUrl: string;
}

export function LoginForm({ callbackUrl }: LoginFormProps): ReactElement {
  const { error, form, onSubmit } = useLoginForm(callbackUrl);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="mt-8">
      <div className="grid gap-2">
        <GoogleAuthButton callbackUrl={callbackUrl} />
      </div>

      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-neutral-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-2 text-neutral-600">
            Or continue with
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="identifier"
            className="block text-xs font-medium text-neutral-400"
          >
            Email address or Username
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
              id="identifier"
              type="text"
              {...register("identifier")}
              autoComplete="username"
              className="block h-10 w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pr-3 pl-10 text-sm text-white placeholder-neutral-600 shadow-sm transition-colors focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 focus:outline-none"
              placeholder="Email or username"
            />
          </div>
          {errors.identifier ? (
            <p className="mt-2 text-xs text-red-500">
              {errors.identifier.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-neutral-400"
          >
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="text-neutral-600" size={18} strokeWidth={1.5} />
            </div>
            <input
              id="password"
              type="password"
              {...register("password")}
              autoComplete="current-password"
              className="block h-10 w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pr-3 pl-10 text-sm text-white placeholder-neutral-600 shadow-sm transition-colors focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          {errors.password ? (
            <p className="mt-2 text-xs text-red-500">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs">
            <Link
              href="/forgot-password"
              className="font-medium text-neutral-500 transition-colors hover:text-white"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition-all hover:bg-neutral-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900"
        >
          {isSubmitting ? "Loading..." : "Log in"}
        </button>

        {error ? (
          <p className="flex items-center justify-center text-sm text-red-500">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}
