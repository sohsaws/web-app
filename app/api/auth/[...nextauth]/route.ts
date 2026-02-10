
import { handlers } from "@/auth" // Referring to the auth.ts we just created
export const { GET, POST } = handlers



// import NextAuth from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
// import CredentialsProvider from "next-auth/providers/credentials"
// import prisma from "@/lib/prisma"
// import bcrypt from 'bcrypt'


// export const authOptions = {
//   providers: [
//     CredentialsProvider({

//         name: "Credentials",
//         credentials: {
//             name: {label: "Name", type: "name"},
//             email: { label: "Email", type: "email" },
//             password: { label: "Password", type: "password" }
//         },
        
//         async authorize(credentials) {

//             if (!credentials?.email || credentials.name || !credentials.password) {
//                 return null
//             }

//             const user = await prisma.user.findUnique({
//                 where: { email: credentials.email}
//             }); if (!user) {return null}

//             const passwordValidation = await bcrypt.compare(
//                 credentials.password,
//                 user.passwordHash
//             ); if (!passwordValidation) {return null}

//             await prisma.user.update({
//                 where: {id: user.id},
//                 data: {lastLogin: new Date()}
//             })

//             return {
//                 id: user.id,
//                 email: user.email,
//                 name: user.name
//             }
//         },
//     }),

//     GoogleProvider({
//       clientId: process.env.AUTH_GOOGLE_ID || '',
//       clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
//     }),
//   ],
//   pages: {
//     signIn: '/login'
//   },
//   secret: process.env.NEXTAUTH_SECRET
// }
// export default NextAuth(authOptions)