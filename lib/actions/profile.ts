"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function updateProfile(data: { name: string; bio: string }) {
	try {
		const { userId, isAuthenticated, redirectToSignIn } = await auth();

		if (!userId || !isAuthenticated) {
			return redirectToSignIn();
		}

		await prisma.user.update({
			where: {
				clerkId: userId,
			},
			data: {
				name: data.name,
				bio: data.bio,
			},
		});
		return {
			success: true,
			message: "Profile updated successfully",
		};
	} catch (error) {
		console.error("Profile update error:", error);
		return {
			success: false,
			message: "Profile update failed",
		};
	}
}
