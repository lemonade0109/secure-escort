"use server";

import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import PasswordResetEmail from "@/email/password-reset-email";

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  firstName?: string
) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  try {
    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_USER;
    const senderName = process.env.SENDER_NAME || "Secure Escort";

    // Render the React email component to HTML
    const emailHtml = await render(
      <PasswordResetEmail resetUrl={resetUrl} userName={firstName} />
    );

    // Send the email
    const info = await transporter.sendMail({
      from: `${senderName} <${senderEmail}>`,
      to: email,
      subject: "Reset Your Password - Secure Escort",
      html: emailHtml,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send password reset email to ${email}:`, error);
    throw error;
  }
};
