import { z } from "zod";

export const PROFILE_BIO_MAX_LENGTH = 400;

export const profileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name cannot be empty")
    .max(50, "Name cannot be longer than 50 characters"),
  bio: z
    .string()
    .trim()
    .max(
      PROFILE_BIO_MAX_LENGTH,
      "Bio cannot be longer than " + PROFILE_BIO_MAX_LENGTH + " characters",
    ),
});

export const profileBioSchema = profileFormSchema.shape.bio;

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
