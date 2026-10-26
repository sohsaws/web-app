import { Lock, ShieldAlert } from "lucide-react";
import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactElement } from "react";
import { Link, redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { DeleteAccount } from "./_components/delete-account.client";

export default async function SecurityPage(): Promise<ReactElement> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect({
      href: "/login?callbackUrl=/settings/security",
      locale: await getLocale(),
    });
  }

  const accounts = await auth.api.listUserAccounts({
    headers: requestHeaders,
  });
  const hasPassword = accounts.some(({ providerId }) => {
    return providerId === "credential";
  });
  const t = await getTranslations("Settings.security");

  return (
    <div className="min-w-0 flex-1 px-4 sm:px-10">
      <div className="max-w-3xl space-y-8">
        <div className="mb-10">
          <h1 className="mb-2 text-2xl font-medium tracking-tight text-white">
            {t("title")}
          </h1>
          <p className="text-sm text-neutral-500">{t("description")}</p>
        </div>

        <section className="app-settings-card border-white/5">
          <div className="space-y-4 p-6">
            <div>
              <h2 className="mb-1 text-sm font-medium text-white">
                {t("passwordTitle")}
              </h2>
              <p className="text-xs text-neutral-500">
                {t("passwordDescription")}
              </p>
            </div>
            <input
              type="password"
              value="••••••••••••••••"
              readOnly
              aria-label={t("passwordTitle")}
              className="block w-full rounded-md border border-neutral-800 bg-app-card px-3 py-2 text-sm text-neutral-400 shadow-sm outline-none transition-colors focus:border-white/20 focus:ring-1 focus:ring-white/20 sm:w-80"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 px-6 py-4">
            <p className="text-xs text-neutral-500">{t("passwordHint")}</p>
            <Link
              href="/change-password"
              className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-neutral-300 hover:decoration-white"
            >
              <Lock
                aria-hidden="true"
                size={14}
                className="text-neutral-400 transition-colors group-hover:text-white"
              />
              {t("changePassword")}
            </Link>
          </div>
        </section>

        <section className="app-settings-card border-white/5">
          <div className="space-y-1 p-6">
            <h2 className="flex flex-wrap items-center gap-3 text-sm font-medium text-white">
              {t("twoFactorTitle")}
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/5 bg-neutral-800/80 px-2.5 py-1 text-xs font-medium text-neutral-400">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-neutral-500"
                />
                {t("twoFactorDisabled")}
              </span>
            </h2>
            <p className="max-w-xl text-xs leading-relaxed text-neutral-500">
              {t("twoFactorDescription")}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 px-6 py-4">
            <p className="text-xs text-neutral-500">{t("twoFactorHint")}</p>
            <button
              type="button"
              className="flex shrink-0 cursor-pointer items-center gap-2 rounded-md bg-white px-4 py-2 text-xs font-medium text-black shadow-sm transition-colors hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t("enableTwoFactor")}
            </button>
          </div>
        </section>

        <section className="app-settings-card mt-12 overflow-hidden border-red-500/20">
          <div className="space-y-1 p-6">
            <h2 className="flex items-center gap-2 text-sm font-medium text-white">
              <ShieldAlert
                aria-hidden="true"
                size={18}
                className="text-red-500"
              />
              {t("deleteTitle")}
            </h2>
            <p className="max-w-xl text-xs leading-relaxed text-neutral-500">
              {t("deleteDescription")}
            </p>
          </div>
          <DeleteAccount requiresPassword={hasPassword} />
        </section>
      </div>
    </div>
  );
}
