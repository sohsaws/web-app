

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProfileForm from "./_components/ProfileForm";

import {
  User,
  ShieldCheck,
  CreditCard,
  Bell,
  Settings,
  Camera,
  Save,
} from "lucide-react";

type User = {
  name: string;
  email: string;
  image: string;
  id: string;
  username: string;
  emailVerified: boolean;
}

const navItems = [
  { label: "Profile",       icon: User        },
  { label: "Security",      icon: ShieldCheck },
  { label: "Billing",       icon: CreditCard  },
  { label: "Notifications", icon: Bell        },
  { label: "Preferences",   icon: Settings    },
] as const;

// const BIO_MAX = 200;

export default function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const user = session?.user as User;

  const [Name, setName] = useState("");
  const [bio, setBio] = useState("");


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

              {/* <form
                className="space-y-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO: wire to PATCH /api/profile
                }}
              >

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-xs font-medium text-neutral-500">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={Name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={user?.name ?? "Name"}
                      className="block w-full min-w-0 flex-1 rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-white/20 focus:ring-1 focus:ring-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-xs font-medium text-neutral-500">
                      Email
                    </label>
                    <text
                      id="email"
                      className="block w-full min-w-0 flex-1 rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-neutral-500 shadow-sm"
                    >{user?.email}</text>
                    <Link
                      href=""
                      className="pl-54 text-xs text-blue-400"
                    >
                      Change my email address
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="block text-xs font-medium text-neutral-500">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => {
                      if (e.target.value.length <= BIO_MAX) setBio(e.target.value);
                    }}
                    placeholder="Write something about yourself…"
                    className="block w-full resize-none rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-white/20 focus:ring-1 focus:ring-white/20 outline-none transition-all"
                  />
                  <div className="flex justify-between pl-2 text-xs text-neutral-600">
                    <span>Write a short introduction.</span>
                    <span>{bio.length}/{BIO_MAX}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                  <button
                    type="button"
                    className="cursor-pointer px-4 py-2 text-sm font-medium text-neutral-500 outline-none transition-colors hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-medium text-black shadow-sm outline-none transition-all hover:bg-neutral-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-950"
                  >
                    <Save size={16} strokeWidth={1.5} />
                    Save Changes
                  </button>
                </div>
              </form> */}

            </div>
          </div>
        );
}