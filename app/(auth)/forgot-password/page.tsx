"use client";

import Link from "next/link";

export default function ForgotPassword() {
  return (
    <div className="bg-zinc-950 grow flex min-h-screen items-center justify-center px-6">
      <div className="flex max-w-2xl flex-col items-center text-center gap-6">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-white tracking-tight">
          Email sent to reset your password
        </h1>
        <p className="text-sm md:text-base text-neutral-500 leading-relaxed">
          Link with verification has been sent. Please check your email and follow the
          instructions to reset your password.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}