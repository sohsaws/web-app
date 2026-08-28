"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { ReactElement } from "react";
import { Avatar } from "@/components/avatar.client";
import { DropdownMenu } from "@/components/layout/dropdown-menu.client";
import { useSignOut } from "@/hooks/use-sign-out";

interface UserDropdownProps {
  user: {
    image?: string | null;
    name: string;
  };
}

interface AvatarMenuTriggerProps {
  image?: string | null;
  name: string;
  isOpen: boolean;
}

const avatarArcPaths = [
  "M 20 1 A 19 19 0 0 1 39 20",
  "M 20 1 A 19 19 0 0 0 1 20",
  "M 20 39 A 19 19 0 0 0 39 20",
  "M 20 39 A 19 19 0 0 1 1 20",
] as const;

const arcVariants = {
  hidden: {
    opacity: 0,
    pathLength: 0,
  },
  visible: {
    opacity: 1,
    pathLength: 1,
  },
};

const itemClassName =
  "block w-full cursor-pointer rounded-md px-3 py-2 text-center text-sm text-white transition-[background-color,text-shadow] hover:bg-app-glow/70 hover:[text-shadow:0_0_10px_var(--color-app-fg)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50";

function AvatarMenuTrigger({
  image,
  name,
  isOpen,
}: AvatarMenuTriggerProps): ReactElement {
  return (
    <motion.span
      initial={false}
      animate={isOpen ? "visible" : "hidden"}
      whileHover="visible"
      className="relative block size-10"
    >
      <Avatar image={image} name={name} />

      <motion.svg
        viewBox="0 0 40 40"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
      >
        {avatarArcPaths.map((path) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            variants={arcVariants}
            transition={{
              duration: 0.35,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.svg>
    </motion.span>
  );
}

export function UserDropdown({ user }: UserDropdownProps): ReactElement {
  const { isPending, signOut } = useSignOut();

  return (
    <DropdownMenu
      renderTrigger={({ isOpen }) => (
        <AvatarMenuTrigger
          image={user.image}
          name={user.name}
          isOpen={isOpen}
        />
      )}
      triggerLabel={`Open menu for ${user.name}`}
    >
      <nav aria-label="User menu">
        <ul>
          <li>
            <Link href="/settings/profile" className={itemClassName}>
              Profile
            </Link>
          </li>
          <li>
            <Link href="/settings/security" className={itemClassName}>
              Security
            </Link>
          </li>
          <li>
            <button
              type="button"
              disabled={isPending}
              onClick={signOut}
              className={itemClassName}
            >
              {isPending ? "Signing out..." : "Log out"}
            </button>
          </li>
        </ul>
      </nav>
    </DropdownMenu>
  );
}
