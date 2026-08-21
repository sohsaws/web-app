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
import {
  type ProfileFormValues,
  profileFormSchema,
} from "@/lib/config/profile";

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
