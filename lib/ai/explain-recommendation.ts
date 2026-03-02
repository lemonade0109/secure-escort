export const explainRecommendation = async (
  service: string,
  context: Record<string, unknown>,
) => {
  //TODO: Add the actual AI provider here..
  const response = await fetch(process.env.AI_PROVIDER_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AI_PROVIDER_KEY}`,
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are a professional security dispatch assistant. Explain why the recommended service fits the user's needs. Be clear and confident.",
        },
        {
          role: "user",
          content: `Recommended service: ${service}. Context: ${JSON.stringify(context)}`,
        },
      ],
    }),
  });

  const result = await response.json();
  return result.choices[0]?.message?.content ?? "Service recommended.";
};
