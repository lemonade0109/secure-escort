"use server";

import { db } from "@/db/db";
import { aiSummarizeTimeline } from "./provider";
import { RequestEventType } from "@prisma/client";

export async function mockGenerateRequestSummary(requestId: string) {
  const request = await db.request.findUnique({
    where: { id: requestId },
    include: {
      requestEvents: true,
      trackingPings: true,
    },
  });
  if (!request) {
    return { success: false, message: "Request not found" };
  }

  const assignedEvent = request.requestEvents.find(
    (event) => event.type === RequestEventType.GUARD_ASSIGNED,
  );
  const completedEvent = request.requestEvents.find(
    (event) => event.type === RequestEventType.JOB_COMPLETED,
  );
  const structuredData = {
    createdAt: request.createdAt,
    status: request.status,
    checkpointCount: request.trackingPings.length,
    assignedAt: assignedEvent?.createdAt ?? null,
    completedAt: completedEvent?.createdAt ?? null,
  };

  const summary = await aiSummarizeTimeline(structuredData);

  return { success: true, summary };
}
