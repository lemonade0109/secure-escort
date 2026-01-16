"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage } from "@/lib/utils";

export const assignGuardAction = async (requestId: string, guardId: string) => {
  try {
    // Verify admin access
    const { session } = await requireVerifiedUser();
    const isAdminUser = isAdmin(session?.user?.email);
    if (!isAdminUser) {
      return {
        success: false,
        message: "Unauthorized: Admin access required.",
      };
    }

    // Validate guard
    const guard = await db.user.findUnique({
      where: { id: guardId },
      select: { id: true, role: true },
    });

    if (!guard || guard.role !== "GUARD") {
      return { success: false, message: "Invalid guard selected." };
    }

    // Assign + set status
    await db.request.update({
      where: { id: requestId },
      data: {
        guardId: guardId,
        status: "ASSIGNED",
      },
    });

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
