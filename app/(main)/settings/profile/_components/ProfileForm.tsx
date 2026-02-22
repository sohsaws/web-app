"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
    name: z.string()
    .min(1, "Name cannot be empty")
    .max(50, "Name cannot be longer than 50 characters"),
    bio: z.string()
    .max(200, "Bio cannot be longer than 200 characters")
})

type profileForm = z.infer<typeof profileSchema>

const BIO_MAX = 200;

export default function ProfileForm() {

    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<profileForm>({
        resolver: zodResolver(profileSchema)
    })

    const [Name, setName] = useState("");
    const [bio, setBio] = useState("");

    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
          router.push("/");
        },
      });

    const user = session?.user;

    return (
            <form
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
              </form>
    )
}