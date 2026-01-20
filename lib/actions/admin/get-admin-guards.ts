"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";

export type GuardListFilters = {
  q?: string; //search by name, email, badgeId
  active?: "ALL" | "ACTIVE" | "INACTIVE";
};

export const getAdminGuardsAction = async (filters: GuardListFilters = {}) => {
  const { session } = await requireVerifiedUser();
  if (!isAdmin(session?.user?.email)) throw new Error("Unauthorized");

  const q = (filters.q ?? "").toLowerCase();
  const activeFilter = filters.active ?? "ALL";

  return db.guardProfile.findMany({
    where: {
      ...(activeFilter !== "ALL" ? { active: activeFilter === "ACTIVE" } : {}),
      ...(q ? {
        OR: [
          { badgeId: { contains: q, mode: "insensitive" } },
          {phone: { contains: q, mode: "insensitive" } },
          {user: {is: {name: { contains: q, mode: "insensitive" } }}},
          {user: {is: {email: { contains: q, mode: "insensitive" } }}},
        ]
      }
      : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { updatedAt: "desc"},    
    take: 50
  });
};
