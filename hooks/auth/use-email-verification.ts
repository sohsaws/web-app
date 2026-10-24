"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthErrorMessage } from "@/hooks/i18n/use-auth-error-message";
import { authClient } from "@/lib/auth/auth-client";

const VERIFICATION_CALLBACK_URL = "/verify-email?verified=true";

interface UseEmailVerificationResult {
  isSending: boolean;
  sendVerificationEmail: () => Promise<void>;
}

export function useEmailVerification(
  email: string,
): UseEmailVerificationResult {
  const t = useTranslations("Auth.verifyEmail");
  const authErrorMessage = useAuthErrorMessage();
  const [isSending, setIsSending] = useState(false);

  async function sendVerificationEmail(): Promise<void> {
    if (isSending) {
      return;
    }

    setIsSending(true);

    try {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: VERIFICATION_CALLBACK_URL,
      });

      if (error) {
        toast.error(authErrorMessage(error, t("failed")));
        return;
      }

      toast.success(t("linkSent"));
    } catch (error: unknown) {
      console.error("Sending the verification email failed:", error);
      toast.error(t("failed"));
    } finally {
      setIsSending(false);
    }
  }

  return {
    isSending,
    sendVerificationEmail,
  };
}
