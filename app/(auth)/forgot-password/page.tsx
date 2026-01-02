import React from "react";
import { Metadata } from "next";
import GlowBackground from "@/components/shared/glow-background";
import ForgotPasswordForm from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password - Secure Escort",
};

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-screen bg-[#070A12] flex items-center justify-center px-6 overflow-hidden ">
      <GlowBackground intensity="medium" />

      <ForgotPasswordForm />
    </div>
  );
}
