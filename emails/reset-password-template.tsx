import {
	Body,
	Button,
	Container,
	Head,
	Hr,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";

const CONTACT_EMAIL_ADDRESS = process.env.BASE_EMAIL_ADDRESS;
const baseUrl =  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:3000";

interface ChangePasswordTemplateProps {
	username: string;
	passwordResetToken: string;
}

export const PasswordResetTemp = ({
	username,
	passwordResetToken,
}: ChangePasswordTemplateProps) => {
	return (
		<Html>
			<Head>
				<Preview>Confirm your Swiipy email change</Preview>
			</Head>
			<Body style={main}>
				<Container style={container}>
					<Section style={section}>
						<Text style={text}>Hello, {username}!</Text>
						<Text style={textMuted}>
							You requested to reset your password on your Swiipy account. Click
							the button below to confirm this request and reset your new
							password.
						</Text>
						<Button
							style={buttonStyle}
							href={`${baseUrl}/change-password?token=${passwordResetToken}`}
						>
							Confirm Password Reset
						</Button>
						<Text style={textMuted}>
							If you did not request this, please secure your account
							immediately — someone may have access to it.
						</Text>
					</Section>
					<Hr style={hrStyle} />
					<Section style={footer}>
						<Text style={footerText}>
							This email was sent to you by Swiipy. Questions? Contact us at{" "}
							{CONTACT_EMAIL_ADDRESS}
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

const section = {
	margin: "20px 0",
};

const text = {
	fontSize: "16px",
	color: "#ffffff",
};

const textMuted = {
	fontSize: "14px",
	color: "#a3a3a3",
	lineHeight: "1.6",
};

const buttonStyle = {
	backgroundColor: "#ffffff",
	color: "#000000",
	padding: "10px 20px",
	borderRadius: "4px",
	textDecoration: "none",
	display: "inline-block",
	fontWeight: "600",
	margin: "12px 0",
};

const hrStyle = {
	margin: "20px 0",
	borderColor: "#2a2a2a",
};

const footer = {
	margin: "20px 0",
};

const footerText = {
	fontSize: "12px",
	color: "#525252",
};
