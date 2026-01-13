"use server";

import { getFriendlyErrorMessage } from "@/lib/utils";
import { trackRequestSchema, validateWithZodSchema } from "@/lib/validators";
import { FormActionState } from "@/types";

export async function trackRequestAction(
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  try {
    const rawData = Object.fromEntries(formData);
    const validatedData = validateWithZodSchema(trackRequestSchema, rawData);

    const code = validatedData.trackingCode.trim().toLocaleLowerCase();

    return {
      success: true,
      redirectTo: `/tracking/${encodeURIComponent(code)}`,
      message: "Tracking request...",
    };
  } catch (error) {
    return {
      success: false,
      message: getFriendlyErrorMessage(error),
    };
  }
}
