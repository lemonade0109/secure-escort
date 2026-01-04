"use server";

import { db } from "@/db/db";
import { createPasswordResetToken } from "@/lib/auth/create-password-reset-token";
import { sendPasswordResetEmail } from "@/lib/auth/email-verification/send-password-reset-email";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { forgotPasswordSchema, validateWithZodSchema } from "@/lib/validators";
import { FormActionState } from "@/types";

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
      message: rendered,
    };
  }
};
