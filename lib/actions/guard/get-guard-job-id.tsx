"use server";

import { db } from "@/db/db";

export const getGuardJobByIdAction = async (guardId: string) => {
  return db.request.findMany({
    where: { guardId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      trackingCode: true,
      type: true,
      status: true,
      createdAt: true,
      details: true,
    },
  });
};
