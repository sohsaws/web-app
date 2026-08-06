"use server";

import prisma from "@/lib/prisma";
import { auth } from "./../auth";
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getUser() {

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/login');
	}

	const id = session.user.id;

	const user = await prisma.user.findUnique({
		where: {
			id: id,
		},
	});

	if (user) {
		return user;
	} else {
		return;
	}
}
