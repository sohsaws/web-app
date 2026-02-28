import { generateToken } from "@/lib/utils/tokenGenerator";
import { sendEmail } from "@/lib/actions/email-actions";
import { VerificationTemp } from "@/emails/verification-template";
import { getUser } from "@/lib/actions/User";
import prisma from "@/lib/prisma";

export default async function VerifyEmail() {

    const emailVerificationTokenObject = generateToken(1);
    const user = await getUser();

    if (!user) {
        return null;
    }

    await prisma.verificationToken.update({
        where: {
            userId: user.id,
        },
        data: {
            token: emailVerificationTokenObject.token,
            expiresAt: emailVerificationTokenObject.expiresAt,
            createdAt: emailVerificationTokenObject.createdAt,
        }
    })

    if (!user.email && !user.username) {
        return null;
    }

    await sendEmail({
        to: [user.email!],
        subject: "Email Verification",
        react: <VerificationTemp username={user.username!} emailVerificationToken={emailVerificationTokenObject.token} />,
    })

    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-semibold">Email is send to your inbox!</h1>
            <script>alert("Email is send to your inbox!")</script>
        </div>
    );
}