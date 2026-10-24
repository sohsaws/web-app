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
    <div className="flex-1 px-10">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-1 mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {t("title")}
          </h1>
          <p className="text-sm mt-5 font-normal text-neutral-500">
            {t("description")}
          </p>
        </div>

        <div className="border border-white/10 rounded-xl bg-neutral-900/30 backdrop-blur-md shadow-lg shadow-black/20 overflow-hidden">
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-base font-medium text-white">
                {t("passwordTitle")}
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                {t("passwordDescription")}
              </p>
            </div>
            <div className="pt-2">
              <input
                type="password"
                value="••••••••••••••••"
                readOnly
                className="w-full sm:w-80 bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-neutral-400 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
              />
            </div>
          </div>
          <div className="px-6 py-4 bg-white/2 border-t border-white/10 flex items-center justify-between">
            <p className="text-xs text-neutral-500">{t("passwordHint")}</p>
            <Link
              href="/change-password"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-neutral-300 transition-colors group underline underline-offset-4 decoration-white/30 hover:decoration-white"
            >
              <Lock
                size={16}
                className="text-neutral-400 group-hover:text-white transition-colors"
              />
              {t("changePassword")}
            </Link>
          </div>
        </div>

        <div className="border border-white/10 rounded-xl bg-neutral-900/30 backdrop-blur-md shadow-lg shadow-black/20 overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
            <div className="space-y-2">
              <h2 className="text-base font-medium text-white flex items-center gap-3">
                {t("twoFactorTitle")}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800/80 border border-white/5 text-xs font-medium text-neutral-400 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-500"></span>
                  {t("twoFactorDisabled")}
                </span>
              </h2>
              <p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
                {t("twoFactorDescription")}
              </p>
            </div>
          </div>
          <div className="px-6 py-4 bg-white/2 border-t border-white/10 flex items-center justify-between">
            <p className="text-xs text-neutral-500">{t("twoFactorHint")}</p>
            <button className="bg-white text-black hover:bg-neutral-200 transition-colors text-sm font-medium py-2 px-4 rounded-lg shrink-0 shadow-sm flex items-center gap-2 cursor-pointer">
              {t("enableTwoFactor")}
            </button>
          </div>
        </div>

        <div className="border border-red-500/20 rounded-xl bg-neutral-900/30 backdrop-blur-md shadow-lg shadow-black/20 overflow-hidden mt-12">
          <div className="p-6">
            <h2 className="text-base font-medium text-white flex items-center gap-2">
              <ShieldAlert size={20} className="text-red-500" />
              {t("deleteTitle")}
            </h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-xl leading-relaxed">
              {t("deleteDescription")}
            </p>
          </div>
          <DeleteAccount requiresPassword={hasPassword} />
        </div>
      </div>
    </div>
  );
}
