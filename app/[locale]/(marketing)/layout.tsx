import { getTranslations } from "next-intl/server";
import { NavigationBar } from "@/components/layout/navigation-bar.client";
import { Link } from "@/i18n/navigation";
import { HeaderActions } from "./_components/header-actions.client";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = await getTranslations("Marketing");
  const navigationItems = [
    { href: "/about", label: t("header.about") },
    { href: "/contact", label: t("header.contact") },
  ] as const;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="fixed top-0 z-50 h-15 w-app-screen-width border-b border-white/5 bg-app-bg">
        <div className="relative mx-auto flex h-app-full max-w-app-shell items-center justify-between gap-[clamp(0.125rem,2vw,2rem)] px-[clamp(0.375rem,4vw,3rem)]">
          <Link
            href="/"
            className="shrink-0 pb-1 font-serif text-[clamp(1.25rem,5vw,1.875rem)] text-white tracking-tight"
          >
            Swiipy
          </Link>

          <NavigationBar
            ariaLabel={t("header.navigationLabel")}
            items={navigationItems}
            className="absolute left-1/2 -translate-x-1/2"
          />
          <HeaderActions />
        </div>
      </header>

      <div className="flex flex-1 flex-col pt-app-nav-height">
        <div className="relative z-10 flex flex-1 flex-col bg-app-bg">
          {children}
        </div>

        <footer className="relative z-10 shrink-0 border-t border-white/5 bg-app-bg py-3">
          <div className="relative mx-auto flex max-w-app-shell items-center justify-center px-app-nav-x">
            <nav
              className="flex items-center gap-10 text-app-footer-link text-neutral-500"
              aria-label={t("footer.navigationLabel")}
            >
              <Link href="#" className="transition-colors hover:text-white">
                {t("footer.privacy")}
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                {t("footer.terms")}
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                Telegram
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                GitHub
              </Link>
            </nav>

            <p className="absolute right-9 text-app-nav leading-none text-neutral-600">
              © 2026 Swiipy.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
