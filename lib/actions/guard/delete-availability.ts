"use server";

import { db } from "@/db/db";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage } from "@/lib/utils";
import {
  deleteGuardAvailabilitySchema,
  validateWithZodSchema,
} from "@/lib/validators";
import { FormActionState } from "@/types";

export const deleteGuardAvailabilityBlockAction = async (
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> => {
  try {
    const { session } = await requireVerifiedUser();
    const userId = session?.user?.id as string | undefined;

    if (!userId) return { success: false, message: "Unauthorized" };

    const guard = await db.guardProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!guard) {
      return { success: false, message: "No guard profile found." };
    }

    const raw = Object.fromEntries(formData);
    const { id } = validateWithZodSchema(deleteGuardAvailabilitySchema, raw);

    // ensure they can only delete their own availability block
    const availabilityBlock = await db.guardAvailability.findFirst({
      where: { id, guardId: guard.id },
      select: { id: true },
    });
    if (!availabilityBlock) {
      return { success: false, message: "Availability block not found." };
    }
    await db.guardAvailability.delete({
      where: { id: availabilityBlock.id },
    });
    return {
      success: true,
      message: "Availability block deleted successfully.",
    };
  } catch (error) {
    return { success: false, message: getFriendlyErrorMessage(error) };
  }
};
