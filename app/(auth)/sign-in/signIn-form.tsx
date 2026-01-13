"use client";
import FormContainer from "@/components/shared/form/form-container";
import FormInput from "@/components/shared/form/form-input";
import PasswordInput from "@/components/shared/form/password-input";
import { Button } from "@/components/ui/button";
import { signInAction } from "@/lib/actions/auth/signin";
import { asStringMessage } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useFormStatus } from "react-dom";

const SignInForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button
        type="submit"
        disabled={pending}
        className="w-full mt-2 text-black bg-gold hover:bg-gold/90"
      >
        {pending ? "Signing In..." : "Sign In"}
      </Button>
    );
  };
  return (
    <FormContainer className="space-y-4" action={signInAction}>
      {(data) => {
        const result = data as { success: boolean; message?: unknown };
        return (
          <>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            <FormInput
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              className="text-xs"
            />
            <div className="space-y-2" />
            <PasswordInput
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              className="text-xs"
            />
            <div className="space-y-2" />

            <SignInButton />

            {result?.success === false && (
              <div className="text-sm text-center text-destructive sm:text-base">
                {asStringMessage(result.message)}
              </div>
            )}

            <div className="flex flex-col justify-center text-sm text-center text-muted-foreground sm:text-base">
              <span>
                <Link
                  href="/forgot-password"
                  className="hover:underline text-gold"
                >
                  Forgot your password?
                </Link>
              </span>

              <span>
                Don&apos;t have an account?{" "}
                <Link href={"/sign-up"} className="text-gold hover:underline">
                  Sign Up
                </Link>
              </span>
            </div>
          </>
        );
      }}
    </FormContainer>
  );
};

export default SignInForm;
