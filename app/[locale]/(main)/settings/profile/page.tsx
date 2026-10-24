import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactElement } from "react";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import AvatarUpload from "./_components/avatar-upload.client";
import ProfileForm from "./_components/profile-form.client";

export default async function ProfilePage(): Promise<ReactElement> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect({ href: "/login?reason=unauthorized", locale: await getLocale() });
  }

  const { user } = session;
  const t = await getTranslations("Settings.profile");

  return (
    <div className="min-w-0 flex-1 px-4 sm:px-10">
      <div className="max-w-3xl">
        <div className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight text-white mb-2">
            {t("title", { name: user.username ?? user.name })}
          </h1>
          <p className="text-sm text-neutral-500">{t("description")}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12 p-6 rounded-3xl border border-white/5 bg-[#080808]">
          <AvatarUpload image={user.image} name={user.name} />
        </div>
        <ProfileForm
          defaultValues={{
            name: user.name,
            bio: user.bio ?? "",
          }}
          email={user.email}
          emailVerified={user.emailVerified}
        />
      </div>
    </div>
  );
}
