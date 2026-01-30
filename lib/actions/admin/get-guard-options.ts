"use server";

import { db } from "@/db/db";
import { BUSY_STATUSES, GuardOption } from "@/types";
import { getRequestWindowAction } from "@/lib/actions/guard/request-window";

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

export const getGuardOptionsForAssignRequestAction = async (
  requestId: string,
): Promise<{ currentGuardId: string | null; options: GuardOption[] }> => {
  // 1) Get request (we need details + current guard)
  const req = await db.request.findUnique({
    where: { id: requestId },
    select: { id: true, details: true, guardId: true },
  });
  if (!req) throw new Error("Request not found");

  const currentGuardId = req.guardId ?? null;

  // 2) Build request time window (day + minutes)
  const window = await getRequestWindowAction(
    req.details as Record<string, unknown>,
  );

  if (!window) {
    // If window can't be derived, fall back to your old behavior (no availability filtering)
    // rare case but possible if date/time missing or invalid
    const options = await getGuardOptionsFallback();
    return { currentGuardId, options };
  }

  // 3) Guards list
  const guards = await db.guardProfile.findMany({
    where: { active: true },
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const guardIds = guards.map((g) => g.id);

  // 4) Availability blocks for request day
  const dayBlocks = await db.guardAvailability.findMany({
    where: { day: window.day, guardId: { in: guardIds } },
    select: { guardId: true, startMin: true, endMin: true },
  });

  const blocksByGuard = new Map<
    string,
    { startMin: number; endMin: number }[]
  >();
  for (const b of dayBlocks) {
    const arr = blocksByGuard.get(b.guardId) || [];
    arr.push({ startMin: b.startMin, endMin: b.endMin });
    blocksByGuard.set(b.guardId, arr);
  }

  // 5) Busy guards (exclude THIS request so reassignment still possible)
  const busyRequests = await db.request.findMany({
    where: {
      status: { in: BUSY_STATUSES },
      guardId: { in: guardIds },
      NOT: { id: requestId },
    },
    select: { guardId: true, id: true, details: true },
  });

  // Build busySet ONLY when their busy job overlap = busy for this request window
  const busySet = new Set<string>();
  for (const br of busyRequests) {
    if (!br.guardId) continue;
    const jobWindow = await getRequestWindowAction(
      br.details as Record<string, unknown>,
    );
    if (!jobWindow) continue;

    // same day + time overlap = busy for this request
    if (String(jobWindow.day) === String(window.day)) {
      if (
        overlaps(
          window.startMin,
          window.endMin,
          jobWindow.startMin,
          jobWindow.endMin,
        )
      ) {
        busySet.add(br.guardId);
      }
    }
  }

  // 6) Filter and map options
  const options: GuardOption[] = guards

    .filter((g) => {
      if (currentGuardId && g.id === currentGuardId) {
        return true; // always include current guard
      }

      const blocks = blocksByGuard.get(g.id) ?? [];
      return blocks.some((b) =>
        overlaps(window.startMin, window.endMin, b.startMin, b.endMin),
      );
    })
    .map((guard) => {
      const name = guard.user?.name ?? guard.user?.email ?? "Guard";
      const badge = guard.badgeId ? `(${guard.badgeId})` : "";
      const isCurrent = currentGuardId === guard.id;
      const isBusy = busySet.has(guard.id);

      return {
        id: guard.id,
        label: `${name} ${badge} ● ${isCurrent ? "CURRENT" : isBusy ? "BUSY" : "AVAILABLE"}`,
        disabled: !isCurrent && isBusy,
      };
    });

  return { currentGuardId, options };
};

// Function below not needed, might delete later
// fallback = your old logic (no availability filtering)
async function getGuardOptionsFallback(): Promise<GuardOption[]> {
  const guards = await db.guardProfile.findMany({
    where: { active: true },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });

  const busyRequests = await db.request.findMany({
    where: { status: { in: BUSY_STATUSES }, guardId: { not: null } },
    select: { guardId: true },
  });

  const busySet = new Set(
    busyRequests.map((req) => req.guardId).filter(Boolean) as string[],
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
}
