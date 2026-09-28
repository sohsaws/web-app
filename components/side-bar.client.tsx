"use client";

import { Bell, CreditCard, ShieldCheck, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Profile", icon: User },
  { label: "Security", icon: ShieldCheck },
  { label: "Billing", icon: CreditCard },
  { label: "Notifications", icon: Bell },
] as const;

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname.split("/").at(-1)!.toUpperCase());
  const [activeNav, setActiveNav] = useState<string>(
    capitalize(pathname.split("/").at(-1)!),
  );

  const handleClick = (label: string) => {
    setActiveNav(label);
    router.push(`/settings/${label.toLowerCase()}`);
  };

  return (
    <aside className="w-48 shrink-0">
      <nav className="flex flex-col space-y-1">
        {navItems.map(({ label, icon: Icon }) => {
          const active = activeNav === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => handleClick(label)}
              className={`flex cursor-pointer items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                active
                  ? "text-white bg-neutral-900/50 border border-neutral-800"
                  : "text-neutral-500 border border-transparent hover:text-white hover:bg-neutral-900"
              }`}
            >
              <Icon size={18} strokeWidth={1.5} />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
