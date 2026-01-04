"use server";

import { db } from "@/db/db";
import { hashToken } from "@/lib/auth/token";
import { validateWithZodSchema, verifyEmailSchema } from "@/lib/validators";
import { FormActionState } from "@/types";

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
