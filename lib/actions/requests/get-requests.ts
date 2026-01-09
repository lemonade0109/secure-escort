"use server";

import { auth } from "@/auth";
import { db } from "@/db/db";

export async function getRequestAction() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const [total, active, completed, recent] = await Promise.all([
    db.request.count({ where: { userId } }),
    db.request.count({
      where: { userId, status: { in: ["PENDING", "ASSIGNED", "IN_PROGRESS"] } },
    }),
    db.request.count({ where: { userId, status: "COMPLETED" } }),
    db.request.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        trackingCode: true,
        type: true,
        status: true,
        createdAt: true,
        details: true,
      },
    }),
  ]);

  return {
    stats: { total, active, completed },
    recent,
  };
}
