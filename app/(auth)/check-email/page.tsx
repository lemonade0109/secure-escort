import GlowBackground from "@/components/shared/glow-background";
import React, { Suspense } from "react";
import CheckEmailForm from "./check-email-form";

export default function CheckEmailPage() {
  return (
    <div className="custom-bg">
      <GlowBackground intensity="medium" />

      <Suspense>
        <CheckEmailForm />
      </Suspense>
    </div>
  );
}
