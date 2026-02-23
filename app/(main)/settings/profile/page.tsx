
import Image from "next/image";
import ProfileForm from "./_components/ProfileForm";
import { auth } from "@/auth";

import {
  User,
  Camera,
} from "lucide-react";

type User = {
  name: string;
  email: string;
  image: string;
  id: string;
  username: string;
  emailVerified: boolean;
}

export default async function Profile() {

  const session = await auth();
  const user = session?.user as User;

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-sm text-neutral-500">Loading profile…</p>
      </div>
    );
  }


  return (
          <div className="flex-1 px-10">
            <div className="max-w-3xl">
              
              <div className="mb-10">
                <h1 className="text-2xl font-medium tracking-tight text-white mb-2">
                {user.username}&apos;s details
                </h1>
                <p className="text-sm text-neutral-500">
                  Manage how your information appears to others on the platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12 p-6 rounded-3xl border border-white/5 bg-[#080808]">
                <div className="relative h-20 w-20 shrink-0 rounded-full overflow-hidden bg-neutral-900 border border-neutral-800 group">
                  <Image
                    src={user?.image ? user.image : "/imgs/User.png"}
                    alt="Avatar"
                    fill
                    className="object-cover grayscale opacity-90 transition-opacity group-hover:opacity-50"
                  />
                  <div className="absolute cursor-pointer inset-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} strokeWidth={1.5} className="text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white mb-1">Profile Picture</h3>
                  <p className="text-xs text-neutral-500 mb-4">
                    Supports JPG, PNG or GIF. Max 2 MB.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="cursor-pointer px-4 py-2 text-xs font-medium text-neutral-300 bg-zinc-950 border border-white/10 rounded-md shadow-sm hover:bg-neutral-900 hover:border-white/20 focus:ring-1 focus:ring-neutral-700 outline-none transition-all"
                    >
                      Upload New
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer px-4 py-2 text-xs font-medium text-neutral-500 hover:text-red-400 outline-none transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              <ProfileForm />
            </div>
          </div>
        );
}