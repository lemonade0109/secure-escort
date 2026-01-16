"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage } from "@/lib/utils";

export const makeGuardAction = async (userId: string) => {
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

    // Set role
    await db.user.update({
      where: { id: userId },
      data: { role: "GUARD" },
    });

    // ensure profile exists
    await db.guardProfile.upsert({
      where: { userId },
      update: { active: true },
      create: { userId, active: true },
    });

    return {
      success: true,
      message: "User promoted to GUARD.",
    };
  } catch (error) {
    return {
      success: false,
      message: getFriendlyErrorMessage(error),
    };
  }
};
