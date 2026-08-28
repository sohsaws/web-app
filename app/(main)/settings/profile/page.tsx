// import { Camera } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { Avatar } from "@/components/avatar.client";
import { auth } from "@/lib/auth";
import AvatarUpload from "./_components/avatar-upload.client";
import ProfileForm from "./_components/profile-form.client";

export default async function ProfilePage(): Promise<ReactElement> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?reason=unauthorized");
  }

  const { user } = session;

  return (
    <div className="min-w-0 flex-1 px-4 sm:px-10">
      <div className="max-w-3xl">
        <div className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight text-white mb-2">
            {user.username ?? user.name}&apos;s details
          </h1>
          <p className="text-sm text-neutral-500">
            Manage how your information appears to others on the platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12 p-6 rounded-3xl border border-white/5 bg-[#080808]">
          <div className="size-20 shrink-0">
            <Avatar image={user.image} name={user.name} />
          </div>
          <AvatarUpload hasAvatar={Boolean(user.image)} />
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
