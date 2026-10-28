import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { NavigationBar } from "@/components/layout/navigation-bar.client";
import { NotificationsMenu } from "@/components/layout/notifications-menu.client";
import { UserDropdown } from "@/components/layout/user-dropdown.client";
import { Link, redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect({ href: "/login", locale: await getLocale() });
  }

  const t = await getTranslations("Common.appHeader");
  const navigationItems = [
    { href: "/dashboard", label: t("overview") },
    { href: "/dive", label: t("dive") },
    { href: "/for-you", label: t("forYou") },
  ];

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
            ariaLabel={t("navigationLabel")}
            items={navigationItems}
            className="absolute left-1/2 hidden -translate-x-1/2 md:block"
          />

          <div className="flex justify-end w-24 gap-4">
            <NotificationsMenu />
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
