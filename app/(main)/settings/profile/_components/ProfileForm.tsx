"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Save } from "lucide-react";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";   
import { updateProfile } from "@/lib/actions/profile";



const profileSchema = z.object({
    name: z.string()
    .min(1, "Name cannot be empty")
    .max(50, "Name cannot be longer than 50 characters"),
  bio: z.string()   
    .min(1, "Bio cannot be empty")
    .max(200, "Bio cannot be longer than 200 characters"),  
});

type profileForm = z.infer<typeof profileSchema>

const BIO_MAX = 200;

export default function ProfileForm() {

  const [bio, setBio] = useState("");
  const [subbmitting, setSubmitting] = useState(false);

  const {data: session} = useSession();
  const user = session?.user

  const {register, handleSubmit, formState: { errors }} = useForm<profileForm>({
    resolver: zodResolver(profileSchema)
  })

  const onSubmitHandler: SubmitHandler<profileForm> = async (data) => {
    try {
      setSubmitting(true);
      const result = await updateProfile(data);
      if (result?.success) {
        toast.success(result.message);
        setSubmitting(false);
      } else {
        toast.error(result?.message);
        setSubmitting(false);
      }
    } catch (error) {
      console.log(error);
      setSubmitting(false);
    }
  }

  return (
          <div>
            <form className="space-y-8"
                onSubmit={handleSubmit(onSubmitHandler)}
              >

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-xs font-medium text-neutral-500">
                    Name
                  </label>
                  <input
                    id="name"
                    {...register("name")}
                    placeholder={user?.name ?? "Name"}
                    className="block w-full min-w-0 flex-1 rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-white/20 focus:ring-1 focus:ring-white/20"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name?.message}</p>
                  )}
                </div>
                  

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-medium text-neutral-500">
                    Email
                  </label>
                  <text
                    id="email"
                    className="block w-full min-w-0 flex-1 rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-neutral-500 shadow-sm"
                  >{user?.email}
                  </text>
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
                  {...register("bio")}
                  onChange={(e) => {
                    if (e.target.value.length <= BIO_MAX) setBio(e.target.value);
                  }}
                  rows={4}
                  placeholder="Write something about yourself…"
                  className="block w-full resize-none rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-white/20 focus:ring-1 focus:ring-white/20 outline-none transition-all"
                />
                <div className="flex justify-between pl-2 text-xs text-neutral-600">
                  <span>Write a short introduction.</span>
                  <span>{bio.length}/{BIO_MAX}</span>
                </div>
              </div>
              {errors.bio && (
                <p className="text-xs text-red-500">{errors.bio?.message}</p>
              )}

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
          </div>
    )
}