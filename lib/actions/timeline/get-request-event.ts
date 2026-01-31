"use server";

import { db } from "@/db/db";

// Get all events for a specific request (admin only)
export const getRequestEventsByRequestId = async (requestId: string) => {
  return await db.requestEvent.findMany({
    where: { requestId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
};
