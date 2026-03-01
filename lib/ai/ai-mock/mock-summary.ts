export function generateMockSummary(data: Record<string, unknown>) {
  const createdDate = new Date(data.createdAt as string);
  const created = createdDate.toLocaleString();

  const assignedDate = data.assignedAt
    ? new Date(data.assignedAt as string)
    : null;

  const completed = data.completedAt
    ? new Date(data.completedAt as string).toLocaleString()
    : null;

  let responseTimeText = "Guard assignment pending.";

  if (assignedDate) {
    const diffMinutes = Math.round(
      (assignedDate.getTime() - createdDate.getTime()) / 60000,
    );

    responseTimeText =
      diffMinutes <= 5
        ? `Guard assigned in ${diffMinutes} minute(s) - excellent response time.`
        : `Guard assigned in ${diffMinutes} minute(s).`;
  }

  let completionText = "";

  if (completed) {
    const completedDate = new Date(data.completedAt as string);
    const totalMinutes = Math.round(
      (completedDate.getTime() - createdDate.getTime()) / 60000,
    );

    completionText = `Service completed in ${totalMinutes} minute(s).`;
  }

  const checkpointText =
    (data.checkpointCount as number) > 0
      ? `${data.checkpointCount} checkpoints recorded during service.`
      : "No checkpoints recorded during service.";

  return `
  ● Request created at ${created.toLocaleString()}
  ● ${responseTimeText}
  ● ${checkpointText}
  ● Current status: ${data.status}
  ● ${completionText || "Service ongoing or not yet completed."}
  `;
}
