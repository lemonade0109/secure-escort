"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { assignGuardSchema, validateWithZodSchema } from "@/lib/validators";
import { BUSY_STATUSES, FormActionState } from "@/types";
import { createRequestEvent } from "./request-events";
import { Role } from "@prisma/client";
import { getRequestWindowAction } from "../guard/request-window";
import { overlaps } from "@/lib/scheduling/time";

export const assignGuardAction = async (
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> => {
  try {
    // Verify admin access
    const { session } = await requireVerifiedUser();
    if (!isAdmin(session?.user?.email)) throw new Error("Unauthorized");

    const rawData = Object.fromEntries(formData);
    const { requestId, guardId } = validateWithZodSchema(
      assignGuardSchema,
      rawData,
    );

    // ensure request exists
    const req = await db.request.findUnique({
      where: { id: requestId },
    });
    if (!req) return { success: false, message: "Request not found." };

    // guard exists + active
    const guard = await db.guardProfile.findUnique({
      where: { id: guardId },
      select: {
        active: true,
        id: true,
        badgeId: true,
        user: { select: { email: true, name: true } },
      },
    });
    if (!guard) return { success: false, message: "Guard not found." };
    if (guard.active === false) {
      return { success: false, message: "Guard is not active." };
    }

    // Guard availability: time overlap rule
    const targetWindow = await getRequestWindowAction(
      req.details as Record<string, unknown>,
    );
    if (!targetWindow) {
      return {
        success: false,
        message:
          "This request doesn't have enough schedule info (date/time/duration) to assign a guard.",
      };
    }
    const guardBusyRequests = await db.request.findMany({
      where: {
        guardId: guard.id,
        status: { in: BUSY_STATUSES },
        NOT: { id: requestId },
      },
      select: {
        id: true,
        trackingCode: true,
        details: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    for (const busyReq of guardBusyRequests) {
      const busyWindow = await getRequestWindowAction(
        busyReq.details as Record<string, unknown>,
      );
      if (!busyWindow) continue;

      if (
        overlaps(
          {
            day: targetWindow.day,
            startMin: targetWindow.startMin,
            endMin: targetWindow.endMin,
          },
          {
            day: busyWindow.day,
            startMin: busyWindow.startMin,
            endMin: busyWindow.endMin,
          },
        )
      ) {
        return {
          success: false,
          message: `This guard has another busy request (${busyReq.trackingCode}) that overlaps with the time of this request. Choose another guard.`,
        };
      }
    }

    const prevStatus = req.status;
    const prevGuardId = req.guardId;

    // Assign + set status
    await db.request.update({
      where: { id: requestId },
      data: {
        guardId: guardId,
        status: "ASSIGNED",
      },
    });

    // Timeline: Guard assigned
    const actorId = session?.user?.id ?? null;
    const guardLabel =
      guard.user.name || guard.user.email || guard.badgeId || "Guard";
    await createRequestEvent({
      requestId,
      type: "GUARD_ASSIGNED",
      message: prevGuardId
        ? `Guard changed to ${guardLabel}.`
        : `Guard ${guardLabel} assigned to request.`,
      meta: {
        from: req.status,
        to: "ASSIGNED",
        prevGuardId: prevGuardId,
        newGuardId: guardId,
      },
      actorId,
      actorRole: Role.ADMIN,
    });

    // Timeline: Status changed (only if it is changed)
    if (prevStatus !== "ASSIGNED") {
      await createRequestEvent({
        requestId,
        type: "STATUS_CHANGED",
        message: `Request status changed from ${prevStatus} to ASSIGNED.`,
        meta: {
          from: prevStatus,
          to: "ASSIGNED",
        },
        actorId,
        actorRole: Role.ADMIN,
      });
    }

    revalidatePath(`/admin/requests/${requestId}`);
    revalidatePath(`/admin/requests`);
    revalidatePath(`/requests/${requestId}`);
    revalidatePath(`/requests`);

    return {
      success: true,
      message: "Guard assigned to request successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: getFriendlyErrorMessage(error),
    };
  }
};
