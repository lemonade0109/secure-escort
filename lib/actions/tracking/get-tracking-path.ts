"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";

export type TrackingPoint = {
  lat: number;
  lng: number;
  createdAt: string;
};

export async function getTrackingPathAction(
  requestId: string,
): Promise<{ points: TrackingPoint[] }> {
  const { session } = await requireVerifiedUser();

  const userId = session.user.id;
  const role = session.user.role;
  const AdminUser = isAdmin(session?.user.email || "");

  const req = await db.request.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      userId: true,
      guardId: true,
    },
  });

  if (!req) return { points: [] };

  if (!AdminUser) {
    if (role === "GUARD") {
      const guard = await db.guardProfile.findUnique({
        where: { userId },
        select: { id: true },
      });
      if (!guard || req.guardId !== guard.id) return { points: [] };
    } else {
      if (req.userId !== userId) return { points: [] };
    }
  }

  const pings = await db.trackingPing.findMany({
    where: {
      requestId,
      lat: { not: null },
      lng: { not: null },
      kind: "LOCATION",
    },
    select: {
      lat: true,
      lng: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
    take: 500,
  });

  return {
    points: pings.map((ping) => ({
      lat: ping.lat!,
      lng: ping.lng!,
      createdAt: ping.createdAt.toISOString(),
    })),
  };
}
