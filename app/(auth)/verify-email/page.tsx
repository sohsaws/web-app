import prisma from "@/lib/prisma";
import { VerifyEmailResult } from "./_component/VerfiedEmailResult";

export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <VerifyEmailResult status="invalid_token" />;
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return <VerifyEmailResult status="invalid_token" />;
  }

  if (verificationToken.expiresAt < new Date()) {
    await prisma.verificationToken.delete({
      where: { token },
    });
    return <VerifyEmailResult status="expired_token" />;
  }

  await prisma.user.update({
    where: { id: verificationToken.userId },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({
    where: { token },
  });

  return <VerifyEmailResult status="success" />;
}
