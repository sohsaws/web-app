import { getTranslations } from "next-intl/server";
import type { ReactElement, ReactNode } from "react";
import type { AuthUser } from "@/lib/auth/types";

export default async function DashBoard({
  user,
  children,
}: {
  user: AuthUser;
  children: ReactNode;
}): Promise<ReactElement> {
  const t = await getTranslations("Dashboard");

  return (
    <main className="relative z-10 pt-32 pb-20 max-w-7xl mx-auto px-6 w-full space-y-12">
      <header>
        <h1 className="wrap-anywhere font-serif text-3xl text-white sm:text-4xl">
          {t("page.greeting", { name: user.name })}
        </h1>
        <p className="mt-3 text-sm text-app-muted">{t("page.subtitle")}</p>
      </header>
      {children}
    </main>
  );
}
