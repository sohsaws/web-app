"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/lib/auth/auth-client";

const PASSWORD_RESET_REDIRECT_TO = "/forgot-password";

const forgotPasswordSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .max(60, "Email address is too long"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface UseForgotPasswordResult {
  form: UseFormReturn<ForgotPasswordFormValues>;
  onSubmit: SubmitHandler<ForgotPasswordFormValues>;
  requestedEmail: string | undefined;
}

export function useForgotPassword(): UseForgotPasswordResult {
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
        toast.error(error.message ?? "Unable to send the password reset link");
        return;
      }

      setRequestedEmail(normalizedEmail);
      toast.success("If the account exists, a reset link has been sent");
    } catch (error: unknown) {
      console.error("Password reset request failed:", error);
      toast.error("Unable to send the password reset link");
    }
  };

  return {
    form,
    onSubmit,
    requestedEmail,
  };
}
