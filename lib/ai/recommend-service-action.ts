"use server";

import { explainRecommendation } from "./explain-recommendation";
import { serviceRecommender } from "./service-recommender";

export const recommendServiceAction = async (data: Record<string, unknown>) => {
  const service = serviceRecommender(data);

  const explanation = await explainRecommendation(service, data);

  return {
    service,
    explanation,
  };
};
