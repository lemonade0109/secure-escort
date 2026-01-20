"use server";

import { db } from "@/db/db";

export const getAdminRequestByIdAction = async (id: string) => {
  return db.request.findUnique({
    where: { id },
    select: {
      id: true,
      trackingCode: true,
      type: true,
      status: true,
      details: true,
      createdAt: true,
      updatedAt: true,
      etaFrom: true,
      etaTo: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      guard: {
        select: {
          id: true,
          badgeId: true,
          phone: true,
          active: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};
