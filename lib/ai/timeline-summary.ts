import { openai } from "./client";
import { buildTimelineSummaryPrompt } from "./prompt";

export const generateTimelineSummaryPrompt = async (
  timeline: Record<string, unknown>,
) => {
  const prompt = buildTimelineSummaryPrompt(timeline);

  // Call the OpenAI API with the generated prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a professional operations analyst." },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  return response.choices[0].message.content;
};
