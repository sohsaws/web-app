"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuthErrorMessage } from "@/hooks/i18n/use-auth-error-message";
import { authClient } from "@/lib/auth/auth-client";

const PASSWORD_RESET_REDIRECT_TO = "/forgot-password";
// Exported so the form can fill the {max} placeholder of "emailTooLong".
export const FORGOT_PASSWORD_EMAIL_MAX_LENGTH = 60;

// Messages are keys of the Validation namespace.
const forgotPasswordSchema = z.object({
  email: z
    .email("emailInvalid")
    .max(FORGOT_PASSWORD_EMAIL_MAX_LENGTH, "emailTooLong"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface UseForgotPasswordResult {
  form: UseFormReturn<ForgotPasswordFormValues>;
  onSubmit: SubmitHandler<ForgotPasswordFormValues>;
  requestedEmail: string | undefined;
}

export function useForgotPassword(): UseForgotPasswordResult {
  const t = useTranslations("Auth.forgotPassword");
  const authErrorMessage = useAuthErrorMessage();
  const [requestedEmail, setRequestedEmail] = useState<string>();
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async ({
    email,
  }) => {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const { error } = await authClient.requestPasswordReset({
        email: normalizedEmail,
        redirectTo: PASSWORD_RESET_REDIRECT_TO,
      });

      if (error) {
        toast.error(authErrorMessage(error, t("failed")));
        return;
      }

      setRequestedEmail(normalizedEmail);
      toast.success(t("linkSent"));
    } catch (error: unknown) {
      console.error("Password reset request failed:", error);
      toast.error(t("failed"));
    }
  };

  return {
    form,
    onSubmit,
    requestedEmail,
  };
}
