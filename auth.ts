import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prisma'
import Google from 'next-auth/providers/google'
import { PrismaClient } from './app/generated/prisma/client'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from "bcrypt"


export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as unknown as {prisma: PrismaClient}),
  providers: [
    Google,
    Credentials({
      name: "Credentionals",
      credentials: {
        password: {label: "Password", type: "password"},
        email: {label: "Email", type: "email"},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) 
          return null;

        const email = String(credentials.email);

        const user = await prisma.user.findUnique({
          where: {email: email}
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
        };
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
        token.id = user.id;
        token.name = user.name;
      }
      
      console.log("JWT Callback Check:", { tokenId: token.id, userExists: !!user, trigger });
      return token;
    },
    async session({session, token}) {
      console.log("Session Callback Check:", { sessionUser: session.user, tokenId: token.id });
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
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