"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getRequestWindowAction } from "../guard/request-window";
import { BUSY_STATUSES } from "@/types";

function overlap(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

export const getAvailableGuardsForRequestsAction = async (
  requestId: string,
) => {
  const { session } = await requireVerifiedUser();
  if (!isAdmin(session.user.email)) throw new Error("Unauthorized");

  const req = await db.request.findUnique({
    where: { id: requestId },
    select: { id: true, details: true },
  });
  if (!req) throw new Error("Request not found");

  const window = await getRequestWindowAction(
    req.details as Record<string, unknown>,
  );
  if (!window) return null;

  // 1) Active guards
  const guards = await db.guardProfile.findMany({
    where: { active: true },
    select: {
      id: true,
      badgeId: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // 2) Remove busy guards
  const busyGuardIds = await db.request.findMany({
    where: { status: { in: BUSY_STATUSES } },
    select: { guardId: true },
  });

  const busySet = new Set(
    busyGuardIds.map((b) => b.guardId).filter(Boolean) as string[],
  );
  const notBusy = guards.filter((g) => !busySet.has(g.id));

  // 3) Load availability blocks for that day
  const availabilityBlocks = await db.guardAvailability.findMany({
    where: { day: window.day },
    select: { guardId: true, startMin: true, endMin: true },
  });

  const byGuard = new Map<string, { startMin: number; endMin: number }[]>();
  for (const block of availabilityBlocks) {
    if (!byGuard.has(block.guardId)) {
      byGuard.set(block.guardId, []);
    }
    byGuard
      .get(block.guardId)!
      .push({ startMin: block.startMin, endMin: block.endMin });
  }

  // 4) Filter to those that overlap with the request window
  const availableGuards = notBusy.filter((g) => {
    const blocks = byGuard.get(g.id) || [];
    return blocks.some((b) =>
      overlap(window.startMin, window.endMin, b.startMin, b.endMin),
    );
  });

  // format options
  return availableGuards.map((g) => ({
    id: g.id,
    label: `${g.user.name ?? "Guard"} ● ${g.badgeId ?? "NO_BADGE"}`,
  }));
};
