import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { Resend } from "resend";
import { renderChangeEmailConfirmation } from "@/emails/change-email-confirmation-template";
import { renderVerificationEmail } from "@/emails/verification-template";
import { profileBioSchema } from "@/lib/config/profile";
import prisma from "./prisma";

const resend = new Resend(process.env.RESEND_API_KEY);
const authEmailSender =
  process.env.RESEND_FROM_EMAIL ?? "Swiipy <onboarding@resend.dev>";

interface SendAuthEmailOptions {
  html: string;
  subject: string;
  text: string;
  to: string;
}

async function sendAuthEmail({
  html,
  subject,
  text,
  to,
}: SendAuthEmailOptions): Promise<void> {
  const { error } = await resend.emails.send({
    from: authEmailSender,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error("Failed to send authentication email", {
      cause: error,
    });
  }
}

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

      await sendAuthEmail({
        to: user.email,
        subject: "Verify your Swiipy email",
        html,
        text,
      });
    },
  },

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({
        user,
        newEmail,
        url,
      }): Promise<void> => {
        const { html, text } = await renderChangeEmailConfirmation({
          newEmail,
          url,
        });

        await sendAuthEmail({
          to: user.email,
          subject: "Confirm your Swiipy email change",
          html,
          text,
        });
      },
    },
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
