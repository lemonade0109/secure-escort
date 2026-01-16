"use server";

import { db } from "@/db/db";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";

const ALLOWED_TYPES = ["PERSONAL_SECURITY", "ESCORT", "DELIVERY"] as const;
const ALLOWED_STATUS = [
  "PENDING",
  "COMPLETED",
  "CANCELLED",
  "ASSIGNED",
  "IN_PROGRESS",
] as const;

export const getAllRequestsAction = async ({
  type,
  status,
}: {
  type: string | undefined;
  status: string | undefined;
}) => {
  const { session } = await requireVerifiedUser();
  const userId = session.user?.id;

  const where: { userId: string | undefined; [key: string]: unknown } = {
    userId,
  };
  if (type && (ALLOWED_TYPES as readonly string[]).includes(type))
    where.type = type;

  if (status && (ALLOWED_STATUS as readonly string[]).includes(status))
    where.status = status;

  const requests = await db.request.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      status: true,
      trackingCode: true,
      createdAt: true,
      details: true,
    },
  });

  return requests;
};
