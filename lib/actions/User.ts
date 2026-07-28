"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getUser() {
	const { userId }= await auth();

	if (!userId) {
		return null;
	}

	const user = await prisma.user.findFirst({
		where: {
			id: userId,
		},
	});

	return user;
}
