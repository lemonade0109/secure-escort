"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { RequestEvent } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";

type createEventType = {
  requestId: string;
  type: RequestEvent["type"];
  message: string;
  meta: Record<string, unknown>;
};

// Create a new request event (admin only)
export const createRequestEvent = async (input: createEventType) => {
  const { session } = await requireVerifiedUser();
  if (!isAdmin(session?.user?.email)) throw new Error("Unauthorized");

  await db.requestEvent.create({
    data: {
      requestId: input.requestId,
      type: input.type,
      message: input.message,
      meta: (input.meta ?? {}) as InputJsonValue,
      actorId: session?.user?.id,
    },
  });
};

// Get all events for a specific request (admin only)
export const getRequestEventsByRequestId = async (requestId: string) => {
  const { session } = await requireVerifiedUser();
  if (!isAdmin(session?.user?.email)) throw new Error("Unauthorized");

  return await db.requestEvent.findMany({
    where: { requestId },
    orderBy: { createdAt: "desc" },
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};
