"use server";

import { db } from "@/db/db";
import { createEmailVerificationToken } from "@/lib/auth/email-verification/create-email-verification";
import { sendVerificationEmail } from "@/lib/auth/email-verification/send-verification-email";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { FormActionState } from "@/types";

export const resendVerificationEmailAction = async (
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> => {
  try {
    const rawData = Object.fromEntries(formData);
    const email = String(rawData.email).toLowerCase().trim();
    const user = await db.user.findUnique({
      where: { email: email },
    });

    if (!email) {
      return {
        success: false,
        message: "Please provide a valid email address.",
      };
    }

    if (!user) {
      return {
        success: true,
        message:
          "If an account with that email exists, a verification email has been sent.",
      };
    }

    if (user.emailVerified) {
      return {
        success: false,
        message: "This email is already verified. Please sign in.",
      };
    }

    const lastToken = await db.emailVerificationToken.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    if (lastToken) {
      const secs =
        (Date.now() - new Date(lastToken.createdAt).getTime()) / 1000;
      if (secs < 30) {
        return {
          success: false,
          message: "Please wait before requesting another verification email.",
        };
      }
    }

    const token = await createEmailVerificationToken(user.id);
    const firstName = user.name ? user.name.split(" ")[0] : "User";
    await sendVerificationEmail(user.email, token, firstName);
    return {
      success: true,
      message: "Verification email resent. Please check your inbox.",
    };
  } catch (error) {
    const rendered = getFriendlyErrorMessage(error);
    return {
      success: false,
      message: rendered,
    };
  }
};
