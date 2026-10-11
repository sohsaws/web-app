import { z } from "zod";

const contactEmailSchema = z.email();

// The public contact address comes from the committed .env (Vercel can
// override it). A missing or malformed value fails loudly instead of
// rendering an empty mailto link; on the static /contact page that means the
// build fails.
export function getContactEmail(): string {
  const result = contactEmailSchema.safeParse(
    process.env.CONTACT_EMAIL_ADDRESS,
  );

  if (!result.success) {
    throw new Error("CONTACT_EMAIL_ADDRESS must be a valid email address");
  }

  return result.data;
}
