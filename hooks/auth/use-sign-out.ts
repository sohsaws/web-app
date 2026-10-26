"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthErrorMessage } from "@/hooks/i18n/use-auth-error-message";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth/auth-client";

interface UseSignOutResult {
  isPending: boolean;
  signOut: () => Promise<void>;
}

export function useSignOut(): UseSignOutResult {
  const t = useTranslations("Common.signOut");
  const authErrorMessage = useAuthErrorMessage();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function signOut(): Promise<void> {
    if (isPending) {
      return;
    }

    setIsPending(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(authErrorMessage(error, t("failed")));
        return;
      }

      toast.success(t("success"));
      router.replace("/login");
    } catch {
      toast.error(t("failed"));
    } finally {
      setIsPending(false);
    }
  }

  return {
    isPending,
    signOut,
  };
}
