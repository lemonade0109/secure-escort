"use server";

import { signIn } from "@/auth";
import { db } from "@/db/db";
import { hashPassword } from "@/lib/auth/password";
import { renderError } from "@/lib/utils";
import {
  SignUpActionSchema,
  userSignInSchema,
  validateWithZodSchema,
} from "@/lib/validators";
import { FormActionState } from "@/types";

// Check if email exists
export const emailExists = async (email: string): Promise<boolean> => {
  const user = await db.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true },
  });

  return !!user;
};

// Signup action
export const signupAction = async (
  prevState: FormActionState,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);

    const validatedData = validateWithZodSchema(SignUpActionSchema, rawData);

    if (await emailExists(validatedData.email)) {
      return { success: false, message: "Email already in use" };
    }

    const hashed = await hashPassword(validatedData.password);

    await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        password: hashed,
      },
    });

    //Todo :Implement email verification step
    return {
      success: true,
      redirectTo: "/sign-in",
      message: "Account created successfully. Please sign in.",
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
