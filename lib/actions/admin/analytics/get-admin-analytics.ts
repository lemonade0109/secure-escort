"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage } from "@/lib/utils";

type AnalyticsResult =
  | {
      ok: true;
      todayTotal: number;
      activeNow: number;
      last7dTotal: number;
      last7dCompleted: number;
      completionRate7d: number;
      avgAssignMins7d: number | null;
      avgCompleteMins7d: number | null;
      peakHours7d: { hour: number; count: number }[];
      topGuards7d: {
        guardId: string;
        name: string;
        email: string;
        badgeId: string | null;
        completedCount: number;
      }[];
    }
  | {
      ok: false;
      message: string;
    };

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export const getAdminAnalyticsAction = async (): Promise<AnalyticsResult> => {
  try {
    const { session } = await requireVerifiedUser();

    if (!isAdmin(session?.user.email || "")) {
      return {
        ok: false,
        message: "Unauthorized",
      };
    }
    const today = startOfToday();
    const since7d = daysAgo(7);

    // 1) Request today
    const todayTotal = await db.request.count({
      where: { createdAt: { gte: today } },
    });

    // 2) Active now (in progress)
    const activeNow = await db.request.count({
      where: { status: { in: ["IN_PROGRESS", "ASSIGNED"] } },
    });

    // 3) Completion rate in last 7d
    const [last7dTotal, last7dCompleted] = await Promise.all([
      db.request.count({ where: { createdAt: { gte: since7d } } }),
      db.request.count({
        where: {
          createdAt: { gte: since7d },
          status: "COMPLETED",
        },
      }),
    ]);

    const completionRate7d =
      last7dTotal > 0 ? last7dCompleted / last7dTotal : 0;

    // 4) Peak hours (7d) from request.createdAt
    const last7dRequests = await db.request.findMany({
      where: { createdAt: { gte: since7d } },
      select: { createdAt: true },
    });

    const hourCounts = new Array(24).fill(0) as number[];
    for (const req of last7dRequests) {
      const hour = new Date(req.createdAt).getHours();
      hourCounts[hour]++;
    }

    const peakHours7d = hourCounts.map((count, hour) => ({ hour, count }));

    // 5) Avg Assignment + completion time using RequestEvent
    const reqIds7d = await db.request.findMany({
      where: { createdAt: { gte: since7d } },
      select: { id: true, createdAt: true },
    });

    const ids = reqIds7d.map((r) => r.id);
    const events = await db.requestEvent.findMany({
      where: {
        requestId: { in: ids },
        type: { in: ["STATUS_CHANGED"] },
      },
      select: { requestId: true, createdAt: true, meta: true },
      orderBy: { createdAt: "asc" },
    });

    const createdMap = new Map(reqIds7d.map((r) => [r.id, r.createdAt]));
    const assignedAt = new Map<string, Date>();
    const completedAt = new Map<string, Date>();

    for (const ev of events) {
      const meta = (ev.meta ?? {}) as Record<string, unknown>;
      const to = String(meta.to || "").toUpperCase();

      if (to === "ASSIGNED" && !assignedAt.has(ev.requestId)) {
        assignedAt.set(ev.requestId, ev.createdAt);
      } else if (to === "COMPLETED" && !completedAt.has(ev.requestId)) {
        completedAt.set(ev.requestId, ev.createdAt);
      }
    }

    const assignedDiffs: number[] = [];
    const completedDiffs: number[] = [];

    for (const { id } of reqIds7d) {
      const created = createdMap.get(id);
      if (!created) continue;

      const a = assignedAt.get(id);
      if (a) assignedDiffs.push((a.getTime() - created.getTime()) / 60000);

      const c = completedAt.get(id);
      if (c) completedDiffs.push((c.getTime() - created.getTime()) / 60000);
    }

    const avg = (arr: number[]) =>
      arr.length
        ? Math.round((arr.reduce((s, x) => s + x, 0) / arr.length) * 10) / 10
        : null;

    const avgAssignMins7d = avg(assignedDiffs);
    const avgCompletedMin7d = avg(completedDiffs);

    // 6) Top guards (7d) by completed requests
    const completedWithGuards = await db.request.findMany({
      where: {
        createdAt: { gte: since7d },
        status: "COMPLETED",
        guardId: { not: null },
      },
      select: { guardId: true },
    });

    const guardCounts = new Map<string, number>();
    for (const req of completedWithGuards) {
      if (!req.guardId) continue;
      guardCounts.set(req.guardId, (guardCounts.get(req.guardId) || 0) + 1);
    }

    const guardIds = [...guardCounts.keys()];
    const guards = await db.guardProfile.findMany({
      where: { id: { in: guardIds } },
      include: { user: { select: { name: true, email: true } } },
    });

    const topGuards7d = guards
      .map((g) => ({
        guardId: g.id,
        name: g.user.name ?? "",
        email: g.user.email ?? "",
        badgeId: g.badgeId ?? null,
        completedCount: guardCounts.get(g.id) || 0,
      }))
      .sort((a, b) => b.completedCount - a.completedCount)
      .slice(0, 6);

    return {
      ok: true,
      todayTotal,
      activeNow,
      last7dCompleted,
      last7dTotal,
      completionRate7d,
      avgAssignMins7d,
      avgCompleteMins7d: avgCompletedMin7d,
      peakHours7d,
      topGuards7d,
    };
  } catch (error) {
    return {
      ok: false,
      message: getFriendlyErrorMessage(error),
    };
  }
};
