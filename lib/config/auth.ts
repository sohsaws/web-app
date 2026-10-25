// One set of auth field limits for the forms (Zod schemas and their error
// texts) and for Better Auth in lib/auth.ts, so the sign-up and password
// forms never accept a value the server rejects. Sign-in allows the longer
// email length for both kinds of identifier.

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 40;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

// The longest address the email standard allows (RFC 5321).
export const EMAIL_MAX_LENGTH = 254;

// Sign-in accepts an email or a username, so the identifier spans both.
export const LOGIN_IDENTIFIER_MIN_LENGTH = USERNAME_MIN_LENGTH;
export const LOGIN_IDENTIFIER_MAX_LENGTH = EMAIL_MAX_LENGTH;
