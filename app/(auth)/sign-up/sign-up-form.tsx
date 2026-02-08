"use client";
import FormContainer from "@/components/shared/form/form-container";
import FormInput from "@/components/shared/form/form-input";
import PasswordInput from "@/components/shared/form/password-input";
import { Button } from "@/components/ui/button";
import { signupAction } from "@/lib/actions/auth/signup";
import { asStringMessage } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

const SignUpForm = () => {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [showPasswordStrength, setShowPasswordStrength] = React.useState(false);
  const passwordScore = getPasswordScore(password);
  const passwordStrengthLabel = getPasswordStrengthLabel(passwordScore);

  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const passwordMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const isTooWeak = password.length > 0 && passwordScore < 3;

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignUpButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button
        type="submit"
        disabled={pending}
        className="w-full mt-2 text-black bg-gold hover:bg-gold/90"
      >
        {pending ? "Signing Up..." : "Sign Up"}
      </Button>
    );
  };

  const handleReset = () => {
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <FormContainer
      className="space-y-4"
      action={signupAction}
      onReset={handleReset}
    >
      {(data) => {
        type SignUpFormResult = { success?: boolean; message?: unknown };
        const result = data as SignUpFormResult;
        return (
          <>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div className="space-y-2 ">
              <FormInput
                name="name"
                type="text"
                label="Name"
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <FormInput
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <PasswordInput
                id="password"
                name="password"
                label="Password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowPasswordStrength(true)}
                onBlur={() => setShowPasswordStrength(false)}
                placeholder="Enter your password"
                required
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
                          className={`h-0.5 flex-1 rounded ${bgColor}`}
                        ></div>
                      );
                    })}
                  </div>
                  {password && (
                    <div
                      className={`text-xs sm:text-sm mt-1 ${
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
                    <p className="mt-1 text-xs text-red-500">
                      Please use at least 8 characters with lowercase,
                      uppercase, number and a special character.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setShowConfirmPassword(true)}
                onBlur={() => setShowConfirmPassword(false)}
                required
                placeholder="Re-enter your password"
              />

              {showConfirmPassword && confirmPassword.length > 0 && (
                <p
                  className={`mt-1 text-xs  ${
                    passwordMatch ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {passwordMatch
                    ? "Passwords match ✅ "
                    : "Passwords do not match ❌"}
                </p>
              )}
            </div>

            <div>
              <SignUpButton />
            </div>

            {result && result.success === false && (
              <div className="text-sm text-center text-destructive sm:text-base">
                {asStringMessage(result.message)}
              </div>
            )}

            <div className="text-sm text-center text-muted-foreground sm:text-base">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-gold hover:underline">
                Sign In
              </Link>
            </div>
          </>
        );
      }}
    </FormContainer>
  );
};

export default SignUpForm;
