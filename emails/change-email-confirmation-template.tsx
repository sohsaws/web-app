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
import { emailTailwindConfig } from "./config/email-tailwind";

interface ChangeEmailConfirmationProps {
  newEmail: string;
  url: string;
}

interface RenderedChangeEmailConfirmation {
  html: string;
  text: string;
}

export function ChangeEmailConfirmationEmail({
  newEmail,
  url,
}: ChangeEmailConfirmationProps): ReactElement {
  return (
    <Tailwind config={emailTailwindConfig}>
      <Html lang="en">
        <Head />
        <Body className="bg-bg-2 m-0 text-center font-sans">
          <Preview>Confirm your Swiipy email change</Preview>
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
                        <span className="text-fg-3">Email change</span>
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
                      Change your email
                    </Heading>
                  </Section>

                  <Text className="font-16 text-fg-2 mx-auto mt-0 mb-8 max-w-95 text-center font-sans">
                    We received a request to change your Swiipy email address to{" "}
                    <strong>{newEmail}</strong>. Confirm this request first; we
                    will then verify the new address.
                  </Text>

                  <Section className="mb-6 text-center">
                    <Button
                      href={url}
                      className="bg-fg font-16 text-fg-inverted inline-block rounded-lg px-7 py-4 text-center font-sans leading-6"
                    >
                      Continue email change
                    </Button>
                  </Section>

                  <Text className="font-13 text-fg-3 mx-auto mt-8 mb-0 max-w-100 text-center font-sans">
                    If you didn&apos;t request this,
                    <br />
                    please ignore this email.
                  </Text>
                </Section>

                <Section className="bg-bg">
                  <Text className="font-11 text-fg-3 m-0 px-6 py-8 text-center font-sans">
                    This confirmation link expires in one hour.
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

export async function renderChangeEmailConfirmation({
  newEmail,
  url,
}: ChangeEmailConfirmationProps): Promise<RenderedChangeEmailConfirmation> {
  const html = await pretty(
    await render(
      <ChangeEmailConfirmationEmail newEmail={newEmail} url={url} />,
    ),
  );

  return {
    html,
    text: toPlainText(html),
  };
}

ChangeEmailConfirmationEmail.PreviewProps = {
  newEmail: "new-email@example.com",
  url: "https://example.com/confirm-email-change",
} satisfies ChangeEmailConfirmationProps;

