import { getTranslations } from "next-intl/server";
import type { ReactElement } from "react";
import { Link } from "@/i18n/navigation";
import { LoginForm } from "./_components/login-form.client";

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string | string[];
  }>;
}

function getSafeCallbackUrl(value: string | string[] | undefined): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/dashboard";
  }

  return value;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps): Promise<ReactElement> {
  const { callbackUrl } = await searchParams;
  const t = await getTranslations("Auth.login");

  return (
    <div className="bg-zinc-950 grow flex items-center justify-center pt-30 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div className="text-left">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-white">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-neutral-500">{t("subtitle")}</p>
        </div>

        <LoginForm callbackUrl={getSafeCallbackUrl(callbackUrl)} />

        <p className="mt-6 text-center text-xs text-neutral-500">
          {t.rich("noAccount", {
            link: (chunks) => (
              <Link
                href="/register"
                className="font-medium text-white hover:underline"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
