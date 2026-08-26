import type { ReactElement } from "react";
import type { TokenStatus } from "@/components/token-status-card";
import { VerifyEmailResult } from "./_components/verify-email-result.client";

interface VerifyEmailSearchParams {
  verified?: string;
  error?: string;
}

interface VerifyEmailPageProps {
  searchParams: Promise<VerifyEmailSearchParams>;
}

function getVerificationStatus({
  verified,
  error,
}: VerifyEmailSearchParams): TokenStatus {
  if (error === "TOKEN_EXPIRED") {
    return "expired_token";
  }

  if (error || verified !== "true") {
    return "invalid_token";
  }

  return "success";
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps): Promise<ReactElement> {
  const status = getVerificationStatus(await searchParams);

  return <VerifyEmailResult status={status} />;
}
