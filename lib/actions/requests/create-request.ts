"use server";

import { auth } from "@/auth";
import { db } from "@/db/db";
import {
  getFriendlyErrorMessage,
  makeTrackingCode,
  renderError,
} from "@/lib/utils";
import { createRequestSchema, validateWithZodSchema } from "@/lib/validators";
import { FormActionState } from "@/types";

export const CreateRequestAction = async (
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        message: "Please sign in to create a request.",
      };
    }

    const rawData = Object.fromEntries(formData);
    const validatedData = validateWithZodSchema(createRequestSchema, rawData);

    const notes = (validatedData.notes ?? "").toString().trim();
    const trackingCode = makeTrackingCode("SE");

    // Save to database
    const created = await db.request.create({
      data: {
        userId,
        type: validatedData.type,
        status: "PENDING",
        trackingCode,
        details: {
          ...validatedData,
          notes: notes.length > 0 ? notes : undefined,
        },
      },
      select: { id: true },
    });

    console.log("Created request", created);
    return {
      success: true,
      message: "Request submitted successfully.",
      redirectTo: `/request/${created.id}`,
    };
  } catch (error) {
    return {
      //To use renderError for dev Debugging
      success: false,
      message: getFriendlyErrorMessage(error) || renderError(error).message,
    };
  }
};
