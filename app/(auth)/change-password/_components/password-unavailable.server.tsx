import { Info } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

export function PasswordUnavailable(): ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-white/5 px-8 py-12 text-center">
        <Info
          aria-hidden="true"
          size={48}
          strokeWidth={1.5}
          className="text-neutral-400"
        />
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-white">
            No password on this account
          </h1>
          <p className="text-sm text-neutral-500">
            Your account uses social sign-in. Use the email recovery flow if you
            want to add a password.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="w-full rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
        >
          Set password by email
        </Link>
      </div>
    </div>
  );
}
