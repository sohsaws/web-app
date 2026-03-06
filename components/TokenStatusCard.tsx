import { CheckCircle, XCircle, AlertCircle, Mail } from "lucide-react";

export type TokenStatus = "success" | "invalid_token" | "expired_token"

const STATUS_CONFIG: Record<TokenStatus, {
    icon: React.ElementType;
    iconClass: string;
    title: string;
    description: string;
}> = {
    success: {
        icon: CheckCircle,
        iconClass: "text-white",
        title: "Success",
        description: "Redirecting you back in a moment...",
    },
    invalid_token: {
        icon: XCircle,
        iconClass: "text-red-500",
        title: "Invalid link",
        description: "This verification link is invalid. Please request a new one",
    },
    expired_token: {
        icon: AlertCircle,
        iconClass: "text-amber-500",
        title: "Link is expired",
        description: "This verification link has expired. Please request a new one",
    },
};

export function TokenStatusCard({ status }: { status: TokenStatus }) {
    const { icon: Icon, iconClass, title, description } = STATUS_CONFIG[status];

    return (
        <div className="bg-[#080808] flex items-center justify-center min-h-screen px-4">
            <div className="flex flex-col items-center gap-6 w-full max-w-md rounded-2xl border border-white/5 px-8 py-12 text-center">
                <Icon size={48} strokeWidth={1.5} className={iconClass} />
                <div className="space-y-2">
                    <h1 className="text-xl font-semibold text-white">{title}</h1>
                    <p className="text-sm text-neutral-500">{description}</p>
                </div>
            </div>
        </div>
    );
}



