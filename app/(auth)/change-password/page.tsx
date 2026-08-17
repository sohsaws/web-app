import prisma from "@/lib/prisma";
import { TokenStatusCard } from "@/app/(auth)/verify-email/_components/token-status-card.client";
import { NewPasswordForm } from "./_components/NewPasswordForm";

export default async function ChangePasswordPage({
	searchParams,
}: {
	searchParams: Promise<{ token?: string }>;
}) {
	const { token } = await searchParams;

	if (!token) {
		return <TokenStatusCard status="invalid_token" />;
	}

	const verificationToken = await prisma.verification.findUnique({
		where: { token },
	});

	if (!verificationToken) {
		return <TokenStatusCard status="invalid_token" />;
	}

	if (verificationToken.expiresAt < new Date()) {
		await prisma.verificationToken.delete({ where: { token } });
		return <TokenStatusCard status="expired_token" />;
	}

	return <NewPasswordForm token={token} />;
}
