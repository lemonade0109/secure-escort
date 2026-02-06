"use server";

import { db } from "@/db/db";

export const getGuardRatingStatsAction = async (guardId: string) => {
  const [aggregate, reviews] = await Promise.all([
    db.review.aggregate({
      where: { guardId },
      _avg: { rating: true },
      _count: { rating: true },
    }),

    db.review.findMany({
      where: { guardId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: {
          select: { name: true },
        },
      },
    }),
  ]);

  return {
    average: aggregate._avg.rating || 0,
    total: aggregate._count.rating || 0,
    recent: reviews,
  };
};
