"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  type ProfileFormValues,
  profileFormSchema,
} from "@/lib/entities/profile";

export type UpdateProfileResult =
  | { success: true; message: string }
  | { success: false; message: string };

export async function updateProfile(
  input: ProfileFormValues,
): Promise<UpdateProfileResult> {
  const parsedInput = profileFormSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Please check the profile fields and try again",
    };
  }

  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    return {
      success: false,
      message: "You must be signed in to update your profile",
    };
  }

  try {
    await auth.api.updateUser({
      body: parsedInput.data,
      headers: requestHeaders,
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
