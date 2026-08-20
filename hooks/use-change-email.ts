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

const CHANGE_EMAIL_CALLBACK_URL = "/settings/profile";

const changeEmailSchema = z.object({
  newEmail: z
    .email("Please enter a valid email address")
    .max(60, "Email address is too long"),
});

type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;

interface UseChangeEmailResult {
  form: UseFormReturn<ChangeEmailFormValues>;
  isRequested: boolean;
  onSubmit: SubmitHandler<ChangeEmailFormValues>;
  requestedEmail: string | undefined;
}

export function useChangeEmail(currentEmail: string): UseChangeEmailResult {
  const [isRequested, setIsRequested] = useState(false);
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
        message: "This is already your current email address",
      });
      return;
    }

    try {
      const { error } = await authClient.changeEmail({
        newEmail: normalizedEmail,
        callbackURL: CHANGE_EMAIL_CALLBACK_URL,
      });

      if (error) {
        toast.error(error.message ?? "Unable to request an email change");
        return;
      }

      setRequestedEmail(normalizedEmail);
      setIsRequested(true);
    } catch (error: unknown) {
      console.error("Email change request failed:", error);
      toast.error("Unable to request an email change");
    }
  };

  return {
    form,
    isRequested,
    onSubmit,
    requestedEmail,
  };
}
