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
import { EMAIL_MAX_LENGTH } from "@/lib/config/auth";

const CHANGE_EMAIL_CALLBACK_URL = "/settings/profile";

// Messages are keys of the Validation namespace.
const changeEmailSchema = z.object({
  newEmail: z.email("emailInvalid").max(EMAIL_MAX_LENGTH, "emailTooLong"),
});

type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;

interface UseChangeEmailResult {
  form: UseFormReturn<ChangeEmailFormValues>;
  onSubmit: SubmitHandler<ChangeEmailFormValues>;
  requestedEmail: string | undefined;
}

export function useChangeEmail(currentEmail: string): UseChangeEmailResult {
  const t = useTranslations("Auth.changeEmail");
  const authErrorMessage = useAuthErrorMessage();
  const [requestedEmail, setRequestedEmail] = useState<string>();

  const form = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      newEmail: "",
    },
  });

  const onSubmit: SubmitHandler<ChangeEmailFormValues> = async ({
    newEmail,
  }) => {
    const normalizedEmail = newEmail.trim().toLowerCase();

    if (normalizedEmail === currentEmail.toLowerCase()) {
      form.setError("newEmail", {
        message: "emailSameAsCurrent",
      });
      return;
    }

    try {
      const { error } = await authClient.changeEmail({
        newEmail: normalizedEmail,
        callbackURL: CHANGE_EMAIL_CALLBACK_URL,
      });

      if (error) {
        toast.error(authErrorMessage(error, t("failed")));
        return;
      }

      setRequestedEmail(normalizedEmail);
      toast.success(t("linkSent"));
    } catch (error: unknown) {
      console.error("Email change failed:", error);
      toast.error(t("failed"));
    }
  };

  return {
    form,
    onSubmit,
    requestedEmail,
  };
}
