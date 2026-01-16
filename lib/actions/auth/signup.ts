"use server";

import { db } from "@/db/db";
import { createEmailVerificationToken } from "@/lib/auth/email-verification/create-email-verification";
import { sendVerificationEmail } from "@/lib/auth/email-verification/send-verification-email";
import { hashPassword } from "@/lib/auth/password";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { validateWithZodSchema, SignUpActionSchema } from "@/lib/validators";
import { FormActionState } from "@/types";
import { emailExistsAction } from "./email-exists";

export const signupAction = async (
  prevState: FormActionState,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);

    const validatedData = validateWithZodSchema(SignUpActionSchema, rawData);

    const { exists, error } = await emailExistsAction(validatedData.email);

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
      redirectTo: `/check-email?email=${encodeURIComponent(newUser.email)}`,
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
      message: rendered,
    };
  }
};
