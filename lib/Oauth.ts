"use server"

import { signIn, signOut } from "@/auth"

export const OauthLogin = async () => {
    await signIn("google", { redirectTo: "/dashboard" })
} 

export const Logout = async () => {
    await signOut({redirectTo: "/login"})
}

