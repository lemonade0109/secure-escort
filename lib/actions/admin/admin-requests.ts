"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";

export const getAdminStats = async () => {
  const { session } = await requireVerifiedUser();
  const userIsAdmin = isAdmin(session?.user?.email || "");
  if (!userIsAdmin) {
    return { pending: 0, assigned: 0, inProgress: 0, completed: 0 };
  }

  // Fetch admin requests from your database
  const [pending, assigned, inProgress, completed] = await Promise.all([
    db.request.count({ where: { status: "PENDING" } }),
    db.request.count({ where: { status: "ASSIGNED" } }),
    db.request.count({ where: { status: "IN_PROGRESS" } }),
    db.request.count({ where: { status: "COMPLETED" } }),
  ]);

  return { pending, assigned, inProgress, completed };
};

export const getAdminRequests = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    db.request.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    }),
    db.request.count(),
  ]);

  return {
    data,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};

export const getRecentAdminRequests = async () => {
  const { session } = await requireVerifiedUser();
  const userIsAdmin = isAdmin(session?.user?.email || "");
  if (!userIsAdmin) {
    return [];
  }

  const requests = await db.request.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      type: true,
      status: true,
      createdAt: true,
      trackingCode: true,
    },
  });
  return requests;
};
