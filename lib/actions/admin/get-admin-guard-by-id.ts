"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";

export const getAdminGuardByIdAction = async (guardId: string) => {
  const { session } = await requireVerifiedUser();
  if (!isAdmin(session?.user?.email)) throw new Error("Unauthorized");

  const guard = await db.guardProfile.findUnique({
    where: { id: guardId },
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  });
  if (!guard) return null;

  // Requests currently assigned to this guard
  const activeRequests = await db.request.findMany({
    where: {
      guardId: guard.id,
      status: { in: ["ASSIGNED", "IN_PROGRESS"] },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      createdAt: true,
      trackingCode: true,
      type: true,
      updatedAt: true,
      details: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  // Recently completed requests by this guard
  const completedRequests = await db.request.findMany({
    where: {
      guardId: guard.id,
      status: "COMPLETED",
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
    select: {
      id: true,
      status: true,
      createdAt: true,
      trackingCode: true,
      type: true,
      updatedAt: true,
      details: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return { ...guard, activeRequests, completedRequests };
};
