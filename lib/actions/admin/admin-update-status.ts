"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage } from "@/lib/utils";
import {
  updateRequestStatusSchema,
  validateWithZodSchema,
} from "@/lib/validators";
import { FormActionState } from "@/types";

export const updateRequestStatusAction = async (
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> => {
  try {
    const { session } = await requireVerifiedUser();
    const isAdminUser = await isAdmin(session?.user?.email);
    if (!isAdminUser) {
      return {
        success: false,
        message: "Unauthorized: Admin access required.",
      };
    }

    const rawData = Object.fromEntries(formData);
    const { requestId, status } = validateWithZodSchema(
      updateRequestStatusSchema,
      rawData
    );

    const req = await db.request.findUnique({
      where: { id: requestId },
      select: { id: true, guardId: true },
    });
    if (!req) return { success: false, message: "Request not found." };

    // cannot set to ASSIGNED or IN_PROGRESS without guard
    if ((status === "ASSIGNED" || status === "IN_PROGRESS") && !req.guardId) {
      return {
        success: false,
        message: "Assign a guard before setting this status.",
      };
    }
    await db.request.update({
      where: { id: requestId },
      data: { status },
    });

    return { success: true, message: `Status updated to ${status}.` };
  } catch (error) {
    console.error("updateRequestStatusAction:", error);
    return {
      success: false,
      message: getFriendlyErrorMessage(error),
    };
  }
};
