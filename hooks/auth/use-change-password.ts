"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuthErrorMessage } from "@/hooks/i18n/use-auth-error-message";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/config/auth";

// Messages are keys of the Validation namespace.
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "currentPasswordRequired"),
    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "passwordTooShort")
      .max(PASSWORD_MAX_LENGTH, "passwordTooLong"),
    confirmPassword: z.string(),
  })
  .refine(
    ({ confirmPassword, newPassword }) => {
      return confirmPassword === newPassword;
    },
    {
      message: "passwordsDoNotMatch",
      path: ["confirmPassword"],
    },
  );

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface UseChangePasswordResult {
  form: UseFormReturn<ChangePasswordFormValues>;
  onSubmit: SubmitHandler<ChangePasswordFormValues>;
}

export function useChangePassword(): UseChangePasswordResult {
  const t = useTranslations("Auth.changePassword");
  const authErrorMessage = useAuthErrorMessage();
  const router = useRouter();
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      confirmPassword: "",
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async ({
    currentPassword,
    newPassword,
  }) => {
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        if (error.code === "INVALID_PASSWORD") {
          form.setError("currentPassword", {
            message: "currentPasswordIncorrect",
          });
          return;
        }

        toast.error(authErrorMessage(error, t("failed")));
        return;
      }

      toast.success(t("success"));
      router.replace("/settings/security");
      router.refresh();
    } catch (error: unknown) {
      console.error("Password change failed:", error);
      toast.error(t("failed"));
    }
  };

  return {
    form,
    onSubmit,
  };
}
