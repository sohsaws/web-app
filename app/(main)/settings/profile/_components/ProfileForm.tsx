"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function ProfileForm(creds: {name: string, email: string, bio: string}) {

  const router = useRouter();

  const { data: session, update: updateSession } = useSession();

  const isVerificated = session?.user.emailVerified;

  const [subbmitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<profileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: creds.name,
      bio: creds.bio
    } 
  });

  const onSubmitHandler: SubmitHandler<profileForm> = async (data) => {
    try {
      setSubmitting(true);
      const result = await updateProfile(data);
      
      if (result?.success) {
        
        await updateSession({
          user: {
            name: data.name,
          }
        });

        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
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
                    placeholder="Your Name"
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
                  <div
                    id="email"
                    className="block w-full min-w-0 flex-1 rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-neutral-500 shadow-sm"
                  >{creds.email}
                  </div>
                  <Link
                    href="/change-email"
                    className="inline-block ml-55 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1"
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
                  rows={4}
                  placeholder="Write something about yourself…"
                  className="block w-full resize-none rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-white/20 focus:ring-1 focus:ring-white/20 outline-none transition-all"
                />
                <div className="flex justify-between pl-2 text-xs text-neutral-600 mt-1">
                  <span>Write a short introduction.</span>
                  <span>{watch("bio")?.length || 0}/{BIO_MAX}</span>
                </div>
                {errors.bio && (
                  <p className="text-xs text-red-500">{errors.bio?.message}</p>
                )}
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
                  className={`cursor-pointer flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-medium text-black shadow-sm outline-none transition-all hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={subbmitting}
                >
                  <Save size={16} strokeWidth={1.5} />
                  {subbmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
    )
}
