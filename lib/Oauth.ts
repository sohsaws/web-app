'use server'

import { signIn } from "@/auth"

export async function OauthRedirect(provider: string) {
    try {
        await signIn(provider, { redirectTo: '/' })
    } catch (error) {
        if (error instanceof Error) {console.log(`${error}`)} else console.log("Unknown error")
        throw error
    }
} 