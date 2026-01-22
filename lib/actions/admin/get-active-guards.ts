"use server";

import { db } from "@/db/db";

export const getActiveGuardsAction = async () => {
  const guards = await db.guardProfile.findMany({
    where: { active: true },
    select: {
      id: true,
      badgeId: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
  return guards.map((guard) => ({
    id: guard.id,
    label: `${guard.user.name ?? "Guard"} ● ${guard.badgeId ?? "NO_BADGE"}`,
  }));
};
