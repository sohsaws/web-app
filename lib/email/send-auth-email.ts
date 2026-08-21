import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const authEmailSender =
  process.env.RESEND_FROM_EMAIL ?? "Swiipy <onboarding@resend.dev>";

interface SendAuthEmailOptions {
  html: string;
  subject: string;
  text: string;
  to: string;
}

export async function sendAuthEmail({
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
