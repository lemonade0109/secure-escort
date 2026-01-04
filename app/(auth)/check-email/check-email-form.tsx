"use client";
import FormContainer from "@/components/shared/form/form-container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resendVerificationEmailAction } from "@/lib/actions/auth/resend-email-verification";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useFormStatus } from "react-dom";

function ResendBtn() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-gold hover:bg-gold/90 text-black"
    >
      {pending ? "Sending..." : "Resend verification link"}
    </Button>
  );
}

const CheckEmailForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <Card className="custom-card">
      <CardHeader>
        <CardTitle>
          <h1 className="font-semibold text-3xl">
            Didn&apos;t receive the email?
          </h1>
        </CardTitle>

        <CardDescription>
          <p className="text-sm text-white/70">
            {" "}
            Click below and we&apos;ll send you a fresh verification link.
          </p>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FormContainer action={resendVerificationEmailAction}>
          {(state) => (
            <>
              <input type="hidden" name="email" value={email} />
              <ResendBtn />

              {state?.message ? (
                <p
                  className={`text-sm text-center ${state?.success ? "text-green-400" : "text-red-400"}`}
                >
                  {String(state.message)}
                </p>
              ) : null}
            </>
          )}
        </FormContainer>
      </CardContent>
    </Card>
  );
};

export default CheckEmailForm;
