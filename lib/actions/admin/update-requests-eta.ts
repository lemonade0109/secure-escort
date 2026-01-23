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
  const stringVal = val?.trim();
  if (!stringVal) return null;
  const date = new Date(stringVal);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function formatEtaDate(date: Date | null) {
  if (!date) return "_";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
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
      select: { id: true, etaFrom: true, etaTo: true },
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
        etaFrom: clearedBoth ? null : (fromDate ?? req.etaFrom),
        etaTo: clearedBoth ? null : (toDate ?? req.etaTo),
      },
      select: { etaFrom: true, etaTo: true },
    });

    // Timeline event
    const actorId = session?.user?.id ?? null;

    await createRequestEvent({
      requestId,
      type: "ETA_UPDATED",
      message: `ETA updated: From ${formatEtaDate(req.etaFrom || null)} - ${formatEtaDate(
        req.etaTo || null,
      )} → ${formatEtaDate(updated.etaFrom || null)} - ${formatEtaDate(
        updated.etaTo || null,
      )}`,
      meta: {
        etaFrom: updated.etaFrom ? updated.etaFrom.toISOString() : null,
        etaTo: updated.etaTo ? updated.etaTo.toISOString() : null,
      },
      actorId,
      actorRole: "ADMIN",
    });

    revalidatePath(`/admin/requests/${requestId}`);
    revalidatePath(`/requests/${requestId}`);
    revalidatePath("/tracking");

    return { success: true, message: "ETA updated successfully." };
  } catch (error) {
    return { success: false, message: getFriendlyErrorMessage(error) };
  }
};
