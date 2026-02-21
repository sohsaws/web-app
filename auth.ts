import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prisma'
import Google from 'next-auth/providers/google'
import { PrismaClient } from './app/generated/prisma/client'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from "bcrypt"

type User = {
  id: string;
  name: string;
  email: string | null;
  emailVerified: boolean | null;
  username: string | null;
  image: string | null;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as unknown as {prisma: PrismaClient}),
  providers: [
    Google,
    Credentials({
      name: "Credentionals",
      credentials: {
        password: {label: "Password", type: "password"},
        identifier: {label: "Email or Username", type: "text"},
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials.password) 
          return null;

        const identifier = String(credentials.identifier).toLowerCase().trim();

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { username: identifier },
            ]
          }
        });
        
        if (!user || !user.passwordHash)
          return null;
        
        const pwValid = await bcrypt.compare(String(credentials.password), user.passwordHash!);
        if (!pwValid) 
          return null;
        
        return {
          id: user.id,
          name: user.name,  
          email: user.email,
          emailVerified: user.emailVerified,
          username: user.username,
          image: user.image
        } as User;
      }
    })
  ],
  callbacks: {
    async jwt({token, user, trigger}) {
      if (trigger === "signUp") {
        console.log("User signed up", `Hello, ${user?.name}!`)
      }
      if (trigger === "signIn") {
        console.log("User signed in", `Welcome back, ${user?.name}!`)
      }
      if (user) {
        const usr = user as User;
        token.id = usr.id;
        token.name = usr.name;
        token.username = usr.username;
        token.image = usr.image;
        token.emailVerified = usr.emailVerified;
      }
      return token;
    },
    async session({session, token}) {
      if (session.user) {
        const usr = session.user as User;
        usr.id = token.id as string;
        usr.name = token.name as string;
        usr.username = token.username as string;
        usr.image = token.image as string;
        usr.emailVerified = token.emailVerified as boolean;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/error"
  }
})