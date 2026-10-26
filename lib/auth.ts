import { dash } from "@better-auth/infra";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { renderChangeEmailConfirmation } from "@/emails/change-email-confirmation-template";
import { getEmailTranslator } from "@/emails/config/get-email-translator";
import {
  EMAIL_VERIFICATION_LINK_EXPIRES_IN_SECONDS,
  RESET_PASSWORD_LINK_EXPIRES_IN_SECONDS,
} from "@/emails/config/link-expiry";
import { renderResetPasswordEmail } from "@/emails/reset-password-template";
import { renderVerificationEmail } from "@/emails/verification-template";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "@/lib/config/auth";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  localeSchema,
  resolveLocale,
} from "@/lib/config/locales";
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
    // The same limits as the forms (lib/config/auth.ts).
    minPasswordLength: PASSWORD_MIN_LENGTH,
    maxPasswordLength: PASSWORD_MAX_LENGTH,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: RESET_PASSWORD_LINK_EXPIRES_IN_SECONDS,
    // /api/auth has no [locale] segment, so every auth email is written in
    // the language stored on the user. Better Auth types `user` without
    // additional fields, but the object is the full database row (or the
    // session user), so `locale` is there at runtime and resolveLocale
    // checks it.
    sendResetPassword: async ({ user, url }): Promise<void> => {
      const locale = resolveLocale("locale" in user ? user.locale : undefined);
      const t = getEmailTranslator(locale);
      const { subject, html, text } = await renderResetPasswordEmail({
        linkExpiresInSeconds: RESET_PASSWORD_LINK_EXPIRES_IN_SECONDS,
        locale,
        t,
        url,
      });

      void sendAuthEmail({ to: user.email, subject, html, text });
    },
  },

  emailVerification: {
    expiresIn: EMAIL_VERIFICATION_LINK_EXPIRES_IN_SECONDS,
    sendVerificationEmail: async ({ user, url }): Promise<void> => {
      const locale = resolveLocale("locale" in user ? user.locale : undefined);
      const t = getEmailTranslator(locale);
      const { subject, html, text } = await renderVerificationEmail({
        linkExpiresInSeconds: EMAIL_VERIFICATION_LINK_EXPIRES_IN_SECONDS,
        locale,
        t,
        url,
      });

      void sendAuthEmail({ to: user.email, subject, html, text });
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
        const locale = resolveLocale(
          "locale" in user ? user.locale : undefined,
        );
        const t = getEmailTranslator(locale);
        const { subject, html, text } = await renderChangeEmailConfirmation({
          linkExpiresInSeconds: EMAIL_VERIFICATION_LINK_EXPIRES_IN_SECONDS,
          locale,
          newEmail,
          t,
          url,
        });

        void sendAuthEmail({ to: user.email, subject, html, text });
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
      // A user setting like bio, so users may change it through updateUser;
      // the validator rejects anything that is not a supported locale.
      locale: {
        type: "string",
        required: false,
        defaultValue: DEFAULT_LOCALE,
        validator: {
          input: localeSchema,
        },
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Email and Google sign-up both create the user here. The guest's
        // language cookie comes first: Better Auth has already filled
        // user.locale (a sign-up body value or the "en" default), so the
        // cookie also beats a locale sent in the body. To let the body win,
        // read context.body.locale before the cookie.
        before: async (user, context) => {
          const cookieLocale = context?.getCookie(LOCALE_COOKIE_NAME);

          return {
            data: { ...user, locale: resolveLocale(cookieLocale, user.locale) },
          };
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

  plugins: [
    username({
      minUsernameLength: USERNAME_MIN_LENGTH,
      maxUsernameLength: USERNAME_MAX_LENGTH,
    }),
    dash(),
    nextCookies(),
  ],
});
