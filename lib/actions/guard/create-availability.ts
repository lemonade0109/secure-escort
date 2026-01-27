"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { hhmToMinutes } from "@/lib/scheduling/time";
import { getFriendlyErrorMessage } from "@/lib/utils";
import {
  createGuardAvailabilitySchema,
  validateWithZodSchema,
} from "@/lib/validators";
import { FormActionState } from "@/types";
import { DayOfWeek } from "@prisma/client";

export const createGuardAvailabilityBlockAction = async (
  prevState: FormActionState,
  formData: FormData,
) => {
  try {
    const { session } = await requireVerifiedUser();
    const userId = session?.user?.id as string | undefined;
    const role = session?.user?.role as string | undefined;
    const isAdminUser = isAdmin(session?.user.email) as boolean | undefined;

    if (!userId) return { success: false, message: "Unauthorized" };
    if (!isAdminUser && role !== "GUARD") {
      return { success: false, message: "Unauthorized" };
    }

    const raw = Object.fromEntries(formData);
    const validatedData = validateWithZodSchema(
      createGuardAvailabilitySchema,
      raw,
    );

    const startMin = hhmToMinutes(validatedData.startTime);
    const endMin = hhmToMinutes(validatedData.endTime);

    if (startMin === null || endMin === null) {
      return { success: false, message: "Invalid time format." };
    }
    if (endMin <= startMin) {
      return { success: false, message: "End time must be after start time." };
    }

    const guard = await db.guardProfile.findUnique({
      where: { userId },
      select: { id: true, active: true },
    });

    if (!guard) return { succes: false, message: "No guard profile found." };
    if (!guard.active)
      return { success: false, message: "Guard profile is not active." };

    // prevent overlaps in same day
    const existing = await db.guardAvailability.findMany({
      where: { guardId: guard.id, day: validatedData.day as DayOfWeek },
      select: { id: true, startMin: true, endMin: true },
    });

    const overlaps = existing.some(
      (b) => startMin < b.endMin && endMin > b.startMin,
    );
    if (overlaps) {
      return {
        success: false,
        message: "Availability block overlaps with existing block.",
      };
    }

    await db.guardAvailability.create({
      data: {
        guardId: guard.id,
        day: validatedData.day as DayOfWeek,
        startMin,
        endMin,
        timezone: validatedData.timezone ?? null,
      },
    });

    return {
      success: true,
      message: "Availability saved.",
      redirectTo: "/guard/availability",
    };
  } catch (error) {
    return { success: false, message: getFriendlyErrorMessage(error) };
  }
};
