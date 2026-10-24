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

interface ChangeEmailConfirmationProps {
  copy: AuthEmailCopy;
  locale: Locale;
  url: string;
}

interface ChangeEmailConfirmationCopyOptions {
  linkExpiresInSeconds: number;
  newEmail: string;
}

interface RenderChangeEmailConfirmationOptions
  extends ChangeEmailConfirmationCopyOptions {
  locale: Locale;
  t: EmailTranslator;
  url: string;
}

export function ChangeEmailConfirmationEmail({
  copy,
  locale,
  url,
}: ChangeEmailConfirmationProps): ReactElement {
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

export function getChangeEmailConfirmationCopy(
  t: EmailTranslator,
  { linkExpiresInSeconds, newEmail }: ChangeEmailConfirmationCopyOptions,
): AuthEmailCopy {
  return {
    preview: t("changeEmail.preview"),
    label: t("changeEmail.label"),
    heading: t("changeEmail.heading"),
    body: t.rich("changeEmail.body", {
      newEmail,
      strong: (chunks) => <strong>{chunks}</strong>,
    }),
    button: t("changeEmail.button"),
    ignoreNotice: getIgnoreNotice(t),
    expiry: t("changeEmail.expiry", {
      minutes: toExpiryMinutes(linkExpiresInSeconds),
    }),
  };
}

export async function renderChangeEmailConfirmation({
  linkExpiresInSeconds,
  locale,
  newEmail,
  t,
  url,
}: RenderChangeEmailConfirmationOptions): Promise<RenderedAuthEmail> {
  const copy = getChangeEmailConfirmationCopy(t, {
    linkExpiresInSeconds,
    newEmail,
  });
  const html = await pretty(
    await render(
      <ChangeEmailConfirmationEmail copy={copy} locale={locale} url={url} />,
    ),
  );

  return {
    subject: t("changeEmail.subject"),
    html,
    text: toPlainText(html),
  };
}

ChangeEmailConfirmationEmail.PreviewProps = {
  copy: getChangeEmailConfirmationCopy(previewEmailTranslator, {
    linkExpiresInSeconds: 60 * 60,
    newEmail: "new-email@example.com",
  }),
  locale: "en",
  url: "https://example.com/confirm-email-change",
} satisfies ChangeEmailConfirmationProps;
