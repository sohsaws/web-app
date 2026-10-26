import { getTranslations } from "next-intl/server";
import type { ReactElement } from "react";
import { Link } from "@/i18n/navigation";
import { RegisterForm } from "./_components/register-form.client";

export default async function RegisterPage(): Promise<ReactElement> {
  const t = await getTranslations("Auth.register");

  return (
    <div className="bg-zinc-950 grow flex items-center justify-center pt-25 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div className="text-left">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-white">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-neutral-500">{t("subtitle")}</p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-xs text-neutral-500">
          {t.rich("haveAccount", {
            link: (chunks) => (
              <Link
                href="/login"
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
