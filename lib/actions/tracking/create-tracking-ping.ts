"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage } from "@/lib/utils";
import {
  createGuardTrackingSchema,
  validateWithZodSchema,
} from "@/lib/validators";
import { FormActionState } from "@/types";

export const createTrackingPingAction = async (
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> => {
  try {
    const { session } = await requireVerifiedUser();

    const isAdminUser = isAdmin(session?.user?.email);
    const isGuardUser = session?.user.role === "GUARD";
    if (!isAdminUser && !isGuardUser) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const raw = Object.fromEntries(formData);
    const data = validateWithZodSchema(createGuardTrackingSchema, raw);

    // Request must exist, not cancelled or completed and have a guard
    const req = await db.request.findUnique({
      where: { id: data.requestId },
      select: { id: true, status: true, guardId: true },
    });

    if (!req) return { success: false, message: "Request not found." };
    if (req.status === "CANCELLED" || req.status === "COMPLETED") {
      return {
        success: false,
        message: "Tracking is closed for this request.",
      };
    }

    // If guard is sending: must be the assigned guard
    if (isGuardUser) {
      const guardProfile = await db.guardProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true, active: true },
      });

      if (!guardProfile) {
        return { success: false, message: "Guard profile not found." };
      }

      if (!guardProfile || guardProfile?.active === false) {
        return { success: false, message: "Guard profile is not active." };
      }

      if (!req?.guardId) {
        return {
          success: false,
          message: "No guard assigned to this request.",
        };
      }

      if (req?.guardId !== guardProfile?.id) {
        return {
          success: false,
          message: "You are not assigned to this request.",
        };
      }

      await db.trackingPing.create({
        data: {
          requestId: req.id,
          guardId: guardProfile.id,
          kind: "LOCATION",
          source: "GUARD",
          lat: data.lat,
          lng: data.lng,
          accuracyM: data.accuracyM,
          speedMps: data.speedMps,
          heading: data.heading,
        },
      });
    } else {
      await db.trackingPing.create({
        data: {
          requestId: req.id,
          guardId: req.guardId || null,
          kind: "LOCATION",
          source: "ADMIN",
          lat: data.lat,
          lng: data.lng,
          accuracyM: data.accuracyM,
          speedMps: data.speedMps,
          heading: data.heading,
        },
      });
    }

    return {
      success: true,
      message: "",
    };
  } catch (error) {
    return {
      success: false,
      message: getFriendlyErrorMessage(error),
    };
  }
};
