"use server";

import { explainRecommendation } from "./explain-recommendation";
import { serviceRecommender } from "./service-recommender";

export const recommendServiceAction = async (data: Record<string, unknown>) => {
  const service = serviceRecommender(data);

  try {
    const explanation = await explainRecommendation(service, data);

    return {
      service,
      explanation: explanation?.trim() || "Service recommended.",
    };
  } catch (error) {
    console.error("Error explaining recommendation:", error);
    return {
      service,
      explanation: "Service recommended.",
    };
  }
};
