import { Camera } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
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
          <div className="relative h-20 w-20 shrink-0 rounded-full overflow-hidden bg-neutral-900 border border-neutral-800 group">
            <Image
              src={user.image ?? "/imgs/User.png"}
              alt={`${user.name}'s profile picture`}
              fill
              className="object-cover transition-opacity group-hover:opacity-50"
            />
            <div
              aria-hidden="true"
              className="absolute inset-1 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Camera size={24} strokeWidth={1.5} className="text-white" />
            </div>
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
