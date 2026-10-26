"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { ActionFailure } from "@/lib/config/action-errors";
import {
  type ProfileFormValues,
  profileFormSchema,
} from "@/lib/config/profile";

export type UpdateProfileResult = { success: true } | ActionFailure;

export async function updateProfile(
  input: ProfileFormValues,
): Promise<UpdateProfileResult> {
  const parsedInput = profileFormSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      success: false,
      code: "INVALID_PROFILE",
    };
  }

  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    return {
      success: false,
      code: "NOT_SIGNED_IN",
    };
  }

  try {
    await auth.api.updateUser({
      body: parsedInput.data,
      headers: requestHeaders,
    });

    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      code: "PROFILE_UPDATE_FAILED",
    };
  }
}
