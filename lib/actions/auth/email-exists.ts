"use server";

import { db } from "@/db/db";
import { getFriendlyErrorMessage } from "@/lib/utils";

export const emailExists = async (
  email: string
): Promise<{ exists: boolean; error?: string }> => {
  try {
    const user = await db.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true },
    });
    return { exists: !!user };
  } catch (error) {
    console.error("Database error in emailExists:", error);
    return {
      exists: false,
      error: getFriendlyErrorMessage(error),
    };
  }
};
