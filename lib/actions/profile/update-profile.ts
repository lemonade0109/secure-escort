"use server";

import { db } from "@/db/db";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage } from "@/lib/utils";
import {
  updateUserProfileSchema,
  validateWithZodSchema,
} from "@/lib/validators";
import { FormActionState } from "@/types";
import { revalidatePath } from "next/cache";

export const updateProfileAction = async (
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> => {
  try {
    const { session } = await requireVerifiedUser();

    const userId = session?.user.id;
    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const raw = Object.fromEntries(formData);

    const parsed = validateWithZodSchema(updateUserProfileSchema, raw);
    if (!parsed) {
      return {
        success: false,
        message: "Invalid profile data",
      };
    }

    const clean = (v?: string) =>
      v && String(v).trim().length > 0 ? String(v).trim() : null;

    await db.user.update({
      where: { id: userId },
      data: {
        name: clean(parsed.name) ?? undefined,
        image: clean(parsed.image) ?? undefined,
        phone: clean(parsed.phone) ?? undefined,
        emergencyPhone: clean(parsed.emergencyPhone) ?? undefined,
        emergencyName: clean(parsed.emergencyName) ?? undefined,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/profile/edit");

    return {
      success: true,
      message: "Profile updated successfully.",
      redirectTo: "/profile",
    };
  } catch (error) {
    return {
      success: false,
      message: getFriendlyErrorMessage(error),
    };
  }
};
