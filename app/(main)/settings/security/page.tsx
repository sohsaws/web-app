import Link from "next/link";
import { getUser } from "@/lib/actions/User";
import { DeleteAccountModal } from "./_components/DeleteAccountModal";

import { Lock, ShieldAlert } from "lucide-react";

export default async function SecurityPage() {
	const user = await getUser();
	const hasPassword = !!user?.passwordHash;

	return (
		<div className="flex-1 px-10">
			<div className="max-w-3xl space-y-8">
				<div className="space-y-1 mb-10">
					<h1 className="text-2xl font-semibold tracking-tight text-white">
						Security
					</h1>
					<p className="text-sm mt-5 font-normal text-neutral-500">
						Manage your password, authentication, and account lifecycle.
					</p>
				</div>

				<div className="border border-white/10 rounded-xl bg-neutral-900/30 backdrop-blur-md shadow-lg shadow-black/20 overflow-hidden">
					<div className="p-6 space-y-4">
						<div>
							<h2 className="text-base font-medium text-white">Password</h2>
							<p className="text-sm text-neutral-400 mt-1">
								Update the password associated with your account.
							</p>
						</div>
						<div className="pt-2">
							<input
								type="password"
								value="••••••••••••••••"
								readOnly
								className="w-full sm:w-80 bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-neutral-400 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
							/>
						</div>
					</div>
					<div className="px-6 py-4 bg-white/2 border-t border-white/10 flex items-center justify-between">
						<p className="text-xs text-neutral-500">
							Secure passwords help protect your data.
						</p>
						<Link
							href="/change-password/pending"
							className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-neutral-300 transition-colors group underline underline-offset-4 decoration-white/30 hover:decoration-white"
						>
							<Lock
								size={16}
								className="text-neutral-400 group-hover:text-white transition-colors"
							/>
							Change password
						</Link>
					</div>
				</div>

				<div className="border border-white/10 rounded-xl bg-neutral-900/30 backdrop-blur-md shadow-lg shadow-black/20 overflow-hidden">
					<div className="p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
						<div className="space-y-2">
							<h2 className="text-base font-medium text-white flex items-center gap-3">
								Two-Factor Authentication
								<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800/80 border border-white/5 text-xs font-medium text-neutral-400 shrink-0">
									<span className="w-1.5 h-1.5 rounded-full bg-neutral-500"></span>
									2FA is disabled
								</span>
							</h2>
							<p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
								Add an extra layer of security to your account by requiring a
								verification code from an authenticator app upon login.
							</p>
						</div>
					</div>
					<div className="px-6 py-4 bg-white/2 border-t border-white/10 flex items-center justify-between">
						<p className="text-xs text-neutral-500">
							We highly recommend enabling this feature.
						</p>
						<button className="bg-white text-black hover:bg-neutral-200 transition-colors text-sm font-medium py-2 px-4 rounded-lg shrink-0 shadow-sm flex items-center gap-2 cursor-pointer">
							Enable 2FA
						</button>
					</div>
				</div>

				<div className="border border-red-500/20 rounded-xl bg-neutral-900/30 backdrop-blur-md shadow-lg shadow-black/20 overflow-hidden mt-12">
					<div className="p-6">
						<h2 className="text-base font-medium text-white flex items-center gap-2">
							<ShieldAlert size={20} className="text-red-500" />
							Delete Account
						</h2>
						<p className="text-sm text-neutral-400 mt-2 max-w-xl leading-relaxed">
							Permanently remove your account and all of its contents from the
							Swiipy platform. This action is not reversible, so please continue
							with caution.
						</p>
					</div>
					<div className="px-6 py-4 bg-red-500/2 border-t border-red-500/10 flex items-center justify-between">
						<p className="text-xs text-red-500/60 font-medium tracking-wide uppercase">
							Danger Zone
						</p>
						<DeleteAccountModal hasPassword={hasPassword} />
					</div>
				</div>
			</div>
		</div>
	);
}
