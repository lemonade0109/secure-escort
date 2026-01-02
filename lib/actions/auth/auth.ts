"use server";

import { signIn } from "@/auth";
import { db } from "@/db/db";
import { createPasswordResetToken } from "@/lib/auth/create-password-reset-token";
import { createEmailVerificationToken } from "@/lib/auth/email-verification/create-email-verification";
import { sendPasswordResetEmail } from "@/lib/auth/email-verification/send-password-reset-email";
import { sendVerificationEmail } from "@/lib/auth/email-verification/send-verification-email";
import { hashPassword } from "@/lib/auth/password";
import { hashToken } from "@/lib/auth/token";
import { getFriendlyErrorMessage, renderError } from "@/lib/utils";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  SignUpActionSchema,
  userSignInSchema,
  validateWithZodSchema,
  verifyEmailSchema,
} from "@/lib/validators";
import { FormActionState } from "@/types";

// Check if email exists
export const emailExists = async (
  email: string
): Promise<{ exists: boolean; error?: string }> => {
  try {
    const user = await db.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true },
    });
    return { exists: !!user };
  } catch (error) {
    console.error("Database error in emailExists:", error);
    return {
      exists: false,
      error: getFriendlyErrorMessage(error),
    };
  }
};

// Signup action
export const signupAction = async (
  prevState: FormActionState,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);

    const validatedData = validateWithZodSchema(SignUpActionSchema, rawData);

    const { exists, error } = await emailExists(validatedData.email);

    if (error) {
      return { success: false, message: error };
    }

    if (exists) {
      return { success: false, message: "Email already in use" };
    }

    const hashed = await hashPassword(validatedData.password);

    const newUser = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        password: hashed,
      },
    });

    const token = await createEmailVerificationToken(newUser.id);
    const firstName = newUser.name ? newUser.name.split(" ")[0] : "User";
    await sendVerificationEmail(newUser.email, token, firstName);

    return {
      success: true,
      redirectTo: "/sign-in",
      message: "Account created successfully. Please verify your email.",
    };

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      console.log("Redirection triggered:", error);
    }
    const rendered = getFriendlyErrorMessage(error);
    return {
      success: false,
      message: typeof rendered === "string" ? rendered : rendered,
    };
  }
};

// SignIn Action
export const signInAction = async (
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> => {
  try {
    const rawData = Object.fromEntries(formData);
    const validatedData = validateWithZodSchema(userSignInSchema, rawData);

    const callbackUrl = validatedData.callbackUrl || "/dashboard";

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return {
      success: true,
      redirectTo: callbackUrl,
      message: "Signed in successfully",
    };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "type" in error &&
      (error as { type?: string }).type === "CredentialsSignin"
    ) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }
    const rendered = getFriendlyErrorMessage(error);
    return {
      success: false,
      message: typeof rendered === "string" ? rendered : rendered,
    };
  }
};

// Verify email token action
export const verifyEmailTokenAction = async (
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> => {
  const rawData = Object.fromEntries(formData);
  const rawToken = validateWithZodSchema(verifyEmailSchema, rawData);

  const token = hashToken(rawToken.token);

  const record = await db.emailVerificationToken.findFirst({
    where: { token },
  });

  if (!record) {
    return {
      success: false,
      message: "The email verification link is invalid or has expired.",
    };
  }

  if (record.expiresAt < new Date()) {
    return {
      success: false,
      message:
        "The email verification link has expired. Please request a new one.",
    };
  }

  // Mark user's email as verified
  await db.user.update({
    where: { id: record.userId },
    data: { emailVerified: new Date() },
  });

  // Delete the used token
  await db.emailVerificationToken.deleteMany({
    where: { token },
  });

  return {
    success: true,
    redirectTo: "/sign-in",
    message: "Your email has been verified successfully. You can now sign in.",
  };
};

// Resend verification email action
export const resendVerificationEmailAction = async (
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> => {
  try {
    const rawData = Object.fromEntries(formData);
    const email = rawData.email as string;
    const user = await db.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return {
        success: false,
        message: "No account found with that email address.",
      };
    }
    if (user.emailVerified) {
      return {
        success: false,
        message: "This email is already verified. Please sign in.",
      };
    }
    const token = await createEmailVerificationToken(user.id);
    const firstName = user.name ? user.name.split(" ")[0] : "User";
    await sendVerificationEmail(user.email, token, firstName);
    return {
      success: true,
      message: "Verification email resent. Please check your inbox.",
    };
  } catch (error) {
    const rendered = renderError(error);
    return {
      success: false,
      message: typeof rendered === "string" ? rendered : rendered.message,
    };
  }
};

// Sign out action
export const signOutAction = async (): Promise<FormActionState> => {
  try {
    await signIn("credentials", { redirect: false, callbackUrl: "/sign-in" });
    return {
      success: true,
      redirectTo: "/sign-in",
      message: "Signed out successfully",
    };
  } catch (error) {
    const rendered = getFriendlyErrorMessage(error);
    return {
      success: false,
      message: typeof rendered === "string" ? rendered : rendered,
    };
  }
};

// Forgot Password Action
export const forgotPasswordAction = async (
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> => {
  try {
    const rawData = Object.fromEntries(formData);
    const validatedData = validateWithZodSchema(forgotPasswordSchema, rawData);

    const lookupEmail = validatedData.email.trim().toLowerCase();

    // check if email exists in db
    const user = await db.user.findUnique({
      where: { email: lookupEmail },
    });

    if (!user) {
      return {
        success: false,
        message:
          "If an account exists with that email, a reset link has been sent",
      };
    }
    const firstName = user.name ? user.name.split(" ")[0] : "User";

    const token = await createPasswordResetToken(user.id);

    await sendPasswordResetEmail(lookupEmail, token, firstName);

    return {
      success: true,
      message:
        "If an account with that email exists, a password reset email has been sent.",
    };
  } catch (error) {
    const rendered = getFriendlyErrorMessage(error);
    return {
      success: false,
      message: typeof rendered === "string" ? rendered : rendered,
    };
  }
};

// Reset Password Action
export const resetPasswordAction = async (
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> => {
  try {
    const rawData = Object.fromEntries(formData);
    const { token, password } = validateWithZodSchema(
      resetPasswordSchema,
      rawData
    );

    const hashedToken = hashToken(token);

    console.log("Reset password: token from form:", token);
    console.log("Reset password: hashedToken:", hashedToken);

    // find token record
    const record = await db.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    console.log("Reset password: token record from DB:", record);

    if (!record) {
      return {
        success: false,
        message: "The password reset link is invalid or has expired.",
      };
    }

    if (record.expiresAt < new Date()) {
      await db.passwordResetToken.deleteMany({
        where: { token: hashedToken },
      });
      return {
        success: false,
        message:
          "The password reset link has expired. Please request a new one.",
      };
    }

    const hashedPassword = await hashPassword(password);

    // update user's password
    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: record.userId },
        data: { password: hashedPassword },
      });
    });

    // delete all tokens for the user
    await db.passwordResetToken.deleteMany({
      where: { userId: record.userId },
    });

    return {
      success: true,
      redirectTo: "/sign-in",
      message:
        "Your password has been reset successfully. You can now sign in.",
    };
  } catch (error) {
    const rendered = getFriendlyErrorMessage(error);
    return {
      success: false,
      message: typeof rendered === "string" ? rendered : rendered,
    };
  }
};
