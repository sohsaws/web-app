// import NextAuth from "next-auth"
// import AppleProvider from "next-auth/providers/apple"
// import GoogleProvider from "next-auth/providers/google"
import { handlers } from "@/auth"

export const { GET, POST } = handlers

// export const authOptions = {
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_ID || '',
//             clientSecret: process.env.GOOGLE_SECRET || '',
//         }),
//         AppleProvider({
//             clientId: process.env.APPLE_ID || '',
//             clientSecret: process.env.APPLE_SECRET || '',
//         })
//     ]
// }

// export default NextAuth(authOptions)