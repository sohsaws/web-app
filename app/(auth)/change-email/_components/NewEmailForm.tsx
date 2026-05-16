"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { AtSign } from "lucide-react";
import { submitChanges } from "@/lib/actions/creds-changes";

const schema = z.object({
	newEmail: z.email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export function NewEmailForm({ token }: { token: string }) {
	const router = useRouter();
	const [submitting, setSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		try {
			const { newEmail } = data;
			setSubmitting(true);
			const result = await submitChanges({ token, newEmail });
			if (result.success) {
				toast.success("Email updated successfully!");
				router.push("/settings/profile");
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
				<AtSign size={48} strokeWidth={1.5} className="text-white" />
				<div className="space-y-2 text-center">
					<h1 className="text-xl font-semibold text-white">
						Enter your new email
					</h1>
					<p className="text-sm text-neutral-500">
						Your identity is confirmed. Enter the new email address you want to
						use. It will be marked as verified automatically.
					</p>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
					<div className="space-y-2">
						<label className="block text-xs font-medium text-neutral-500">
							New email address
						</label>
						<input
							type="email"
							{...register("newEmail")}
							placeholder="you@example.com"
							className="block w-full rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-white/20 focus:ring-1 focus:ring-white/20 outline-none transition-all"
						/>
						{errors.newEmail && (
							<p className="text-xs text-red-500">{errors.newEmail.message}</p>
						)}
					</div>
					<button
						type="submit"
						disabled={submitting}
						className="w-full rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
					>
						{submitting ? "Saving..." : "Update email"}
					</button>
				</form>
			</div>
		</div>
	);
}
