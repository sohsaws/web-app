import Link from "next/link";
import type { ReactElement } from "react";
import { LoginForm } from "./_components/login-form.client";

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string | string[];
  }>;
}

function getSafeCallbackUrl(value: string | string[] | undefined): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/dashboard";
  }

  return value;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps): Promise<ReactElement> {
  const { callbackUrl } = await searchParams;

  return (
    <div className="bg-zinc-950 grow flex items-center justify-center pt-30 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div className="text-left">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Enter your credentials to access your account
          </p>
        </div>

        <LoginForm callbackUrl={getSafeCallbackUrl(callbackUrl)} />

        <div className="mt-6 text-center text-xs">
          <span className="text-neutral-500">Don&apos;t have an account?</span>
          <Link
            href="/register"
            className="ml-1 font-medium text-white hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
