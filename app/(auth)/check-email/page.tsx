import GlowBackground from "@/components/shared/glow-background";
import React from "react";
import CheckEmailForm from "./check-email-form";

export default function CheckEmailPage() {
  return (
    <div className="custom-bg">
      <GlowBackground intensity="medium" />

      <CheckEmailForm />
    </div>
  );
}
