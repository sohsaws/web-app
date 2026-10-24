import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { pretty, render, toPlainText } from "@react-email/render";
import type { ReactElement } from "react";
import type { Locale } from "@/lib/config/locales";
import {
  type AuthEmailCopy,
  getIgnoreNotice,
  type RenderedAuthEmail,
} from "./config/auth-email-copy";
import { emailTailwindConfig } from "./config/email-tailwind";
import type { EmailTranslator } from "./config/email-translator";
import { toExpiryMinutes } from "./config/link-expiry";
import { previewEmailTranslator } from "./config/preview-email-translator";

interface VerificationEmailProps {
  copy: AuthEmailCopy;
  locale: Locale;
  url: string;
}

interface RenderVerificationEmailOptions {
  linkExpiresInSeconds: number;
  locale: Locale;
  t: EmailTranslator;
  url: string;
}

export function VerificationEmail({
  copy,
  locale,
  url,
}: VerificationEmailProps): ReactElement {
  return (
    <Tailwind config={emailTailwindConfig}>
      <Html lang={locale}>
        <Head />
        <Body className="bg-bg-2 m-0 text-center font-sans">
          <Preview>{copy.preview}</Preview>
          <Container className="mobile:mt-0 mx-auto mt-8 w-full max-w-160">
            <Section>
              <Section className="bg-bg mobile:px-2 px-6 py-4">
                <Section className="mb-3 px-6">
                  <Row>
                    <Column className="w-1/2 py-1.75 align-middle">
                      <Text className="font-20 text-fg m-0 text-left font-serif font-bold">
                        Swiipy
                      </Text>
                    </Column>
                    <Column
                      align="right"
                      className="w-1/2 py-1.75 align-middle"
                    >
                      <Text className="font-13 m-0 text-right font-sans">
                        <span className="text-fg-3">{copy.label}</span>
                      </Text>
                    </Column>
                  </Row>
                </Section>

                <Section className="bg-bg-2 mobile:px-6 mobile:py-12 rounded-lg px-10 py-16 text-center">
                  <Section className="mb-3">
                    <Text
                      aria-hidden="true"
                      className="font-24 text-fg mx-auto mb-7 h-12 w-12 rounded-full border-2 border-solid border-fg text-center font-serif font-bold leading-[48px]"
                    >
                      S
                    </Text>
                    <Heading as="h1" className="font-28 text-fg m-0 font-sans">
                      {copy.heading}
                    </Heading>
                  </Section>

                  <Text className="font-16 text-fg-2 mx-auto mt-0 mb-8 max-w-95 text-center font-sans">
                    {copy.body}
                  </Text>

                  <Section className="mb-6 text-center">
                    <Button
                      href={url}
                      className="bg-fg font-16 text-fg-inverted inline-block rounded-lg px-7 py-4 text-center font-sans leading-6"
                    >
                      {copy.button}
                    </Button>
                  </Section>

                  <Text className="font-13 text-fg-3 mx-auto mt-8 mb-0 max-w-100 text-center font-sans">
                    {copy.ignoreNotice}
                  </Text>
                </Section>

                <Section className="bg-bg">
                  <Text className="font-11 text-fg-3 m-0 px-6 py-8 text-center font-sans">
                    {copy.expiry}
                  </Text>
                </Section>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

export function getVerificationEmailCopy(
  t: EmailTranslator,
  linkExpiresInSeconds: number,
): AuthEmailCopy {
  return {
    preview: t("verification.preview"),
    label: t("verification.label"),
    heading: t("verification.heading"),
    body: t("verification.body"),
    button: t("verification.button"),
    ignoreNotice: getIgnoreNotice(t),
    expiry: t("verification.expiry", {
      minutes: toExpiryMinutes(linkExpiresInSeconds),
    }),
  };
}

export async function renderVerificationEmail({
  linkExpiresInSeconds,
  locale,
  t,
  url,
}: RenderVerificationEmailOptions): Promise<RenderedAuthEmail> {
  const copy = getVerificationEmailCopy(t, linkExpiresInSeconds);
  const html = await pretty(
    await render(<VerificationEmail copy={copy} locale={locale} url={url} />),
  );

  return {
    subject: t("verification.subject"),
    html,
    text: toPlainText(html),
  };
}

VerificationEmail.PreviewProps = {
  copy: getVerificationEmailCopy(previewEmailTranslator, 60 * 60),
  locale: "en",
  url: "https://example.com/verify-email",
} satisfies VerificationEmailProps;
