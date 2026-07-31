"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { TokenStatusCard } from "@/components/TokenStatusCard";
import { TokenStatus } from "@/components/TokenStatusCard";

// type VerificationStatus = "success" | "invalid_token" | "expired_token" | "missing_token";

// const STATUS_CONFIG: Record<VerificationStatus, {
//     icon: React.ElementType;
//     iconClass: string;
//     title: string;
//     description: string;
// }> = {
//     success: {
//         icon: CheckCircle,
//         iconClass: "text-white",
//         title: "Email verified",
//         description: "Your email address has been confirmed. Redirecting you back in a moment...",
//     },
//     invalid_token: {
//         icon: XCircle,
//         iconClass: "text-red-500",
//         title: "Invalid link",
//         description: "This verification link is invalid. Please request a new one from your profile settings.",
//     },
//     expired_token: {
//         icon: AlertCircle,
//         iconClass: "text-amber-500",
//         title: "Link expired",
//         description: "This verification link has expired. Please request a new one from your profile settings.",
//     },
//     missing_token: {
//         icon: Mail,
//         iconClass: "text-neutral-400",
//         title: "No token found",
//         description: "Please use the verification link we sent to your email address.",
//     },
// };

export function VerifyEmailResult({ status }: { status: TokenStatus }) {
	const router = useRouter();

	useEffect(() => {
		if (status !== "success") return;

		toast.success("Email is Succsessfuly verified");

		const timer = setTimeout(() => {
			router.push("/settings/profile");
		}, 2800);

		return () => clearTimeout(timer);
	}, [status]);

	return (
		<TokenStatusCard status={status} />
		// <div className="bg-[#080808] flex items-center justify-center min-h-screen px-4">
		//     <div className="flex flex-col items-center gap-6 w-full max-w-md rounded-2xl border border-white/5 px-8 py-12 text-center">
		//         <Icon size={48} strokeWidth={1.5} className={iconClass} />
		//         <div className="space-y-2">
		//             <h1 className="text-xl font-semibold text-white">{title}</h1>
		//             <p className="text-sm text-neutral-500">{description}</p>
		//         </div>
		//     </div>
		// </div>
	);
}
