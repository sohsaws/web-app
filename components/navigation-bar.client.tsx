"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";

interface NavigationItem {
  href: string;
  label: string;
}

interface NavigationBarProps {
  ariaLabel: string;
  className?: string;
  items: readonly NavigationItem[];
}

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "#") {
    return false;
  }

  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavigationBar({
  ariaLabel,
  className = "",
  items,
}: NavigationBarProps): ReactElement {
  const pathname = usePathname();

  return (
    <nav
      aria-label={ariaLabel}
      className={`w-[clamp(11.25rem,42vw,27.75rem)] min-w-45 overflow-hidden rounded-full border border-white/10 bg-neutral-900/60 shadow-3xl shadow-black/50 backdrop-blur-md ${className}`}
    >
      <ul className="flex items-stretch">
        {items.map((item) => {
          const isActive = isActiveRoute(pathname, item.href);

          return (
            <li key={item.label} className="flex min-w-0 flex-1">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-w-0 flex-1 items-center justify-center px-[clamp(0.5rem,2.5vw,2.5rem)] py-1.5 text-app-nav 
                  font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 
                  focus-visible:ring-inset focus-visible:ring-white 
                  ${
                    isActive
                    ? "bg-white/10 text-white"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
