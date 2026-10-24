import type { ReactNode } from "react";
import type { EmailTranslator } from "./email-translator";

// The translated text of one auth email. Templates only lay it out, so the
// language is decided before rendering.
export interface AuthEmailCopy {
  body: ReactNode;
  button: string;
  expiry: string;
  heading: string;
  ignoreNotice: ReactNode;
  label: string;
  preview: string;
}

export interface RenderedAuthEmail {
  html: string;
  subject: string;
  text: string;
}

export function getIgnoreNotice(t: EmailTranslator): ReactNode {
  return t.rich("common.ignoreNotice", { br: () => <br /> });
}
