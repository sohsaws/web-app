"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { KeyRound } from "lucide-react";
import { submitChanges } from "@/lib/actions/creds-changes";

const schema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export function NewPasswordForm({ token }: { token: string }) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const { newPassword } = data;
            setSubmitting(true);
            const result = await submitChanges({token, newPassword});
            if (result.success) {
                toast.success("Password changed successfully!");
                router.push("/settings/security");
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[#080808] flex items-center justify-center min-h-screen px-4">
            <div className="flex flex-col items-center gap-6 max-w-md rounded-2xl border border-white px-12 py-12">
                <KeyRound size={48} strokeWidth={1.5} className="text-white" />
                <div className="space-y-2 text-center">
                    <h1 className="text-xl font-semibold text-white">Set new password</h1>
                    <p className="text-sm text-neutral-500">Choose a strong password for your account.</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-neutral-500">
                            New password
                        </label>
                        <input
                            type="password"
                            {...register("newPassword")}
                            placeholder="Min. 8 characters"
                            className="block w-full rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-white/20 focus:ring-1 focus:ring-white/20 outline-none transition-all"
                        />
                        {errors.newPassword && (
                            <p className="text-xs text-red-500">{errors.newPassword.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-neutral-500">
                            Confirm password
                        </label>
                        <input
                            type="password"
                            {...register("confirmPassword")}
                            placeholder="Repeat your password"
                            className="block w-full rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-white/20 focus:ring-1 focus:ring-white/20 outline-none transition-all"
                        />
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {submitting ? "Saving..." : "Set new password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
