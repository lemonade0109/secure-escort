"use server";

import { db } from "@/db/db";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage } from "@/lib/utils";
import {
  createCheckPointPingSchema,
  validateWithZodSchema,
} from "@/lib/validators";
import { FormActionState } from "@/types";

export const createCheckPointPingAction = async (
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> => {
  try {
    const { session } = await requireVerifiedUser();
    if (session?.user?.role !== "GUARD") {
      return {
        success: false,
        message: "Unauthorized: Only guards can create checkpoint pings.",
      };
    }

    const raw = Object.fromEntries(formData);
    const data = validateWithZodSchema(createCheckPointPingSchema, raw);

    const req = await db.request.findUnique({
      where: { id: data.requestId },
      select: { id: true, status: true, guardId: true },
    });

    if (!req) return { success: false, message: "Request not found." };
    if (req.status === "COMPLETED" || req.status === "CANCELLED") {
      return {
        success: false,
        message: "Tracking is closed for this request.",
      };
    }

    const guardProfile = await db.guardProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true, active: true },
    });

    if (!guardProfile)
      return { success: false, message: "Guard profile not found." };
    if (!guardProfile.active)
      return { success: false, message: "Guard profile is not active." };

    if (!req.guardId) {
      return { success: false, message: "No guard assigned to this request." };
    }
    if (req.guardId !== guardProfile.id) {
      return {
        success: false,
        message: "You are not assigned to this request.",
      };
    }

    await db.trackingPing.create({
      data: {
        requestId: req.id,
        guardId: guardProfile.id,
        kind: "CHECKPOINT",
        source: "GUARD",
        label: data.label,
        note: data.note?.trim() ? data.note.trim() : null,
      },
    });

    return { success: true, message: "Checkpoint saved successfully." };
  } catch (error) {
    return { success: false, message: getFriendlyErrorMessage(error) };
  }
};
