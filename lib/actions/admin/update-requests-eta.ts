"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage } from "@/lib/utils";
import {
  updateRequestETASchema,
  validateWithZodSchema,
} from "@/lib/validators";
import { FormActionState } from "@/types";
import { createRequestEvent } from "./request-events";
import { revalidatePath } from "next/cache";

function parseOptionalDate(val?: string) {
  if (!val) return null;
  const date = new Date(val);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export const updateRequestsEtaAction = async (
  preveState: FormActionState,
  formData: FormData
): Promise<FormActionState> => {
  try {
    const { session } = await requireVerifiedUser();
    if (!isAdmin(session?.user?.email)) throw new Error("Unauthorized");

    const rawData = Object.fromEntries(formData);
    const { requestId, etaFrom, etaTo } = validateWithZodSchema(
      updateRequestETASchema,
      rawData
    );

    const req = db.request.findUnique({
      where: { id: requestId },
      select: { id: true, etaFrom: true, etaTo: true },
    });
    if (!req) return { success: false, message: "Request not found." };

    const fromDate = parseOptionalDate(etaFrom);
    const toDate = parseOptionalDate(etaTo);

    // Allow clearing by leaving empty
    if (fromDate && toDate && fromDate > toDate) {
      return {
        success: false,
        message: "ETA range is invalid. 'From' cannot be after 'To'.",
      };
    }

    // Update the request ETA
    await db.request.update({
      where: { id: requestId },
      data: {
        etaFrom: fromDate,
        etaTo: toDate,
      },
    });

    // Timeline event
    const fromLabel = fromDate ? fromDate.toLocaleString() : "_";
    const toLabel = toDate ? toDate.toLocaleString() : "_";

    await createRequestEvent({
      requestId,
      type: "ETA_UPDATED",
      message: `Updated ETA: From ${fromLabel} To ${toLabel}`,
      meta: {
        etaFrom: fromDate ? fromDate.toISOString() : null,
        etaTo: toDate ? toDate.toISOString() : null,
      },
    });

    revalidatePath(`/admin/requests/${requestId}`);
    revalidatePath(`/requests/${requestId}`);
    revalidatePath("/tracking");

    return { success: true, message: "ETA updated successfully." };
  } catch (error) {
    return { success: false, message: getFriendlyErrorMessage(error) };
  }
};
