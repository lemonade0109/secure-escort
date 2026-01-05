import React from "react";
import { Metadata } from "next";
import ResetPasswordForm from "./reset-password-form";
import GlowBackground from "@/components/shared/glow-background";

export const metadata: Metadata = {
  title: "Reset Password - Secure Escort",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <div className=" custom-bg">
      <GlowBackground intensity="medium" />

      <ResetPasswordForm token={token || ""} />
    </div>
  );
}
