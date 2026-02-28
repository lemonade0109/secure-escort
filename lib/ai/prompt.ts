export function buildTimelineSummaryPrompt(data: Record<string, unknown>) {
  return `
        You are an operations assistant.

        Summarize the following escort service request in a structured bullet format.
        Request Data:
        ${JSON.stringify(data, null, 2)}

        Return:
      ● Timeline summary
      ● Response time if available
      ● Checkpoint count
      ● Final status  
    `;
}
