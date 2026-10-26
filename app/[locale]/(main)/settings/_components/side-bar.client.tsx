"use client";

import { Bell, ShieldCheck, User } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { Link, usePathname } from "@/i18n/navigation";

const navItems = [
  { href: "/settings/profile", labelKey: "profile", icon: User },
  { href: "/settings/security", labelKey: "security", icon: ShieldCheck },
  { href: "/settings/notifications", labelKey: "notifications", icon: Bell },
] as const;

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// The active item is derived from the URL on every render. Keeping it in state
// broke navigation from outside the sidebar (the user dropdown): the settings
// layout does not remount between settings pages, so the state went stale.
export default function SideBar(): ReactElement {
  const pathname = usePathname();
  const t = useTranslations("Settings.nav");

  return (
    <aside className="w-48 shrink-0">
      <nav aria-label={t("label")} className="flex flex-col space-y-1">
        {navItems.map(({ href, labelKey, icon: Icon }) => {
          const isActive = isActivePath(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                isActive
                  ? "text-white bg-neutral-900/50 border border-neutral-800"
                  : "text-neutral-500 border border-transparent hover:text-white hover:bg-neutral-900"
              }`}
            >
              <Icon aria-hidden="true" size={18} strokeWidth={1.5} />
              {t(labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
