"use client";
import FormContainer from "@/components/shared/form/form-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { forgotPasswordAction } from "@/lib/actions/auth/auth";
import FormInput from "@/components/shared/form/form-input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { asStringMessage } from "@/lib/utils";
import Link from "next/link";
import { CheckCircle2, Mail } from "lucide-react";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full mt-2 bg-gold hover:bg-gold/90 text-black"
    >
      {pending ? "Sending..." : "Send Reset Link"}
    </Button>
  );
};

const ForgotPasswordForm = () => {
  return (
    <FormContainer
      action={forgotPasswordAction}
      className="space-y-4  w-1/3 max-w-md p-6"
    >
      {(data) => {
        if (data && data.success) {
          return (
            <Card className="custom-card  ">
              <CardHeader className="">
                <CardTitle>
                  <h1 className="text-3xl font-semibold flex justify-center ">
                    {data.success ? (
                      <CheckCircle2 className="h-12 w-12 text-green-400 " />
                    ) : (
                      <Mail className="h-8 w-8 text-primary" />
                    )}
                  </h1>
                </CardTitle>
                <CardDescription>
                  <p className="mt-2 text-sm text-white/70 text-center">
                    We&apos;ve sent a password reset link to your email address.
                    Please check your inbox and follow the instructions to reset
                    your password.
                  </p>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4 text-center">
                  <div className="bg-blue-950 border border-blue-800 rounded-lg p-3 text-xs text-left">
                    <p className="font-medium mb-2">
                      📧 Didn&apos;t receive the email?
                    </p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Check your spam or junk folder</li>
                      <li>• Make sure you entered the correct email address</li>
                      <li>• The email may take a few minutes to arrive</li>
                    </ul>
                  </div>

                  <div className="pt-4">
                    <Link
                      href="/sign-in"
                      className="text-sm text-gold hover:underline"
                    >
                      ← Back to Sign In
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }

        return (
          <Card className="custom-card  ">
            <CardHeader className="">
              <CardTitle>
                <h1 className="text-3xl font-semibold text-center">
                  Forgot Password?
                </h1>
              </CardTitle>
              <CardDescription>
                <p className="mt-2 text-sm text-white/70 text-center">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </p>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <FormInput
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email address"
              />

              <SubmitButton />

              {data && !data.success && data.message && (
                <div className="text-center text-destructive text-sm">
                  {asStringMessage((data as { message?: unknown }).message)}
                </div>
              )}

              <div className="text-sm text-center text-muted-foreground">
                Remember your password?{" "}
                <Link href="/sign-in" className="text-gold hover:underline">
                  Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      }}
    </FormContainer>
  );
};

export default ForgotPasswordForm;
