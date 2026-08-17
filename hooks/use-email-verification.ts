"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";

const VERIFICATION_CALLBACK_URL = "/verify-email?verified=true";
const VERIFICATION_SENT_MESSAGE = "The verification link has been sent to your inbox, please check";

interface UseEmailVerificationResult {
  isSending: boolean;
  sendVerificationEmail: () => Promise<void>;
}

export function useEmailVerification(
  email: string,
): UseEmailVerificationResult {
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
        toast.error(error.message ?? "Unable to send the verification link");
        return;
      }

      toast.success(VERIFICATION_SENT_MESSAGE);
    } catch {
      toast.error("Unable to send the verification link");
    } finally {
      setIsSending(false);
    }
  }

  return {
    isSending,
    sendVerificationEmail,
  };
}
