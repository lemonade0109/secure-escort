import "server-only";

const HF_BASE_URL = "https://api-inference.huggingface.co/models";
const FALLBACK_MESSAGE = "Service recommended.";

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

const buildPrompt = (service: string, context: Record<string, unknown>) => `
You are a professional security dispatch assistant.
Task: Explain why the recommended service fits the user's needs.
Tone: Clear, confident, concise.

Recommended service: ${service}
User context:
${JSON.stringify(context, null, 2)}

Return 2-4 short sentences. Mention practical safety/logistics reasons.
`;

export const explainRecommendation = async (
  service: string,
  context: Record<string, unknown>,
) => {
  const apiKey = process.env.HF_API_KEY;
  const model = process.env.HF_MODEL;

  if (!apiKey || !model) {
    console.warn("Missing Hugging Face env vars: HF_API_KEY or HF_MODEL");
    return FALLBACK_MESSAGE;
  }

  const response = await fetch(`${HF_BASE_URL}/${encodeURIComponent(model)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      inputs: buildPrompt(service, context),
      parameters: {
        max_new_tokens: 160,
        temperature: 0.3,
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
    return text?.trim() || FALLBACK_MESSAGE;
  }

  return result.generated_text?.trim() || FALLBACK_MESSAGE;
};
