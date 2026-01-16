"use server";

import { db } from "@/db/db";

export const getAdminRequestByIdAction = async (id: string) => {
  return db.request.findUnique({
    where: { id },
    include: {
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
