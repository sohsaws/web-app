"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getUser() {

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return null;
    }

    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })

    return user;
}