"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function getUser() {
  const { userId } = await auth();

  console.log(userId);

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (user) {
    return user;
  } else {
    return;
  }
}
