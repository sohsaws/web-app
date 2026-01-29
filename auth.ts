import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
// import Credentials from "next-auth/providers/credentials"
// import type { Provider } from "next-auth/providers"и
import { prisma } from "./lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
      strategy: "jwt",
    },
    providers: [Google],
    adapter: PrismaAdapter(prisma),
    callbacks: {
      async jwt({token, user}) {

        if (user) {
          token.id = user.id
          token.name = user.name
        }
        return token
      },
      async session({session, token}) {

        if (session.user) {
          session.user.id = token.id as string
          session.user.name = token.name as string
        }
        return session
      }
    }
  })

 
// const providers: Provider[] = [
//   Credentials({
//     credentials: { 
//         password: { label: "Password", type: "password" },
//         name: {label: "Name", type: "name"},
//         email: {label: "Email", type: "email"}
//     },
//     authorize(credentials) {

//       if (!credentials?.email || !credentials.name || !credentials.password) 
//         return null

//       const user = prisma.user.findUnique({
//         where: {
//             email: credentials.email
//         }
//       })

      
      
//       return {
//         id: "test",
//         name: "Test User",
//         email: "test@example.com",
//       }
//     },
//   }),
//   Google,
// ]
 
// export const providerMap = providers
//   .map((provider) => {
//     if (typeof provider === "function") {
//       const providerData = provider()
//       return { id: providerData.id, name: providerData.name }
//     } else {
//       return { id: provider.id, name: provider.name }
//     }
//   })
//   .filter((provider) => provider.id !== "credentials")
 
// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers,
//   pages: {
//     signIn: "/signin",
//   },
// })