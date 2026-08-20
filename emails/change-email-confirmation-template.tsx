import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { pretty, render, toPlainText } from "@react-email/render";
import type { ReactElement } from "react";

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
    <Html lang="en">
      <Head />
      <Preview>Confirm your Swiipy email change</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brand}>Swiipy</Text>
          <Section style={styles.card}>
            <Heading as="h1" style={styles.heading}>
              Confirm your email change
            </Heading>
            <Text style={styles.text}>
              A request was made to change your Swiipy email address to{" "}
              <strong>{newEmail}</strong>.
            </Text>
            <Text style={styles.text}>
              Confirm this request first. We will then send a verification link
              to the new address.
            </Text>
            <Button href={url} style={styles.button}>
              Confirm email change
            </Button>
            <Text style={styles.mutedText}>
              If you did not request this change, do not click the button and
              secure your account.
            </Text>
          </Section>
          <Text style={styles.footer}>
            This confirmation link expires in one hour.
          </Text>
        </Container>
      </Body>
    </Html>
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

export default ChangeEmailConfirmationEmail;

const styles = {
  body: {
    backgroundColor: "#f3f4f6",
    fontFamily: "Arial, Helvetica, sans-serif",
    margin: "0",
    padding: "32px 16px",
  },
  button: {
    backgroundColor: "#17191f",
    borderRadius: "8px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "16px",
    fontWeight: "600",
    margin: "16px 0 24px",
    padding: "14px 24px",
    textDecoration: "none",
  },
  brand: {
    color: "#17191f",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "20px",
    fontWeight: "700",
    margin: "0 0 16px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "48px 40px",
    textAlign: "center" as const,
  },
  container: {
    margin: "0 auto",
    maxWidth: "640px",
  },
  footer: {
    color: "#7a7f89",
    fontSize: "11px",
    margin: "24px 0 0",
    textAlign: "center" as const,
  },
  heading: {
    color: "#17191f",
    fontSize: "28px",
    lineHeight: "36px",
    margin: "0 0 24px",
  },
  mutedText: {
    color: "#7a7f89",
    fontSize: "13px",
    lineHeight: "20px",
    margin: "0",
  },
  text: {
    color: "#363a44",
    fontSize: "16px",
    lineHeight: "26px",
    margin: "0 0 16px",
  },
};
