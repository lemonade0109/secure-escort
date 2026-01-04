import GlowBackground from "@/components/shared/glow-background";
import React from "react";
import CheckEmailForm from "./check-email-form";

export default function CheckEmailPage() {
  return (
    <div className="relative custom-bg overflow-hidden ">
      <GlowBackground intensity="medium" />

      <CheckEmailForm />
    </div>
  );
}
