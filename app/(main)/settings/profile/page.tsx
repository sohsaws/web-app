import Image from "next/image";
import ProfileForm from "./_components/ProfileForm";
import AvatarUpload from "./_components/AvatarUpload";
import { getUser } from "@/lib/actions/User";

import { Camera } from "lucide-react";

export default async function Profile() {
	const user = await getUser();

	if (!user) {
		return (
			<div className="min-h-screen bg-zinc-950 flex items-center justify-center">
				<p className="text-sm text-neutral-500">Loading profile…</p>
			</div>
		);
	}

	return (
		<div className="flex-1 px-10">
			<div className="max-w-3xl">
				<div className="mb-10">
					<h1 className="text-2xl font-medium tracking-tight text-white mb-2">
						{user.username ?? user.name}&apos;s details
					</h1>
					<p className="text-sm text-neutral-500">
						Manage how your information appears to others on the platform.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12 p-6 rounded-3xl border border-white/5 bg-[#080808]">
					<div className="relative h-20 w-20 shrink-0 rounded-full overflow-hidden bg-neutral-900 border border-neutral-800 group">
						<Image
							src={user.image ? user.image : "/imgs/User.png"}
							alt="Avatar"
							fill
							className="object-cover transition-opacity group-hover:opacity-50"
						/>
						<div className="absolute cursor-pointer inset-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
							<Camera size={24} strokeWidth={1.5} className="text-white" />
						</div>
					</div>
					<AvatarUpload />
				</div>
				<ProfileForm
					name={user.name}
					bio={String(user.bio)}
					email={String(user.email)}
					emailVerified={user.emailVerified}
				/>
			</div>
		</div>
	);
}
