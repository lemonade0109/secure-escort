export const generateTimelineSummaryPrompt = async (
  timeline: Record<string, unknown>,
) => {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://secure-escort.vercel.app/",
        "X-Title": "Secure Escort AI",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          {
            role: "system",
            content: "You are a professional operations analyst.",
          },
          {
            role: "user",
            content: `Summarize the following escort request in a concise structured bullet format.
          
          Request Data: 
          ${JSON.stringify(timeline, null, 2)}

          Return:
          ● Timeline summary
          ● Response time if available
          ● Checkpoint count
          ● Any delays 
          ● Final status
          `,
          },
        ],
        temperature: 0.2,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("OpenRouter full error", result);
    throw new Error(result.error?.message || "AI request failed");
  }

  return result.choices[0].message.content;
};
