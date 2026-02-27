import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prisma'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from "bcrypt"


export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as any),
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
          username: user.username,
          image: user.image,
          emailVerified: user.emailVerified,
        };
      }
    })
  ],
  callbacks: {
    async jwt({token, user, trigger, session}) {
      if (trigger === "signUp") {
        console.log("User signed up", `Hello, ${user?.name}!`)
      }
      if (trigger === "signIn") {
        console.log("User signed in", `Welcome back, ${user?.name}!`)
      }
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.emailVerified = session.user.emailVerified;
      }
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.username = user.username;
        token.image = user.image;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({session, token}) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.emailVerified = token.emailVerified as Date;
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