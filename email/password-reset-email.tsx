import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface PasswordResetEmailProps {
  resetUrl: string;
  userName?: string;
}

export default function PasswordResetEmail({
  resetUrl,
  userName = "User",
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password for Secure Escort</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerSectionStyle}>
            <Text style={logoStyle}>Secure Escort</Text>
          </Section>
          <Section>
            <Text style={greetingStyle}>Hello {userName},</Text>
            <Text style={messageStyle}>
              We received a request to reset your password. Click the button
              below to set a new password. If you did not request this, you can
              safely ignore this email.
            </Text>
            <Button href={resetUrl} style={buttonStyle}>
              Reset Password
            </Button>
            <Text style={footerNoteStyle}>
              For your security, this link will expire in 1 hour.
            </Text>
          </Section>
          <Section style={footerSectionStyle}>
            <Text style={footerTextStyle}>
              &copy; {new Date().getFullYear()} Secure Escort. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// --- Styles ---
const bodyStyle = {
  backgroundColor: "#f6f6f6",
  fontFamily: '"Geist Sans", Arial, sans-serif',
  margin: 0,
  padding: 0,
};

const containerStyle = {
  maxWidth: 600,
  margin: "40px auto",
  background: "#fff",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  padding: 32,
};

const headerSectionStyle = {
  textAlign: "center" as const,
  marginBottom: 32,
};

const logoStyle = {
  fontSize: 32,
  fontWeight: "bold" as const,
  color: "#d4a017",
  margin: 0,
  letterSpacing: 1,
};

const greetingStyle = {
  fontSize: 20,
  fontWeight: 600 as const,
  marginBottom: 8,
  color: "#222",
};

const messageStyle = {
  fontSize: 16,
  marginBottom: 24,
  color: "#222",
};

const buttonStyle = {
  backgroundColor: "#d4a017",
  color: "#fff",
  fontSize: 16,
  padding: "14px 32px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: 600 as const,
  border: "none",
  display: "inline-block",
  marginBottom: 24,
  letterSpacing: 1,
};

const footerNoteStyle = {
  fontSize: 14,
  color: "#888",
  marginTop: 24,
};

const footerSectionStyle = {
  marginTop: 40,
  borderTop: "1px solid #eee",
  paddingTop: 16,
};

const footerTextStyle = {
  fontSize: 12,
  color: "#aaa",
  textAlign: "center" as const,
};
