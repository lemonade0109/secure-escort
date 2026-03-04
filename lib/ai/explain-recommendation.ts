import "server-only";

const HF_BASE_URL = "https://api-inference.huggingface.co/models";
const FALLBACK_MESSAGE = "I recommend this service based on your request. Share your location, time, and any special notes so we can dispatch quickly.";

type HuggingFaceResponse =
  | Array<{
      generated_text?: string;
      summary_text?: string;
      translation_text?: string;
    }>
  | {
      generated_text?: string;
      error?: string;
    };

type ServiceType = "ESCORT" | "DELIVERY" | "PERSONAL_SECURITY";

const readText = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const readNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const toServiceLabel = (service: string) => {
  if (service === "DELIVERY") return "Delivery Service";
  if (service === "PERSONAL_SECURITY") return "Personal Security Service";
  return "Escort Service";
};

const buildScenario = (context: Record<string, unknown>) => {
  const userText = readText(context.userText);
  const pickup = readText(context.pickup);
  const dropoff = readText(context.dropoff);
  const location = readText(context.location);
  const itemDescription = readText(context.itemDescription);
  const time = readText(context.time) || readText(context.date);
  const durationHours = readNumber(context.durationHours);

  const route =
    pickup && dropoff
      ? `from ${pickup} to ${dropoff}`
      : pickup
        ? `from ${pickup}`
        : dropoff
          ? `to ${dropoff}`
          : null;

  const place = route || (location ? `around ${location}` : null);
  const delivery = itemDescription
    ? `for delivering ${itemDescription}`
    : null;
  const duration =
    durationHours && durationHours > 0
      ? `for about ${durationHours} hour${durationHours > 1 ? "s" : ""}`
      : null;

  const parts = [delivery, place, time ? `at ${time}` : null, duration].filter(
    Boolean,
  );

  if (parts.length > 0) return parts.join(" ");
  if (userText) return `based on your request: \"${userText}\"`;
  return null;
};

const buildLocalExplanation = (
  service: ServiceType,
  context: Record<string, unknown>,
) => {
  const scenario = buildScenario(context);

  if (service === "DELIVERY") {
    return [
      scenario
        ? `Delivery Service is the best fit ${scenario}.`
        : "Delivery Service is the best fit for this request.",
      "It keeps the job focused on secure handoff, route planning, and status tracking instead of personal accompaniment.",
      "To dispatch fast, confirm pickup point, dropoff point, item details, and your preferred delivery window.",
    ].join(" ");
  }

  if (service === "PERSONAL_SECURITY") {
    return [
      scenario
        ? `Personal Security Service is the safest option ${scenario}.`
        : "Personal Security Service is the safest option for this situation.",
      "A dedicated guard can stay with you for an extended period, manage changing risks, and coordinate safe movement throughout the schedule.",
      "Please share the exact timeframe, key stops, and any high-risk concerns so planning can be done properly.",
    ].join(" ");
  }

  return [
    scenario
      ? `Escort Service is a strong fit ${scenario}.`
      : "Escort Service is a strong fit for your request.",
    "It gives you safe movement between locations with active route awareness and support at pickup and dropoff.",
    "For a faster dispatch, share where you’re starting, where you’re going, and when you want to move.",
  ].join(" ");
};

const buildPrompt = (service: string, context: Record<string, unknown>) => `
You are a professional security operations dispatcher.
Task: Explain why the recommended service fits the user's real-world situation.
Tone: Human, practical, reassuring, and specific. Avoid robotic phrasing.

Recommended service: ${service}
User context:
${JSON.stringify(context, null, 2)}

Write exactly 3 short sentences:
1) Confirm the recommendation with a realistic reason tied to context.
2) Explain what the team will practically do.
3) Ask for the 2-3 most important missing details needed to dispatch.

Do not mention AI, model confidence, or generic phrases like "service recommended".
`;

export const explainRecommendation = async (
  service: string,
  context: Record<string, unknown>,
) => {
  const fallback = buildLocalExplanation(
    (service as ServiceType) || "ESCORT",
    context,
  );

  const apiKey = process.env.HF_API_KEY;
  const model = process.env.HF_MODEL;

  if (!apiKey || !model) {
    console.warn("Missing Hugging Face env vars: HF_API_KEY or HF_MODEL");
    return fallback;
  }

  try {
    const response = await fetch(`${HF_BASE_URL}/${encodeURIComponent(model)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: buildPrompt(service, context),
        parameters: {
          max_new_tokens: 180,
          temperature: 0.45,
          return_full_text: false,
        },
      }),
      cache: "no-store",
    });

    const result = (await response.json()) as HuggingFaceResponse;

    if (!response.ok) {
      const message =
        !Array.isArray(result) && "error" in result ? result.error : undefined;
      throw new Error(message || "Hugging Face request failed");
    }

    if (Array.isArray(result)) {
      const text =
        result[0]?.generated_text ||
        result[0]?.summary_text ||
        result[0]?.translation_text;

      if (!text?.trim()) return fallback;

      return text.trim();
    }

    return result.generated_text?.trim() || fallback;
  } catch (error) {
    console.error(
      `Error generating explanation for ${toServiceLabel(service)}:`,
      error,
    );
    return fallback || FALLBACK_MESSAGE;
  }
};
