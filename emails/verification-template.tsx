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

interface VerificationEmailProps {
  url: string;
}

interface RenderedVerificationEmail {
  html: string;
  text: string;
}

export function VerificationEmail({
  url,
}: VerificationEmailProps): ReactElement {
  return (
    <Tailwind config={emailTailwindConfig}>
      <Html lang="en">
        <Head />
        <Body className="bg-bg-2 m-0 text-center font-sans">
          <Preview>Confirm your email address</Preview>
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
                        <span className="text-fg-3">Email verification</span>
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
                      Confirm your email
                    </Heading>
                  </Section>

                  <Text className="font-16 text-fg-2 mx-auto mt-0 mb-8 max-w-95 text-center font-sans">
                    Use the button below to confirm that this email address
                    belongs to you.
                  </Text>

                  <Section className="mb-6 text-center">
                    <Button
                      href={url}
                      className="bg-fg font-16 text-fg-inverted inline-block rounded-lg px-7 py-4 text-center font-sans leading-6"
                    >
                      Confirm email
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
                    This verification link expires in one hour.
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

export async function renderVerificationEmail(
  url: string,
): Promise<RenderedVerificationEmail> {
  const html = await pretty(await render(<VerificationEmail url={url} />));
  const text = toPlainText(html);

  return {
    html,
    text,
  };
}

VerificationEmail.PreviewProps = {
  url: "https://example.com/verify-email",
};
