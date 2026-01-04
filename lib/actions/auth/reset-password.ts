"use server";

import { db } from "@/db/db";
import { hashPassword } from "@/lib/auth/password";
import { hashToken } from "@/lib/auth/token";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { resetPasswordSchema, validateWithZodSchema } from "@/lib/validators";
import { FormActionState } from "@/types";

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
      message: rendered,
    };
  }
};
