"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

const VerifyButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full bg-gold hover:bg-gold/90 text-black"
      disabled={pending}
    >
      {pending ? "Verifying..." : "Verify Email"}
    </Button>
  );
};

export default VerifyButton;
