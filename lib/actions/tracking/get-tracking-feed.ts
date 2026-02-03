"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { getTrackingFeedSchema, validateWithZodSchema } from "@/lib/validators";

export type TrackingFeed = {
  latest: {
    lat: number | null;
    lng: number | null;
    accuracyM: number | null;
    speedMps: number | null;
    heading: number | null;
    createdAt: Date | null;
  };
  pings: Array<{
    id: string;
    lat: number | null;
    lng: number | null;
    accuracyM: number | null;
    speedMps: number | null;
    heading: number | null;
    createdAt: Date;
    source: string;
  }>;
};

export const getTrackingFeedAction = async (
  requestId: string,
  take = 50,
): Promise<TrackingFeed> => {
  try {
    const { session } = await requireVerifiedUser();
    const isAdminUser = isAdmin(session?.user?.email);
    const isGuardUser = session?.user?.role === "GUARD";

    const parsed = validateWithZodSchema(getTrackingFeedSchema, {
      requestId,
      take,
    });

    // Must be request owner or admin or assigned guard
    const req = await db.request.findUnique({
      where: { id: parsed.requestId },
      select: {
        id: true,
        userId: true,
        guardId: true,
      },
    });

    if (!req) throw new Error("Request not found.");

    // Only check authorization if NOT admin
    if (!isAdminUser) {
      const isOwner = req.userId === session?.user?.id;
      let isAssignedGuard = false;

      if (isGuardUser && req.guardId) {
        const guardProfile = await db.guardProfile.findUnique({
          where: { userId: session.user.id },
          select: { id: true },
        });

        isAssignedGuard = !!guardProfile && guardProfile.id === req.guardId;
      }

      if (!isOwner && !isAssignedGuard) {
        throw new Error("Unauthorized");
      }
    }

    const pings = await db.trackingPing.findMany({
      where: { requestId: req.id, kind: "LOCATION" },
      orderBy: { createdAt: "desc" },
      take: parsed.take ?? 50,
      select: {
        id: true,
        lat: true,
        lng: true,
        accuracyM: true,
        speedMps: true,
        heading: true,
        createdAt: true,
        source: true,
      },
    });

    const latestPing = pings[0] ?? null;

    return {
      latest: {
        lat: latestPing?.lat ?? null,
        lng: latestPing?.lng ?? null,
        accuracyM: latestPing?.accuracyM ?? null,
        speedMps: latestPing?.speedMps ?? null,
        heading: latestPing?.heading ?? null,
        createdAt: latestPing?.createdAt ?? null,
      },
      pings,
    };
  } catch (error) {
    console.error("getTrackingFeedAction:", error);
    throw new Error(getFriendlyErrorMessage(error));
  }
};
