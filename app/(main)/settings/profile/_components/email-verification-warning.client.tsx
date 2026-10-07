"use client";

import { CircleAlert } from "lucide-react";
import type { ReactElement } from "react";
import { useEmailVerification } from "@/hooks/use-email-verification";

interface EmailVerificationWarningProps {
  email: string;
}

export default function EmailVerificationWarning({
  email,
}: EmailVerificationWarningProps): ReactElement {
  const { isSending, sendVerificationEmail } = useEmailVerification(email);

  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        onClick={sendVerificationEmail}
        disabled={isSending}
        aria-label={
          isSending ? "Sending verification email" : "Verify your email address"
        }
        aria-describedby="email-verification-tooltip"
        aria-busy={isSending}
        className="inline-flex cursor-pointer rounded-full text-amber-600 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 disabled:cursor-wait disabled:opacity-60"
      >
        <CircleAlert
          aria-hidden="true"
          size={20}
          strokeWidth={1.5}
          className={isSending ? "animate-pulse" : undefined}
        />
      </button>
      <span
        id="email-verification-tooltip"
        role="tooltip"
        className="pointer-events-none invisible absolute right-0 bottom-full z-20 mb-2 whitespace-nowrap rounded-md border border-white/10 bg-neutral-900 px-2.5 py-1.5 text-xs text-neutral-200 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        {isSending
          ? "Sending verification email..."
          : "Please, verify your email"}
      </span>
    </span>
  );
}
