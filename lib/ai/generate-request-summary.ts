"use server";

import { db } from "@/db/db";
import { generateTimelineSummaryPrompt } from "./timeline-summary";

export const generateRequestSummary = async (requestId: string) => {
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
    status: request.status,
    createdAt: request.createdAt,
    events: request.requestEvents.map((event) => ({
      type: event.type,
      createdAt: event.createdAt,
    })),
    checkpointsCount: request.trackingPings.length,
  };

  const summary = await generateTimelineSummaryPrompt(structuredData);

  return { success: true, summary };
};
