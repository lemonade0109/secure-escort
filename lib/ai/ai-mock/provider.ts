import { generateMockSummary } from "./mock-summary";

export async function aiSummarizeTimeline(data: Record<string, unknown>) {
  // For portfolio demo, use mock engine

  return generateMockSummary(data);
}
