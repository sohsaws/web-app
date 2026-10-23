"use client";

import type { ReactElement } from "react";
import { UserDropdown } from "@/components/layout/user-dropdown.client";
import { Link } from "@/i18n/navigation";
import { useSession } from "@/lib/auth/auth-client";
import { GuestLanguageSelect } from "./guest-language-select.client";

const authLinkClass =
  "shrink-0 rounded-full bg-white px-[clamp(0.75rem,3vw,1.75rem)] py-1.5 text-app-nav font-semibold tracking-tight text-black transition-colors duration-200 hover:bg-neutral-300";

export function HeaderActions(): ReactElement | null {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return null;
  }

  if (session) {
    return (
      <UserDropdown
        user={{
          image: session.user.image,
          name: session.user.name,
        }}
      />
    );
  }

  return (
    <div className="relative flex items-center gap-2 lg:left-4 xl:left-8 2xl:left-12">
      <GuestLanguageSelect />
      {/* Hidden on narrow screens so the header fits at 360px; the register
          page links to sign-in. */}
      <Link href="/login" className={`${authLinkClass} hidden sm:inline`}>
        Sign In
      </Link>
      <Link href="/register" className={authLinkClass}>
        Sign Up
      </Link>
    </div>
  );
}
