"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { Prisma } from "@prisma/client";

export type ActiveFilter = "ALL" | "ACTIVE" | "INACTIVE";

export type GuardListFilters = {
  q?: string; //search by name, email, badgeId
  active?: ActiveFilter;
  page?: number;
  limit?: number;
};

function buildWhere(q: string, active: ActiveFilter) {
  const activeWhere = active === "ALL" ? {} : { active: active === "ACTIVE" };

  const queryWhere = q
    ? {
        OR: [
          { badgeId: { contains: q, mode: "insensitive" as Prisma.QueryMode } },
          { phone: { contains: q, mode: "insensitive" as Prisma.QueryMode } },
          {
            user: {
              is: {
                name: { contains: q, mode: "insensitive" as Prisma.QueryMode },
              },
            },
          },
          {
            user: {
              is: {
                email: { contains: q, mode: "insensitive" as Prisma.QueryMode },
              },
            },
          },
        ],
      }
    : {};
  return {
    ...activeWhere,
    ...queryWhere,
  };
}

export const getAdminGuardsAction = async (filters: GuardListFilters = {}) => {
  const { session } = await requireVerifiedUser();
  if (!isAdmin(session?.user?.email)) throw new Error("Unauthorized");

  const q = (filters.q ?? "").toLowerCase().trim();
  const active = filters.active ?? ("ALL" as ActiveFilter);

  const limit = Math.min(Math.max(filters.limit ?? 10, 5), 50);
  const page = Math.max(filters.page ?? 1, 1);
  const skip = (page - 1) * limit;

  const where = buildWhere(q, active);

  const [total, guards] = await Promise.all([
    db.guardProfile.count({ where }),
    db.guardProfile.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    guards,
    total,
    page,
    limit,
    totalPages,
  };
};
