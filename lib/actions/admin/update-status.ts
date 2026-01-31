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
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import { createRequestEvent } from "../timeline/create-request-events";

export const updateRequestStatusAction = async (
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> => {
  try {
    const { session } = await requireVerifiedUser();
    if (!isAdmin(session?.user?.email)) throw new Error("Unauthorized");

    const rawData = Object.fromEntries(formData);
    const { requestId, status } = validateWithZodSchema(
      updateRequestStatusSchema,
      rawData,
    );

    const req = await db.request.findUnique({
      where: { id: requestId },
      select: { id: true, guardId: true, status: true },
    });
    if (!req) return { success: false, message: "Request not found." };

    // cannot set to ASSIGNED or IN_PROGRESS without guard
    if ((status === "ASSIGNED" || status === "IN_PROGRESS") && !req.guardId) {
      return {
        success: false,
        message: "Assign a guard before setting this status.",
      };
    }

    // no-op
    if (req.status === status) {
      return { success: true, message: `Status is already ${status}.` };
    }

    const prevStatus = req.status;

    await db.request.update({
      where: { id: requestId },
      data: { status },
    });

    // if status is now IN_PROGRESS, log tracking activation
    if (status === "IN_PROGRESS") {
      await createRequestEvent({
        requestId,
        type: "TRACKING_ACTIVATED",
        message: `Tracking activated as job is now In Progress.`,
        meta: { startedAt: new Date().toISOString() },
        actorRole: Role.ADMIN,
        actorId: session.user.id,
      });
    }

    //Timeline: Status changed
    await createRequestEvent({
      requestId,
      type: "STATUS_CHANGED",
      message: `Status changed: from ${prevStatus} to ${status}.`,
      meta: {
        from: prevStatus,
        to: status,
      },
    });

    revalidatePath(`/admin/requests/${requestId}`);
    revalidatePath(`/admin/requests`);
    revalidatePath(`/requests/${requestId}`);
    revalidatePath(`/tracking`);
    revalidatePath(`/guard/jobs/${requestId}`);
    revalidatePath(`/guard/jobs`);
    return {
      success: true,
      message: `Status updated to ${status}.`,
    };
  } catch (error) {
    console.error("updateRequestStatusAction:", error);
    return {
      success: false,
      message: getFriendlyErrorMessage(error),
    };
  }
};
