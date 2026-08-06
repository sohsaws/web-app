"use server";

import prisma from "@/lib/prisma";
import { auth } from '../auth';
import { redirect } from 'next/navigation';

export async function updateProfile(data: { name: string, bio: string }) {
	try {
		const session = await auth.api.getSession();

		if (!session) {
			redirect('/login');
		}

		const userId = session.user.id;

		await prisma.user.update({
			where: {
				id: userId,
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
