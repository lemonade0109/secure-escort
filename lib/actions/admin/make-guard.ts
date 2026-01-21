"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { makeGuardSchema, validateWithZodSchema } from "@/lib/validators";
import { FormActionState } from "@/types";
import { generateBadge } from "./badge";

export const makeGuardAction = async (
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> => {
  try {
    const { session } = await requireVerifiedUser();
    if (!isAdmin(session?.user?.email)) throw new Error("Unauthorized");

    const rawData = Object.fromEntries(formData);
    const validatedData = validateWithZodSchema(makeGuardSchema, rawData);
    if (!validatedData.email) {
      return { success: false, message: "Email is required." };
    }

    const email = validatedData.email.toLowerCase();
    const active = validatedData.active ?? false;
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return {
        success: false,
        message: "User with this email does not exist.",
      };
    }

    // Prevent duplicate guard profiles
    const existingGuardProfile = await db.guardProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    if (existingGuardProfile) {
      return {
        success: false,
        message: "This user is already a guard.",
      };
    }

    const badgeId = await generateBadge("B");

    // 1) Promote role
    await db.user.update({
      where: { id: user.id },
      data: { role: "GUARD" },
    });

    // 2) Create/Update guard profile
    await db.guardProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        badgeId,
        phone: validatedData.phone,
        active,
      },
      update: {
        badgeId,
        phone: validatedData.phone,
        active,
      },
    });

    return {
      success: true,
      message: `User ${email} has been made a guard successfully.`,
      redirectTo: "/admin/guards",
    };
  } catch (error) {
    return { success: false, message: getFriendlyErrorMessage(error) };
  }
};
