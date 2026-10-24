import { z } from "zod";

export const PROFILE_NAME_MAX_LENGTH = 50;
export const PROFILE_BIO_MAX_LENGTH = 2000;

// Messages are keys of the Validation namespace, translated where they are
// shown, because this schema also runs on the server and in Better Auth.
export const profileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "nameRequired")
    .max(PROFILE_NAME_MAX_LENGTH, "nameTooLong"),
  bio: z.string().trim().max(PROFILE_BIO_MAX_LENGTH, "bioTooLong"),
});

export const profileBioSchema = profileFormSchema.shape.bio;

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
