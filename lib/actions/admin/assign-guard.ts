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

    const busyCount = await db.request.count({
      where: {
        guardId: guard.id,
        status: { in: BUSY_STATUSES },
        NOT: { id: requestId },
      },
    });

    if (busyCount > 0) {
      return {
        success: false,
        message:
          "This guard is currently busy (ASSIGNED / IN_PROGRESS). Choose another guard.",
      };
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
