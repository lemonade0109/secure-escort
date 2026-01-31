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
import { revalidatePath } from "next/cache";
import { createRequestEvent } from "../timeline/create-request-events";

function parseOptionalDate(val?: string) {
  const stringVal = val?.trim();
  if (!stringVal) return null;
  const date = new Date(stringVal);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export const updateRequestsEtaAction = async (
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> => {
  try {
    const { session } = await requireVerifiedUser();
    if (!isAdmin(session?.user?.email)) throw new Error("Unauthorized");

    const rawData = Object.fromEntries(formData);
    const { requestId, etaFrom, etaTo } = validateWithZodSchema(
      updateRequestETASchema,
      rawData,
    );

    const req = await db.request.findUnique({
      where: { id: requestId },
      select: { id: true, etaFrom: true, etaTo: true, trackingCode: true },
    });
    if (!req) return { success: false, message: "Request not found." };

    const fromDate = parseOptionalDate(etaFrom) ?? undefined;
    const toDate = parseOptionalDate(etaTo) ?? undefined;

    // If admin clears both, allow clearing
    const clearedBoth =
      String(etaFrom || "").trim() === "" && String(etaTo || "").trim() === "";

    if (!clearedBoth && fromDate && toDate && fromDate > toDate) {
      return {
        success: false,
        message: "Invalid ETA: 'From' date cannot be later than 'To' date.",
      };
    }

    // Update the request ETA
    const updated = await db.request.update({
      where: { id: requestId },
      data: {
        etaFrom: clearedBoth ? null : fromDate,
        etaTo: clearedBoth ? null : toDate,
      },
      select: { etaFrom: true, etaTo: true },
    });

    // Timeline event
    const actorId = session?.user?.id ?? null;
    await createRequestEvent({
      requestId,
      type: "ETA_UPDATED",
      message: `ETA updated: For ${req.trackingCode}`,
      meta: {
        fromDate: req.etaFrom,
        toDate: req.etaTo,
        newFromDate: updated.etaFrom,
        newToDate: updated.etaTo,
      },
      actorId,
      actorName: session.user?.name || null,
      actorEmail: session.user?.email || null,
      actorRole: "ADMIN",
    });

    revalidatePath(`/admin/requests/${requestId}`);
    revalidatePath(`/requests/${requestId}`);
    revalidatePath("/tracking");
    revalidatePath("/admin/requests");
    revalidatePath("/requests");

    return { success: true, message: "ETA updated successfully." };
  } catch (error) {
    return { success: false, message: getFriendlyErrorMessage(error) };
  }
};
