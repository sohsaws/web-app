"use client";

import { useRouter } from "next/navigation";
import { type ReactElement, useEffect } from "react";
import { toast } from "sonner";
import {
  type TokenStatus,
  TokenStatusCard,
} from "@/components/token-status-card.client";

interface EmailVerificationResultProps {
  status: TokenStatus;
}

export function VerifyEmailResult({
  status,
}: EmailVerificationResultProps): ReactElement {
  const router = useRouter();

  useEffect(() => {
    if (status !== "success") {
      return;
    }

    toast.success("Email verified successfully");

    const timer = setTimeout(() => {
      router.replace("/settings/profile");
    }, 2800);

    return () => clearTimeout(timer);
  }, [router, status]);

  return <TokenStatusCard status={status} />;
}
