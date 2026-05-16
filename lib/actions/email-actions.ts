"use server";

import React from "react";
import { Resend } from "resend";
import { getUser } from "@/lib/actions/User";
import { generateToken } from "../utils/tokenGenerator";
import prisma from "../prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

interface Email {
	to: string[];
	subject: string;
	react: React.ReactNode;
}

export const sendEmail = async (paylaod: Email) => {
	const { error } = await resend.emails.send({
		from: "Acne <onboarding@resend.dev>",
		...paylaod,
	});

	if (error) {
		console.error("Error sending email", error);
		return null;
	}

	return { success: true };
};
