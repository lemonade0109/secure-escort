"use server";

import { db } from "@/db/db";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { unstable_noStore as noStore } from "next/cache";

export const getMyNotificationAction = async (limit = 6) => {
  noStore();
  const { session } = await requireVerifiedUser();
  const userId = session.user.id;
  if (!userId) throw new Error("User not authenticated");

  const items = await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const unreadCount = await db.notification.count({
    where: { userId, readAt: null },
  });
  return { items, unreadCount };
};
