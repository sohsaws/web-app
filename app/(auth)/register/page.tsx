import Link from "next/link";
import type { ReactElement } from "react";
import { RegisterForm } from "./_components/register-form.client";

export default function RegisterPage(): ReactElement {
  return (
    <div className="bg-zinc-950 grow flex items-center justify-center pt-25 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div className="text-left">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-white">
            Let&apos;s create your account
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Enter your details below to create your account
          </p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center text-xs">
          <span className="text-neutral-500">Already have an account?</span>
          <Link
            href="/login"
            className="font-medium text-white hover:underline ml-1"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
