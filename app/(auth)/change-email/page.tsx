import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { TokenStatusCard } from "@/components/TokenStatusCard";
import { NewEmailForm } from "./_components/NewEmailForm";


export default async function ChangeEmailPage({searchParams}: {searchParams: Promise<{ token?: string }>;}) {
    const { token } = await searchParams;

    if (!token) {
        return <TokenStatusCard status="invalid_token" />
    }

    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
    });

    if (verificationToken?.token !== token || !verificationToken) {
        return <TokenStatusCard status="invalid_token" />;
    }

    if (verificationToken.expiresAt < new Date()) {
        await prisma.verificationToken.delete({ where: { token } });
        return <TokenStatusCard status="expired_token" />;
    }

    return <NewEmailForm token={token} />;
}
