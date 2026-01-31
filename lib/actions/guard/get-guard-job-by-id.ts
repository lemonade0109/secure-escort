"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";

export const getGuardJobByIdAction = async (requestId: string) => {
  const { session } = await requireVerifiedUser();

  const isAdminUser = isAdmin(session?.user?.email);
  const userId = session?.user?.id;
  const role = session?.user?.role;

  if (!userId) return null;
  if (!isAdminUser && role !== "GUARD") return null;

  const guardProfile = await db.guardProfile.findUnique({
    where: { userId },
    select: { id: true, active: true },
  });

  if (!guardProfile) return null;

  // Guard can only read their own job
  return db.request.findFirst({
    where: { id: requestId, guardId: guardProfile.id },
    select: {
      user: { select: { name: true, email: true } },
      etaFrom: true,
      details: true,
      id: true,
      trackingCode: true,
      type: true,
      status: true,
      createdAt: true,
    },
  });
};
