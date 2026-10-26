import { Info } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactElement } from "react";
import { Link } from "@/i18n/navigation";

export async function PasswordUnavailable(): Promise<ReactElement> {
  const t = await getTranslations("Auth.changePassword.unavailable");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-white/5 px-8 py-12 text-center">
        <Info
          aria-hidden="true"
          size={48}
          strokeWidth={1.5}
          className="text-neutral-400"
        />
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-white">{t("title")}</h1>
          <p className="text-sm text-neutral-500">{t("description")}</p>
        </div>
        <Link
          href="/forgot-password"
          className="w-full rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
        >
          {t("action")}
        </Link>
      </div>
    </div>
  );
}
