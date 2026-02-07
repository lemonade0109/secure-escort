"use server";

import { db } from "@/db/db";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";

export const getProfileAction = async () => {
  const { session } = await requireVerifiedUser();
  const userId = session?.user.id;
  if (!userId) return null;
  return await db.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      image: true,
      phone: true,
      emergencyName: true,
      emergencyPhone: true,
    },
  });
};
