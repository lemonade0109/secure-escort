"use server";

import { db } from "@/db/db";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";

export const getLatestCheckpoint = async (requestId: string) => {
  await requireVerifiedUser();
  return db.trackingPing.findFirst({
    where: { requestId, kind: "CHECKPOINT" },
    orderBy: { createdAt: "desc" },
    select: { label: true, note: true, createdAt: true },
  });
};
