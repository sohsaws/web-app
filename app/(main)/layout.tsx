import { BellRing } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { NavigationBar } from "@/components/navigation-bar.client";
import { UserDropdown } from "@/components/user-dropdown.client";
import { auth } from "@/lib/auth";

const navigationItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "#", label: "Dive" },
  { href: "#", label: "Explore" },
] as const;

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <header className="fixed top-0 z-50 h-15 w-full border-b border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link
            href="/"
            className="flex text-3xl font-serif text-white tracking-tight"
          >
            Swiipy
          </Link>

          <NavigationBar
            ariaLabel="Application navigation"
            items={navigationItems}
            className="absolute left-1/2 hidden -translate-x-1/2 md:block"
          />

          <div className="flex justify-end w-24 gap-7">
            <button className="text-neutral-500 hover:text-white transition-colors cursor-pointer">
              <BellRing className="w-6 h-6" />
            </button>
            <UserDropdown
              user={{
                image: session.user.image,
                name: session.user.name,
              }}
            />
          </div>
        </div>
      </header>

      <div>{children}</div>
    </>
  );
}
