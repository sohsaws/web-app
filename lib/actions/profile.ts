"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function updateProfile(data: { name: string; bio: string }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    await prisma.user.upsert({
      where: {
        id: userId,
      },
      update: {
        name: data.name,
        bio: data.bio,
      },
      create: {
        name: data.name,
        bio: data.bio,
      },
    });
    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      message: "Profile update failed",
    };
  }
}
