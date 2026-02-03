"use server"

import { signIn } from "@/lib/auth"

export const OauthRedirect = async () => {
    await signIn("google", { redirectTo: "/" })
} 