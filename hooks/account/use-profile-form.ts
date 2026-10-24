"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { useServerErrorMessage } from "@/hooks/i18n/use-server-error-message";
import { useRouter } from "@/i18n/navigation";
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
  const t = useTranslations("Settings.profile");
  const serverErrorMessage = useServerErrorMessage();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    try {
      const result = await updateProfile(values);

      if (!result.success) {
        toast.error(serverErrorMessage(result.code));
        return;
      }

      form.reset(values);
      toast.success(t("saved"));

      router.refresh();
    } catch (error: unknown) {
      console.error("Profile update failed:", error);
      toast.error(serverErrorMessage(error));
    }
  };

  return {
    form,
    onSubmit,
    resetForm: () => form.reset(defaultValues),
  };
}
