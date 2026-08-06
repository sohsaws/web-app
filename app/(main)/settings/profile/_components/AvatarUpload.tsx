"use client";

import { useRef, useState } from "react";
import { PutBlobResult } from "@vercel/blob";
import { toast } from "sonner";
import { authClient } from '@/lib/auth/auth-client';
import { useRouter } from "next/navigation";

export default function AvatarUpload() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const router = useRouter();

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {

		const file = event.target.files?.[0];

		if (!file) {
			toast.error('Something went wrong while saving file');
			return;
		};

		if (file.size > 4 * 1024 * 1024) {
			toast.error("File too large (max 4 MB)");
			return;
		}

		setUploading(true);
		const toastId = toast.loading("Uploading image...");

		try {
			const response = await fetch(`/api/upload?filename=${file.name}`, {
				method: "PUT",
				body: file,
			});

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			const newBlob = (await response.json()) as PutBlobResult;

			await authClient.updateUser({
				image: newBlob.url
			})

			toast.success("Avatar updated successfully", { id: toastId });
			router.refresh();
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong with the upload", { id: toastId });
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="flex-1">
			<h3 className="text-sm font-medium text-white mb-1">Profile Picture</h3>
			<p className="text-xs text-neutral-500 mb-4">
				Supports JPG, PNG or GIF. Max 4 MB.
			</p>
			<div className="flex gap-3">
				<input
					ref={fileInputRef}
					type="file"
					id="avatar-upload"
					accept="image/jpeg, image/png, image/gif"
					className="hidden"
					onChange={handleFileChange}
					disabled={uploading}
				/>
				<button
					type="button"
					disabled={uploading}
					onClick={() => fileInputRef.current?.click()}
					className="cursor-pointer px-4 py-2 text-xs font-medium text-neutral-300 bg-zinc-950 border border-white/10 rounded-md shadow-sm hover:bg-neutral-900 hover:border-white/20 focus:ring-1 focus:ring-neutral-700 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{uploading ? "Uploading..." : "Upload new"}
				</button>
				<button
					type="button"
					className="cursor-pointer px-4 py-2 text-xs font-medium text-neutral-500 hover:text-red-400 outline-none transition-colors disabled:opacity-50"
					disabled={uploading}
				>
					Remove
				</button>
			</div>
		</div>
	);
}
