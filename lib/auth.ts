import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { Resend } from "resend";
import { renderVerificationEmail } from "@/emails/verification-template";
import { profileBioSchema } from "@/lib/entities/profile";
import prisma from "./prisma";

const resend = new Resend(process.env.RESEND_API_KEY);
const verificationEmailSender =
  process.env.RESEND_FROM_EMAIL ?? "Swiipy <onboarding@resend.dev>";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  emailVerification: {
    expiresIn: 60 * 60,
    sendVerificationEmail: async ({ user, url }): Promise<void> => {
      const { html, text } = await renderVerificationEmail(url);

      const { error } = await resend.emails.send({
        from: verificationEmailSender,
        to: user.email,
        subject: "Verify your Swiipy email",
        html,
        text,
      });

      if (error) {
        throw new Error("Failed to send verification email", {
          cause: error,
        });
      }
    },
  },

  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
        validator: {
          input: profileBioSchema,
        },
      },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: "http://localhost:3000/api/auth/callback/google",
    },
  },

  plugins: [username(), nextCookies()],
});
