"use server";

import { db } from "@/db/db";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";

export const getRequestDetailAction = async (id: string) => {
  const { session } = await requireVerifiedUser();
  const userId = session.user?.id;

  const req = await db.request.findUnique({
    where: { id, userId },
    select: {
      id: true,
      trackingCode: true,
      type: true,
      status: true,
      createdAt: true,
      details: true,
      etaFrom: true,
      etaTo: true,
    },
  });
  return req;
};
