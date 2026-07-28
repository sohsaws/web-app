"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { deleteAccount } from "@/lib/actions/creds-changes";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const passSchema = z.object({
	password: z
		.string({ error: "Password is required for account's delete" })
		.min(8, "Password must be at least 8 characters long")
		.max(50, "Password must be at most 50 characters long"),
});
const keyWord = "DELETE";
type passForm = z.infer<typeof passSchema>;

export function DeleteAccountModal({ hasPassword }: { hasPassword: boolean }) {
	const [isOpen, setIsOpen] = useState(false);
	const [password, setPassword] = useState("");
	console.log(hasPassword);
	const [confirmation, setConfirmation] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const isConfirmed = confirmation === keyWord;

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<passForm>({
		resolver: zodResolver(passSchema),
	});

	const resetAndClose = () => {
		setIsOpen(false);
		setPassword("");
		setConfirmation("");
	};

	const Logout = async () => {
		return;
	}

	const onSubmitHandler: SubmitHandler<passForm> = async (data) => {
		try {
			setSubmitting(true);
			const result = await deleteAccount(data.password);

			if (!result.success) {
				toast.error(result.message);
				setSubmitting(false);
				return;
			}

			setSubmitting(false);
			toast.success(result.message);

			await Logout();
		} catch (error) {
			setSubmitting(false);
			console.log(error);
		}
	};

	async function handleOuathDelete() {
		// if (!canSubmit) return;
		if (!isConfirmed) {
			return { success: false, message: `Please, type ${keyWord} for proceed` };
		}

		setSubmitting(true);
		const result = await deleteAccount(hasPassword ? password : undefined);

		if (!result.success) {
			toast.error(result.message);
			setSubmitting(false);
			return;
		}

		console.log(hasPassword);

		toast.success("Account deleted.");
		await Logout();
	}

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 border border-red-500/20 transition-colors text-sm font-medium py-2 px-4 rounded-lg shrink-0 flex items-center gap-2 cursor-pointer"
			>
				<Trash2 size={16} />
				Delete Account
			</button>

			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div
						className="absolute inset-0 bg-black/70 backdrop-blur-sm"
						onClick={resetAndClose}
					/>
					<div className="relative w-full max-w-md mx-4 rounded-xl border border-red-500/20 bg-neutral-950 shadow-2xl shadow-red-500/5">
						<div className="flex items-center justify-between p-6 border-b border-white/5">
							<div className="flex items-center gap-3">
								<AlertTriangle size={20} className="text-red-500" />
								<h2 className="text-lg font-semibold text-white">
									Delete Account
								</h2>
							</div>
							<button
								onClick={resetAndClose}
								className="text-neutral-500 hover:text-white transition-colors"
							>
								<X size={18} />
							</button>
						</div>

						<div className="p-6 space-y-5">
							<p className="text-sm text-neutral-400 leading-relaxed">
								This will permanently delete your account and all associated
								data. This action cannot be undone.
							</p>

							<div className="space-y-2">
								<label className="block text-xs font-medium text-neutral-500">
									Type{" "}
									<span className="text-red-500 font-semibold">DELETE</span> to
									confirm
								</label>
								<input
									type="text"
									value={confirmation}
									onChange={(event) => setConfirmation(event.target.value)}
									placeholder="DELETE"
									className="block w-full rounded-lg border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-red-500/30 focus:border-red-500/30 transition-all"
								/>
							</div>

							{hasPassword && (
								<form
									id="PasswordForm"
									onSubmit={handleSubmit(onSubmitHandler)}
								>
									<div className="space-y-2">
										<label className="block text-xs font-medium text-neutral-500">
											Enter your password
										</label>
										<input
											type="password"
											{...register("password")}
											placeholder="Your current password"
											className="block w-full rounded-lg border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-red-500/30 focus:border-red-500/30 transition-all"
										/>
									</div>
									{errors.password && (
										<p className="text-red-500 text-xs mt-2">
											{errors.password?.message}
										</p>
									)}
								</form>
							)}
						</div>

						<div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
							<button
								onClick={resetAndClose}
								className="text-sm font-medium text-neutral-400 hover:text-white px-4 py-2 rounded-lg transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								form="PasswordForm"
								disabled={!isConfirmed || submitting}
								className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium py-2 px-4 rounded-lg flex items-center gap-2"
							>
								<Trash2 size={14} />
								{submitting ? "Deleting..." : "Delete Account"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
