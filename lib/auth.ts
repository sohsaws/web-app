import { dash } from "@better-auth/infra";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { renderChangeEmailConfirmation } from "@/emails/change-email-confirmation-template";
import { renderResetPasswordEmail } from "@/emails/reset-password-template";
import { renderVerificationEmail } from "@/emails/verification-template";
import { profileBioSchema } from "@/lib/config/profile";
import { deleteUserBlobs } from "@/lib/data/delete-user-blobs";
import { sendAuthEmail } from "@/lib/email/send-auth-email";
import prisma from "./prisma";

// One source for the public app URL, so the auth base URL and the Google
// redirect always point to the same origin.
const appBaseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  appName: "Swiipy",
  baseUrl: appBaseUrl,

  session: {
    expiresIn: 60 * 60 * 24 * 14,
    updateAge: 60 * 60 * 24,
  },

  emailAndPassword: {
    enabled: true,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    sendResetPassword: async ({ user, url }): Promise<void> => {
      const { html, text } = await renderResetPasswordEmail(url);

      void sendAuthEmail({
        to: user.email,
        subject: "Reset your Swiipy password",
        html,
        text,
      });
    },
  },

  emailVerification: {
    expiresIn: 60 * 60,
    sendVerificationEmail: async ({ user, url }): Promise<void> => {
      const { html, text } = await renderVerificationEmail(url);

      void sendAuthEmail({
        to: user.email,
        subject: "Verify your Swiipy email",
        html,
        text,
      });
    },
  },

  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: async (user): Promise<void> => {
        await deleteUserBlobs(user.id, user.image);
      },
    },
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

        void sendAuthEmail({
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
      // Must match an "Authorized redirect URI" in the Google Cloud Console.
      redirectURI: `${appBaseUrl}/api/auth/callback/google`,
    },
  },

  plugins: [username(), dash(), nextCookies()],
});
