"use client";
import FormContainer from "@/components/shared/form/form-container";
import PasswordInput from "@/components/shared/form/password-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resetPasswordAction } from "@/lib/actions/auth/auth";
import { asStringMessage } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { useFormStatus } from "react-dom";

function getPasswordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

function getPasswordStrengthLabel(score: number) {
  switch (score) {
    case 0:
    case 1:
      return "Very Weak";
    case 2:
      return "Weak";
    case 3:
      return "Moderate";
    case 4:
      return "Strong";
    case 5:
      return "Very Strong";
    default:
      return "";
  }
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full mt-2 bg-gold hover:bg-gold/90 text-black"
    >
      {pending ? "Updating..." : "Update password"}
    </Button>
  );
};

const ResetPasswordForm = ({ token }: { token: string }) => {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [showPasswordStrength, setShowPasswordStrength] = React.useState(false);
  const passwordScore = getPasswordScore(password);
  const passwordStrengthLabel = getPasswordStrengthLabel(passwordScore);

  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const passwordMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const isTooWeak = password.length > 0 && passwordScore < 3;

  return (
    <Card className="custom-card">
      <CardHeader>
        <CardTitle>
          <h1 className="font-semibold text-3xl">Reset password</h1>
        </CardTitle>

        <CardDescription>
          <p className="text-sm text-white/70"> Choose a new password</p>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {!token ? (
            <>
              <p className="text-sm text-white/70">
                {" "}
                This reset link is missing a token. Please request a new link.
              </p>

              <Button
                asChild
                className="w-full bg-gold hover:bg-gold/90 text-black"
              >
                <Link href="/forgot-password">Request reset link</Link>
              </Button>
            </>
          ) : (
            <FormContainer action={resetPasswordAction}>
              {(data) => (
                <>
                  <input type="hidden" name="token" value={token} />

                  <div className="my-2">
                    <PasswordInput
                      id="password"
                      name="password"
                      label="New Password"
                      placeholder="Enter new password"
                      className="text-xs"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setShowPasswordStrength(true)}
                      onBlur={() => setShowPasswordStrength(false)}
                    />
                    {showPasswordStrength && (
                      <div className="mt-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, index) => {
                            let bgColor = "bg-gray-300";
                            if (index < passwordScore) {
                              if (passwordScore <= 2) {
                                bgColor = "bg-red-500";
                              } else if (passwordScore === 3) {
                                bgColor = "bg-yellow-500";
                              } else {
                                bgColor = "bg-green-500";
                              }
                            }
                            return (
                              <div
                                key={index}
                                className={`h-1 flex-1 rounded ${bgColor}`}
                              ></div>
                            );
                          })}
                        </div>
                        {password && (
                          <div
                            className={`text-xs mt-1 ${
                              passwordScore <= 2
                                ? "text-red-600"
                                : passwordScore === 3
                                  ? "text-yellow-600"
                                  : "text-green-600"
                            }`}
                          >
                            {password
                              ? `Strength: ${passwordStrengthLabel}`
                              : "Enter a password"}
                          </div>
                        )}

                        {isTooWeak && (
                          <p className="text-sm text-red-500 mt-1">
                            Please use at least 8 characters with lowercase,
                            uppercase, number and a special character.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="my-4">
                    <PasswordInput
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirm Password"
                      placeholder="Re-enter your new password"
                      className="text-xs"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setShowConfirmPassword(true)}
                      onBlur={() => setShowConfirmPassword(false)}
                    />

                    {showConfirmPassword && confirmPassword.length > 0 && (
                      <p
                        className={`mt-1 text-xs ${
                          passwordMatch ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {passwordMatch
                          ? "Passwords match ✅"
                          : "Passwords do not match ❌"}
                      </p>
                    )}
                  </div>

                  <div className="my-4" />

                  <SubmitButton />

                  {data && !data.success && data.message && (
                    <div className="text-center text-destructive text-sm">
                      {asStringMessage((data as { message?: unknown }).message)}
                    </div>
                  )}

                  <div className="text-sm text-center text-muted-foreground my-3">
                    Remember your password?{" "}
                    <Link href="/sign-in" className="text-gold hover:underline">
                      Sign In
                    </Link>
                  </div>
                </>
              )}
            </FormContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
