"use server";

import { db } from "@/db/db";
import { BUSY_STATUSES, GuardOption } from "@/types";

export const getGuardOptionsForAssign = async (): Promise<GuardOption[]> => {
  const guards = await db.guardProfile.findMany({
    where: { active: true },
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const busyRequests = await db.request.findMany({
    where: {
      status: { in: BUSY_STATUSES },
      guardId: { not: null },
    },
    select: { guardId: true },
  });

  const busySet = new Set(
    busyRequests.map((req) => req.guardId).filter(Boolean),
  );

  return guards.map((guard) => {
    const name = guard.user?.name ?? guard.user?.email ?? "Guard";
    const badge = guard.badgeId ? `(${guard.badgeId})` : "";
    const isBusy = busySet.has(guard.id);

    return {
      id: guard.id,
      label: `${name} ${badge} ● ${isBusy ? "BUSY" : "AVAILABLE"}`,
      disabled: isBusy,
    };
  });
};
