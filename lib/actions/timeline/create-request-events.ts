"use server";

import { db } from "@/db/db";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { RequestEvent, Role } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";

type createEventType = {
  requestId: string;
  type: RequestEvent["type"];
  message: string;
  meta: Record<string, unknown>;
  actorId?: string | null;
  actorRole?: Role | null;
  actorName?: string | null;
  actorEmail?: string | null;
};

// Create a new request event (admin only)
export const createRequestEvent = async (input: createEventType) => {
  const { session } = await requireVerifiedUser();

  await db.requestEvent.create({
    data: {
      requestId: input.requestId,
      type: input.type,
      message: input.message,
      meta: (input.meta ?? {}) as InputJsonValue,
      actorId: input.actorId ?? session?.user?.id ?? null,
      actorRole: input.actorRole ?? null,
      actorName: input.actorName ?? session?.user?.name ?? null,
      actorEmail: input.actorEmail ?? session?.user?.email ?? null,
    },
  });
};
