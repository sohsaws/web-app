'use server'

import { signIn } from "@/auth"

export async function OauthRedirect(provider: string) {
    try {
        await signIn(provider, { redirectTo: '/' })
    } catch (error) {
        // signIn throws a redirect, which is expected behavior
        // This catch prevents the error from being logged
        throw error
    }
} 