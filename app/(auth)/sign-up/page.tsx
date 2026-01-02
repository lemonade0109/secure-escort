import React, { Suspense } from "react";
import { Metadata } from "next";
import SignUpForm from "./sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GlowBackground from "@/components/shared/glow-background";

export const metadata: Metadata = {
  title: "Sign Up - Secure Escort",
};

export default function SignUpPage() {
  return (
    <div className="custom-bg">
      <GlowBackground intensity="medium" />

      <Card className="custom-card">
        <CardHeader>
          <CardTitle>
            <h1 className="text-3xl font-semibold">Create account</h1>
          </CardTitle>
          <CardDescription>
            <p className="mt-2 text-sm text-white/70">
              Sign up to request a guard or make secured deliveries.
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-4">
          <Suspense>
            <SignUpForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
