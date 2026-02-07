import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prisma'
import Google from 'next-auth/providers/google'
import { PrismaClient } from '../app/generated/prisma/client'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from "bcrypt"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as unknown as {prisma: PrismaClient}),
  providers: [
    Credentials({
      credentials: {
        password: {label: "password", type: "password", placeholder: "••••••••"},
        email: {label: "email", type: "email", placeholder: "name@example.com"},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) { 
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {email: credentials.email as string}
        });
        console.log(user?.email, credentials.email, user?.passwordHash, credentials.password)
        
        if (!user) { return null; }

        const pwValid = await bcrypt.compare(credentials.password as string, user.passwordHash as string);
        if (!pwValid) { return null; }

        return {
          id: user.id, 
          email: user.email,
          name: user.name
        };
      }
    }),  
    Google
  ],
})