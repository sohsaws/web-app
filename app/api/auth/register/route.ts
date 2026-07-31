import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

interface registerSchema {
	clerkId: string,
	name: string,
	username: string,
	email: string,
	password: string,
};

export async function POST(req: Request) {
	try {
		const parsedBody: registerSchema = await req.json();

		const { clerkId, name, username, email, password } = parsedBody;
		const normalizedEmail = email.toLowerCase();
		const normalizedUsername = username.toLowerCase();

		const existingByClerkId = await prisma.user.findUnique({
			where: {
				clerkId,
			},
		});

		if (existingByClerkId) {
			return NextResponse.json({
				user: {
					name: existingByClerkId.name,
					username: existingByClerkId.username,
					email: existingByClerkId.email,
				},
			});
		}

		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [
					{ email: normalizedEmail },
					{ username: normalizedUsername },
				],
			},
		});

		if (existingUser?.clerkId && existingUser.clerkId !== clerkId) {
			return NextResponse.json(
				{
					status: "error",
					message: "This user already exists.",
				},
				{ status: 400 },
			);
		}

		const salt = 12;
		const passwordHash = await hash(password, salt);
		const user = existingUser
			? await prisma.user.update({
					where: {
						id: existingUser.id,
					},
					data: {
						clerkId,
						name,
						username: normalizedUsername,
						email: normalizedEmail,
						passwordHash,
					},
				})
			: await prisma.user.create({
					data: {
						clerkId,
						name,
						username: normalizedUsername,
						email: normalizedEmail,
						passwordHash,
					},
				});

		return NextResponse.json({
			user: {
				name: user.name,
				username: user.username,
				email: user.email,
			},
		});
	} catch (error) {
		console.error("Registration API error:", error);

		return NextResponse.json(
			{
				status: "error",
				message: "Registration failed.",
			},
			{ status: 500 },
		);
	}
}
