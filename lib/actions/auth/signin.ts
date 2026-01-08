"use server";

import { signIn } from "@/auth";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { validateWithZodSchema, userSignInSchema } from "@/lib/validators";
import { FormActionState } from "@/types";

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
        message: "Incorrect email or password",
      };
    }
    const rendered = getFriendlyErrorMessage(error);
    return {
      success: false,
      message: rendered,
    };
  }
};
