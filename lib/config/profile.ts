
import * as z from 'zod';

const PROFILE_BIO_MAX_LENGTH = 400;

export const profileBioSchema = z
  .string()
  .trim()
  .max(
    PROFILE_BIO_MAX_LENGTH,
    `Bio cannot be longer than ${PROFILE_BIO_MAX_LENGTH} characters`,
);
