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

// Exported so the form can fill the {min}/{max} placeholders of the
// Validation messages that these limits produce.
export const RESET_PASSWORD_MIN_LENGTH = 8;
export const RESET_PASSWORD_MAX_LENGTH = 128;

// Messages are keys of the Validation namespace.
const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(RESET_PASSWORD_MIN_LENGTH, "passwordTooShort")
      .max(RESET_PASSWORD_MAX_LENGTH, "passwordTooLong"),
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

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface UseResetPasswordResult {
  form: UseFormReturn<ResetPasswordFormValues>;
  onSubmit: SubmitHandler<ResetPasswordFormValues>;
}

export function useResetPassword(token: string): UseResetPasswordResult {
  const t = useTranslations("Auth.resetPassword");
  const authErrorMessage = useAuthErrorMessage();
  const router = useRouter();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      confirmPassword: "",
      newPassword: "",
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async ({
    newPassword,
  }) => {
    try {
      const { error } = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (error) {
        if (error.code === "INVALID_TOKEN") {
          router.replace("/forgot-password?error=INVALID_TOKEN");
          return;
        }

        toast.error(authErrorMessage(error, t("failed")));
        return;
      }

      toast.success(t("success"));
      router.replace("/login?passwordReset=success");
    } catch (error: unknown) {
      console.error("Password reset failed:", error);
      toast.error(t("failed"));
    }
  };

  return {
    form,
    onSubmit,
  };
}
