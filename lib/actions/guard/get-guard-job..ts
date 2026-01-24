"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { RequestStatus } from "@prisma/client";

type Tab = "active" | "completed" | "all";

export const getGuardJobAction = async (tab: Tab = "active") => {
  try {
    const { session } = await requireVerifiedUser();

    const isAdminUser = isAdmin(session?.user?.email);
    const userId = session?.user?.id;
    const role = session?.user?.role;

    if (!userId) return { success: false, message: "Unauthorized" };
    if (!isAdminUser && role !== "GUARD") {
      return { success: false, message: "Unauthorized" };
    }

    const guardProfile = await db.guardProfile.findUnique({
      where: { userId },
      select: { id: true, active: true, badgeId: true },
    });

    if (!guardProfile) {
      return { success: false, message: "Guard profile not found." };
    }

    if (!guardProfile.active) {
      return { success: false, message: "Guard profile is not active." };
    }

    const where =
      tab === "active"
        ? {
            guardId: guardProfile.id,
            status: { in: [RequestStatus.ASSIGNED, RequestStatus.IN_PROGRESS] },
          }
        : tab === "completed"
          ? {
              guardId: guardProfile.id,
              status: {
                in: [RequestStatus.COMPLETED, RequestStatus.CANCELLED],
              },
            }
          : { guardId: guardProfile.id };

    const job = await db.request.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return { success: true, guardProfile, job };
  } catch (error) {
    return {
      success: false,
      message: getFriendlyErrorMessage(error),
    };
  }
};
