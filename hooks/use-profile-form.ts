"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { updateProfile } from "@/lib/actions/profile.action";
import * as z from "zod";

export const PROFILE_BIO_MAX_LENGTH = 400;

export const profileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name cannot be empty")
    .max(50, "Name cannot be longer than 50 characters"),
  bio: z
  .string()
  .trim()
  .max(
    PROFILE_BIO_MAX_LENGTH,
    `Bio cannot be longer than ${PROFILE_BIO_MAX_LENGTH} characters`,
  )
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UseProfileFormResult {
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: SubmitHandler<ProfileFormValues>;
  resetForm: () => void;
}

export function useProfileForm(
  defaultValues: ProfileFormValues,
): UseProfileFormResult {
  const router = useRouter();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    try {
      const result = await updateProfile(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      form.reset(values);
      toast.success(result.message);
      router.refresh();
    } catch (error: unknown) {
      console.error("Profile update failed:", error);
      toast.error("Something went wrong while updating your profile");
    }
  };

  return {
    form,
    onSubmit,
    resetForm: () => form.reset(defaultValues),
  };
}
