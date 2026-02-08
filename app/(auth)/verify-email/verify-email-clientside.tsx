"use client";
import React from "react";
import FormContainer from "@/components/shared/form/form-container";
import GlowBackground from "@/components/shared/glow-background";
import VerifyButton from "@/components/shared/verify-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyEmailTokenAction } from "@/lib/actions/auth/verify-email-token";

const VerifyEmailClientSide = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  return (
    <div className=" custom-bg px-6 ">
      <GlowBackground intensity="strong" />

      <Card className="custom-card">
        <CardHeader className="">
          <CardTitle>
            <h1 className="text-2xl sm:text-3xl font-semibold ">
              Verify Your Email
            </h1>
          </CardTitle>
          <CardDescription>
            <p className="text-sm sm:text-base text-white/70 ">
              Confirm your account to continue.
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!token ? (
            <>
              <p className="text-sm text-white/80 text-center mb-4">
                Verification token is missing. Please use the link sent to your
                email.
              </p>

              <Button
                asChild
                className="w-full bg-gold hover:bg-gold/90 text-black"
              >
                <Link href="/sign-in">Go to Sign In</Link>
              </Button>
            </>
          ) : (
            <FormContainer
              action={verifyEmailTokenAction}
              className="space-y-4"
            >
              {(state) => (
                <>
                  <input type="hidden" name="token" value={token} />
                  <VerifyButton />

                  {state.success === false && state.message ? (
                    <p className="text-sm text-destructive text-center">
                      {String(state.message)}
                    </p>
                  ) : null}

                  <div className="text-sm text-center text-muted-foreground">
                    <Link href="/sign-in" className="text-gold hover:underline">
                      Back to Sign In
                    </Link>
                  </div>
                </>
              )}
            </FormContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailClientSide;
