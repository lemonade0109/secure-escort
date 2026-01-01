import GlowBackground from "@/components/shared/glow-background";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import SignInForm from "./signIn-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Secure Escort",
};

export default function SignInPage() {
  return (
    <div className="custom-bg">
      <GlowBackground intensity="strong" />
      <Card className="custom-card">
        <CardHeader>
          <CardTitle>
            <h1 className="text-3xl font-semibold">Welcome back</h1>
          </CardTitle>
          <CardDescription>
            <p className="mt-2 text-sm text-white/70">
              Sign in to request a guard or manage your requests.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}
