"use server";

import { db } from "@/db/db";
import { aiSummarizeTimeline } from "./provider";

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
  const structuredData = {
    requestId: request.id,
    createdAt: request.createdAt,
    status: request.status,
    requestEvents: request.requestEvents.map((event) => ({
      type: event.type,
      createdAt: event.createdAt,
    })),
    checkpointCount: request.trackingPings.length,
  };

  const summary = await aiSummarizeTimeline(structuredData);

  return { success: true, summary };
}
