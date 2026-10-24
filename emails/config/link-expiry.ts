// One source for how long auth links live: lib/auth.ts passes these to
// Better Auth, and the emails state the same expiry. The change-email
// confirmation link uses the verification expiry.
export const RESET_PASSWORD_LINK_EXPIRES_IN_SECONDS = 60 * 60;
export const EMAIL_VERIFICATION_LINK_EXPIRES_IN_SECONDS = 60 * 60;

// Messages count minutes, so an expiry that is not a whole hour still reads
// correctly ("expires in 30 minutes").
export function toExpiryMinutes(expiresInSeconds: number): number {
  return Math.round(expiresInSeconds / 60);
}
