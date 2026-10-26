"use client";

import { useTranslations } from "next-intl";
import { type ReactElement, useEffect } from "react";
import { toast } from "sonner";
import {
  type TokenStatus,
  TokenStatusCard,
} from "@/app/[locale]/(auth)/_components/token-status-card.client";
import { useRouter } from "@/i18n/navigation";

interface EmailVerificationResultProps {
  status: TokenStatus;
}

export function VerifyEmailResult({
  status,
}: EmailVerificationResultProps): ReactElement {
  const t = useTranslations("Auth.verifyEmail");
  const router = useRouter();

  useEffect(() => {
    if (status !== "success") {
      return;
    }

    toast.success(t("verified"));

    const timer = setTimeout(() => {
      router.replace("/settings/profile");
    }, 2800);

    return () => clearTimeout(timer);
  }, [router, status, t]);

  return <TokenStatusCard status={status} />;
}
