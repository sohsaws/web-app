"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Lock, CheckCircle } from "lucide-react";
import { requestForChange } from "@/lib/actions/creds-changes";

export function RequestPasswordChange({ userEmail }: { userEmail: string }) {
    const [isPending, startTransition] = useTransition();
    const [sent, setSent] = useState(false);

    function handleSend() {
        startTransition(async () => {
            const result = await requestForChange(5, {
                passwordRequest: true,
                emailRequest: false,
                emailVerif: false
            });
            if (result.success) {
                setSent(true);
            } else {
                toast.error(result.message);
            }
        });
    }

    if (sent) {
        return (
            <div className="bg-[#080808] flex items-center justify-center min-h-screen px-4">
                <div className="flex flex-col items-center gap-6 max-w-md rounded-2xl border border-white px-12 py-12 text-center">
                    <CheckCircle size={48} strokeWidth={1.5} className="text-white" />
                    <div className="space-y-2">
                        <h1 className="text-xl font-semibold text-white">Check your inbox</h1>
                        <p className="text-sm text-neutral-500">
                            We sent a reset link to{" "}
                            <span className="text-white">{userEmail}</span>.{" "}
                            Click the link to set a new password.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#080808] flex items-center justify-center min-h-screen px-4">
            <div className="flex flex-col items-center gap-6 max-w-md rounded-2xl border border-white px-12 py-12 text-center">
                <Lock size={48} strokeWidth={1.5} className="text-white" />
                <div className="space-y-2">
                    <h1 className="text-xl font-semibold text-white">Reset your password</h1>
                    <p className="text-sm text-neutral-500">
                        We&apos;ll send a password reset link to{" "}
                        <span className="text-white">{userEmail}</span>.
                    </p>
                </div>
                <button
                    onClick={handleSend}
                    disabled={isPending}
                    className="w-full rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Sending..." : "Send reset link"}
                </button>
            </div>
        </div>
    );
}
