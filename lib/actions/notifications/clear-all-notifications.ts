"use server";

import { db } from "@/db/db";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage, renderError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const clearAllNotificationsAction = async () => {
  try {
    const { session } = await requireVerifiedUser();
    const userId = session.user.id;
    if (!userId) throw new Error("User not authenticated");

    await db.notification.deleteMany({
      where: { userId },
    });

    revalidatePath("/dashboard");
    revalidatePath("/notifications");
    revalidatePath("/admin");
    revalidatePath("/guard");
    return { success: true, message: "All notifications cleared" };
  } catch (error) {
    return {
      success: false,
      message: getFriendlyErrorMessage(error) || renderError(error),
    };
  }
};
