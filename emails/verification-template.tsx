import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { getBaseUrl } from "@/lib/utils/baseUrl";

const CONTACT_EMAIL_ADDRESS = process.env.BASE_EMAIL_ADDRESS;

const baseUrl = getBaseUrl();

interface VerificationTemplateProps {
  username: string;
  emailVerificationToken: string;
}

export const VerificationTemp = ({
  username,
  emailVerificationToken,
}: VerificationTemplateProps) => {
  return (
    <Html>
      <Head>
        <Preview>Please, verify your email</Preview>
      </Head>
      <Body style={main}>
        <Container style={container}>
          <Img style={logo} />
          <Section style={section}>
            <Text style={text}>Hello, {username}!</Text>
            <Text style={textStyle}>
              Please verify your email address by clicking the button below.
            </Text>
            <Button
              style={buttonStyle}
              href={`${baseUrl}/verify-email?token=${emailVerificationToken}`}
            >
              Verify Email
            </Button>
            <Text style={textStyle}>
              If you did not request this verification, please ignore this
              email.
            </Text>
          </Section>
          <Hr style={hrStyle} />
          <Section style={footer}>
            <Text style={footerText}>
              This email was sent to you by Swiipy. If you have any questions,
              please contact us at {CONTACT_EMAIL_ADDRESS}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#000000",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  padding: "20px",
};

const logo = {
  width: "100px",
  height: "100px",
  margin: "0 auto",
};

const section = {
  margin: "20px 0",
};

const text = {
  fontSize: "16px",
  color: "#ffffff",
};

const textStyle = {
  fontSize: "16px",
  color: "#ffffff",
};

const buttonStyle = {
  backgroundColor: "#ffffff",
  color: "#000000",
  padding: "10px 20px",
  borderRadius: "4px",
  textDecoration: "none",
  display: "inline-block",
};

const hrStyle = {
  margin: "20px 0",
  borderColor: "#ffffff",
};

const footer = {
  margin: "20px 0",
};

const footerText = {
  fontSize: "12px",
  color: "#ffffff",
};
