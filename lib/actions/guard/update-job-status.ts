"use server";

import { db } from "@/db/db";
import { getAdminEmails, isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage, renderError } from "@/lib/utils";
import { FormActionState } from "@/types";
import { RequestStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createRequestEvent } from "../timeline/create-request-events";
import { createNotificationAction } from "../notifications/create-notifications";

const ALLOWED_GUARD_NEXT: Record<RequestStatus, RequestStatus[]> = {
  PENDING: [],
  ASSIGNED: ["IN_PROGRESS"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const guardUpdateJobStatusAction = async (
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> => {
  try {
    const { session } = await requireVerifiedUser();
    const userId = session?.user.id;
    const isGuard = session?.user.role === "GUARD";
    const isAdminUser = isAdmin(session.user.email);

    if (!userId) return { success: false, message: "User not authenticated." };
    if (!isGuard && !isAdminUser)
      return { success: false, message: "Only guards can do this action." };

    const requestId = String(formData.get("requestId") || "").trim();
    const nextStatus = String(
      formData.get("nextStatus") || "",
    ).trim() as RequestStatus;

    // Find guard profile
    const guard = await db.guardProfile.findUnique({
      where: { userId },
      select: { id: true, active: true },
    });

    if (!guard) return { success: false, message: "Guard profile not found." };
    if (!guard.active)
      return { success: false, message: "Guard profile is not active." };

    // ensure request is assigned to this guard
    const req = await db.request.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        status: true,
        guardId: true,
        trackingCode: true,
        userId: true,
      },
    });

    if (!req) return { success: false, message: "Request not found." };
    if (req.guardId !== guard.id)
      return { success: false, message: "You are not assigned to this job." };

    // validate status transition
    const allowed = ALLOWED_GUARD_NEXT[req.status] || [];
    if (!allowed.includes(nextStatus))
      return {
        success: false,
        message: `Cannot change status from ${req.status} → ${nextStatus}.`,
      };

    // update status
    await db.request.update({
      where: { id: requestId },
      data: { status: nextStatus },
    });

    // Notifications to user
    await createNotificationAction({
      userId: req.userId,
      title: `Request #${req.trackingCode} status updated`,
      message: `The status of your assigned request #${req.trackingCode} has been updated to ${nextStatus}.`,
      type: "STATUS_CHANGED",
      href: `/request/${requestId}`,
    });

    // Notification to Admin
    const adminEmails = getAdminEmails();
    const adminUsers = await db.user.findMany({
      where: { email: { in: adminEmails } },
      select: { id: true },
    });

    // Send notifications to all admins
    for (const admin of adminUsers) {
      await createNotificationAction({
        userId: admin.id,
        title: `Guard updated job status`,
        message: `Guard updated request #${req.trackingCode} from ${req.status} to ${nextStatus}.`,
        type: "STATUS_CHANGED",
        href: `/admin/requests/${requestId}`,
      });
    }

    // if status is now IN_PROGRESS, log tracking activation
    if (nextStatus === "IN_PROGRESS") {
      await createRequestEvent({
        requestId,
        type: "TRACKING_ACTIVATED",
        message: `Tracking activated as job is now In Progress.`,
        meta: { startedAt: new Date().toISOString() },
        actorRole: Role.GUARD,
        actorId: session.user.id,
      });
    }
    // Timeline event
    await createRequestEvent({
      requestId,
      type: "STATUS_CHANGED",
      message: `Guard updated status: ${req.status} → ${nextStatus}`,
      meta: { from: req.status, to: nextStatus },
      actorId: userId,
      actorRole: Role.GUARD,
    });

    revalidatePath(`/admin/requests/${requestId}`);
    revalidatePath(`/admin/requests`);
    revalidatePath(`/requests/${requestId}`);
    revalidatePath(`/tracking/${req.trackingCode}`);
    revalidatePath(`/guard/jobs/${requestId}`);
    revalidatePath(`/guard/jobs`);

    return { success: true, message: `Status updated to ${nextStatus}.` };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: renderError(error).message || getFriendlyErrorMessage(error),
    };
  }
};
