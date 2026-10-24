import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ElementType, ReactElement } from "react";

export type TokenStatus = "success" | "invalid_token" | "expired_token";

// Groups under Auth.tokenStatus, each with a title and a description.
type TokenStatusMessageKey = "success" | "invalidToken" | "expiredToken";

const STATUS_CONFIG: Record<
  TokenStatus,
  {
    icon: ElementType;
    iconClass: string;
    messageKey: TokenStatusMessageKey;
  }
> = {
  success: {
    icon: CheckCircle,
    iconClass: "text-white",
    messageKey: "success",
  },
  invalid_token: {
    icon: XCircle,
    iconClass: "text-red-500",
    messageKey: "invalidToken",
  },
  expired_token: {
    icon: AlertCircle,
    iconClass: "text-amber-500",
    messageKey: "expiredToken",
  },
};

interface TokenStatusCardProps {
  status: TokenStatus;
}

export function TokenStatusCard({
  status,
}: TokenStatusCardProps): ReactElement {
  const t = useTranslations("Auth.tokenStatus");
  const { icon: Icon, iconClass, messageKey } = STATUS_CONFIG[status];

  return (
    <div className="bg-[#080808] flex items-center justify-center min-h-screen px-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-md rounded-2xl border border-white/5 px-8 py-12 text-center">
        <Icon
          aria-hidden="true"
          size={48}
          strokeWidth={1.5}
          className={iconClass}
        />
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-white">
            {t(`${messageKey}.title`)}
          </h1>
          <p className="text-sm text-neutral-500">
            {t(`${messageKey}.description`)}
          </p>
        </div>
      </div>
    </div>
  );
}
