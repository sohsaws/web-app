import { generateToken } from "@/lib/utils/tokenGenerator";
import { sendEmail } from "@/lib/actions/email-actions";
import { VerificationTemp } from "@/emails/verification-template";
import { getUser } from "@/lib/actions/User";
import { requestForChange } from "@/lib/actions/creds-changes";
import prisma from "@/lib/prisma";
import { Mail } from "lucide-react";
import Link from "next/link";
import React from "react";
import { TokenStatusCard } from "@/components/TokenStatusCard";
import { success } from "zod";

export default async function VerifyEmailPending() {
    // const user = await getUser();

    // if (!user || !user.email) {
    //     return null;
    // }

    // const tokenObject = generateToken(1);

    // await prisma.verificationToken.upsert({
    //     where: { userId: user.id },
    //     update: {
    //         token: tokenObject.token,
    //         expiresAt: tokenObject.expiresAt,
    //         createdAt: tokenObject.createdAt,
    //     },
    //     create: {
    //         userId: user.id,
    //         token: tokenObject.token,
    //         expiresAt: tokenObject.expiresAt,
    //         createdAt: tokenObject.createdAt,
    //     },
    // });

    // await sendEmail({
    //     to: [user.email],
    //     subject: "Verify your Swiipy email",
    //     react: React.createElement(VerificationTemp, {
    //         username: user.username ?? user.name,
    //         emailVerificationToken: tokenObject.token,
    //     }),
    // });
    const user = await getUser();
    
    if (!user || !user.email) {
        return {};
    }

    const result = await requestForChange(5, {
        passwordRequest: false,
        emailRequest: false,
        emailVerif: true
    });

    if (!result.success) {
        return {success: false, message: "Bad Request"};
    }
    return (
        <div className="bg-[#080808] flex items-center justify-center min-h-screen px-4">
            <div className="flex flex-col items-center gap-6 w-full max-w-md rounded-2xl border border-white/5 px-8 py-12 text-center">
                <Mail size={48} strokeWidth={1.5} className="text-white" />
                <div className="space-y-2">
                    <h1 className="text-xl font-semibold text-white">Check your inbox</h1>
                    <p className="text-sm text-neutral-500">
                        We sent a verification link to{" "}
                        <span className="text-white">{user.email}</span>.{" "}
                        Click the link in the email to verify your address.
                    </p>
                </div>
                <Link
                    href="/settings/profile"
                    className="text-sm text-neutral-500 hover:text-white transition-colors duration-200"
                >
                    Back to settings
                </Link>
            </div>
        </div>
    );
}
