import { generateToken } from "@/lib/utils/tokenGenerator";
import { sendEmail } from "@/lib/actions/email-actions";
import { VerificationTemp } from "@/emails/verification-template";
import { getUser } from "@/lib/actions/User";
import prisma from "@/lib/prisma";
import { Mail } from "lucide-react";
import Link from "next/link";

export default async function VerifyEmailPending() {
    const user = await getUser();

    if (!user) {
        return null;
    }

    if (!user.email) {
        return null;
    }

    const emailVerificationTokenObject = generateToken(1);

    await prisma.verificationToken.upsert({
        where: {
            userId: user.id,
        },
        update: {
            token: emailVerificationTokenObject.token,
            expiresAt: emailVerificationTokenObject.expiresAt,
            createdAt: emailVerificationTokenObject.createdAt,
        },
        create: {
            userId: user.id,
            token: emailVerificationTokenObject.token,
            expiresAt: emailVerificationTokenObject.expiresAt,
            createdAt: emailVerificationTokenObject.createdAt,
        },
    });

    await sendEmail({
        to: ["dsskis3@gmail.com"],
        subject: "Email Verification",
        react: <VerificationTemp username={user.username ? user.username : user.name} emailVerificationToken={emailVerificationTokenObject.token} />,
    });

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
