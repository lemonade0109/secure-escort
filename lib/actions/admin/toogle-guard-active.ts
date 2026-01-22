"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { FormActionState } from "@/types";

export const toggleGuardActiveAction = async (
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> => {
  try {
    const { session } = await requireVerifiedUser();
    if (!isAdmin(session?.user?.email)) throw new Error("Unauthorized");

    const guardId = formData.get("guardId") as string;
    const nextActiveRaw = formData.get("active") as string;

    if (!guardId) return { success: false, message: "Missing guard id" };

    const nextActive =
      nextActiveRaw === "true"
        ? true
        : nextActiveRaw === "false"
          ? false
          : null;

    if (nextActive === null) {
      return { success: false, message: "Invalid active value" };
    }

    const updated = await db.guardProfile.update({
      where: { id: guardId },
      data: { active: nextActive },
      select: { id: true, active: true },
    });

    return {
      success: true,
      message: updated.active ? "Guard activated" : "Guard deactivated",
    };
  } catch (error) {
    return {
      success: false,
      message: getFriendlyErrorMessage(error),
    };
  }
};
