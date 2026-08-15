"use client";

import { CircleAlert } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

export default function EmailVerificationWarning(): ReactElement {
  return (
    <Link
      href="/verify-email/pending"
      aria-label="Verify your email address"
      className="inline-flex rounded-full text-amber-600 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
    >
      <CircleAlert aria-hidden="true" size={20} strokeWidth={1.5} />
    </Link>
  );
}
