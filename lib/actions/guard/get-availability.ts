"use server";

import { db } from "@/db/db";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";

export const getGuardAvailabilityBlocksAction = async () => {
  const { session } = await requireVerifiedUser();
  const userId = session?.user?.id;

  if (!userId) return null;

  const guard = await db.guardProfile.findUnique({
    where: { userId },
    select: { id: true, active: true },
  });

  if (!guard) return null;

  const blocks = await db.guardAvailability.findMany({
    where: { guardId: guard.id },
    orderBy: [{ day: "asc" }, { startMin: "asc" }],
  });

  return { guard, blocks };
};
