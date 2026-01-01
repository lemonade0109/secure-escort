"use server";

import { signIn } from "@/auth";
import { db } from "@/db/db";
import { createEmailVerificationToken } from "@/lib/auth/email-verification/email-verification";
import { sendVerificationEmail } from "@/lib/auth/email-verification/send-verification-email";
import { hashPassword } from "@/lib/auth/password";
import { hashToken } from "@/lib/auth/token";
import { renderError } from "@/lib/utils";
import {
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
      error: "Unable to check email at this time. Please try again later.",
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
    const rendered = renderError(error);
    return {
      success: false,
      message: typeof rendered === "string" ? rendered : rendered.message,
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
    const rendered = renderError(error);
    return {
      success: false,
      message: typeof rendered === "string" ? rendered : rendered.message,
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
