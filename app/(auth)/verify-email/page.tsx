import { Metadata } from "next";
import VerifyEmailClientSide from "./verify-email-clientside";

export const metadata: Metadata = {
  title: "Verify Email - Secure Escort",
  description: "Verify your email address for Secure Escort account.",
};

export default async function VerifyEmailPage() {
  return <VerifyEmailClientSide />;
}
