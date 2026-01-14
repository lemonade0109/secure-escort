"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { AdminRequestsQuery } from "@/types";
import { Prisma } from "@prisma/client";

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

export const getAdminRequests = async (query: AdminRequestsQuery) => {
  const limit = query.limit || 10;
  const page = Math.max(1, query.page || 1);
  const skip = (page - 1) * limit;

  const q = (query.q || "").trim();
  const status = query.status || "ALL";
  const type = query.type || "ALL";

  const where: Prisma.RequestWhereInput = {};
  if (status !== "ALL") where.status = status;
  if (type !== "ALL") where.type = type;

  if (q) {
    where.OR = [
      { trackingCode: { contains: q, mode: "insensitive" } },
      { user: { name: { contains: q, mode: "insensitive" } } },
      { user: { email: { contains: q, mode: "insensitive" } } },
    ];
  }

  const [total, requests] = await Promise.all([
    db.request.count({ where }),
    db.request.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        type: true,
        status: true,
        createdAt: true,
        trackingCode: true,
        details: true,
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    requests,
    total,
    page,
    limit,
    totalPages,
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
