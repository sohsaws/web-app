"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, CheckCircle } from "lucide-react";
import { requestForChange } from "@/lib/actions/creds-changes";

export function RequestEmailChange({ userEmail }: { userEmail: string }) {
	const [pending, setPending] = useState(false);
	const [sent, setSent] = useState(false);

	const handleSend = async () => {
		setPending(true);
		const result = await requestForChange(5, {
			passwordRequest: false,
			emailRequest: true,
			emailVerif: false,
			passwordReset: false,
		});
		if (result.success) {
			setPending(false);
			setSent(true);
		} else toast.error(result.message);
	};

	if (sent) {
		return (
			<div className="bg-[#080808] flex items-center justify-center min-h-screen px-4">
				<div className="flex flex-col items-center gap-6 max-w-md rounded-2xl border border-white px-12 py-12 text-center">
					<CheckCircle size={48} strokeWidth={1.5} className="text-white" />
					<div className="space-y-2">
						<h1 className="text-xl font-semibold text-white">
							Check your inbox
						</h1>
						<p className="text-sm text-neutral-500">
							We sent a confirmation link to{" "}
							<span className="text-white">{userEmail}</span>. Click the link to
							proceed with changing your email.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-[#080808] flex items-center justify-center min-h-screen px-6">
			<div className="flex flex-col items-center gap-6 max-w-md rounded-2xl border border-white px-12 py-12 text-center">
				<Mail size={48} strokeWidth={1.5} className="text-white" />
				<div className="space-y-2">
					<h1 className="text-xl font-semibold text-white gap-2">
						Change your email
					</h1>
					<p className="text-sm text-neutral-500">
						First, we need to confirm your identity. We&apos;ll send a
						confirmation link to your current address{" "}
						<span className="text-white">{userEmail}</span>.
					</p>
				</div>
				<button
					onClick={handleSend}
					disabled={pending}
					className="w-full rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{pending ? "Sending..." : "Send confirmation"}
				</button>
			</div>
		</div>
	);
}
