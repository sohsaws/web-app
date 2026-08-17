"use server";

import React from "react";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/actions/User";
import { generateToken } from "@/lib/utils/tokenGenerator";
import { sendEmail } from "@/lib/actions/email-actions";
import { ChangePasswordTemp } from "@/emails/change-password-template";
import { ChangeEmailTemp } from "@/emails/change-email-template";
import { PasswordResetTemp } from "@/emails/reset-password-template";

interface config {
	passwordRequest: boolean;
	emailRequest: boolean;
	passwordReset: boolean;
}

interface submitData {
	token: string;
	newEmail?: string;
	newPassword?: string;
}

export async function requestForChange(mintues: number, template: config) {
	const user = await getUser();

	if (!user || !user.email) {
		return { success: false, message: "Not authenticated." };
	}

	const tokenObject = generateToken(mintues);

	await prisma.verificationToken.upsert({
		where: { userId: user.id },
		update: {
			token: tokenObject.token,
			expiresAt: tokenObject.expiresAt,
			createdAt: tokenObject.createdAt,
		},
		create: {
			userId: user.id,
			token: tokenObject.token,
			expiresAt: tokenObject.expiresAt,
			createdAt: tokenObject.createdAt,
		},
	});

	const { passwordRequest, emailRequest, passwordReset } = template;
	let result;

	if (passwordRequest) {
		result = await sendEmail({
			to: [user.email],
			subject: "Reset your Swiipy password",
			react: React.createElement(ChangePasswordTemp, {
				username: user.username ?? user.name,
				resetToken: tokenObject.token,
			}),
		});
	} else if (emailRequest) {
		result = await sendEmail({
			to: [user.email],
			subject: "Confirm your Swiipy email change",
			react: React.createElement(ChangeEmailTemp, {
				username: user.username ?? user.name,
				confirmToken: tokenObject.token,
			}),
		});
	} else if (passwordReset) {
		result = await sendEmail({
			to: [user.email],
			subject: "Reset your password",
			react: React.createElement(PasswordResetTemp, {
				username: user.username ?? user.name,
				passwordResetToken: tokenObject.token,
			}),
		});
	} else return { success: false, message: "Unknow error" };

	if (!result) {
		return {
			success: false,
			message: "Failed to send email. Please try again.",
		};
	}

	return { success: true };
}

export async function submitChanges(data: submitData) {
	const { token, newEmail, newPassword } = data;

	const tokenObject = await prisma.verificationToken.findUnique({
		where: { token },
	});

	if (!tokenObject) return {};

	if (tokenObject.expiresAt < new Date()) {
		await prisma.verificationToken.delete({ where: { token } });
		return {
			success: false,
			message: "This confirmation link has expired. Please request a new one.",
		};
	}

	if (newPassword) {
		const passwordHash = await bcrypt.hash(newPassword, 12);

		await prisma.user.update({
			where: { id: tokenObject.userId },
			data: { passwordHash },
		});
	} else {
		const currentUser = await prisma.user.findUnique({
			where: { id: tokenObject.userId },
		});

		if (currentUser?.email === newEmail) {
			return {
				success: false,
				message: "This is already your current email address.",
			};
		}

		const emailTaken = await prisma.user.findUnique({
			where: { email: newEmail },
		});

		if (emailTaken) {
			return {
				success: false,
				message: "This email address is already in use.",
			};
		}

		await prisma.user.update({
			where: { id: tokenObject.userId },
			data: {
				email: newEmail,
				emailVerified: new Date(),
			},
		});
	}

	await prisma.verificationToken.delete({ where: { token } });

	return { success: true };
}

export async function deleteAccount(password?: string) {
	const user = await getUser();

	if (!user) {
		return { success: false, message: "Not authenticated." };
	}

	if (user.passwordHash) {
		if (!password) {
			return { success: false, message: "Password is required." };
		}

		const passwordValid = await bcrypt.compare(password, user.passwordHash);

		if (!passwordValid) {
			return { success: false, message: "Incorrect password." };
		}
	}

	await prisma.user.delete({
		where: { id: user.id },
	});

	return { success: true, message: "Deleted succsessfuly" };
}
