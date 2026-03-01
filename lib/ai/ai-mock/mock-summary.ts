export function generateMockSummary(data: Record<string, unknown>) {
  const created = new Date(data.createdAt as string).toLocaleString();

  const assignedEvent = (data.requestEvents as Record<string, unknown>[])?.find(
    (event: Record<string, unknown>) => event.type === "ASSIGNED",
  );
  const inProgressEvent = (
    data.requestEvents as Record<string, unknown>[]
  )?.find((event: Record<string, unknown>) => event.type === "IN_PROGRESS");
  const completedEvent = (
    data.requestEvents as Record<string, unknown>[]
  )?.find((event: Record<string, unknown>) => event.type === "COMPLETED");

  const responseTime = assignedEvent
    ? "Guard assigned immediately after request creation"
    : "Guard assignment pending";

  return `
    ● Requested created at ${created}
    ● ${responseTime}
    ● ${data.checkpointCount ?? 0} checkpoints recorded
    ● Service status: ${data.status}
    ● Timeline: ${assignedEvent ? "Guard assigned" : "Awaiting guard assignment"} → ${
      inProgressEvent ? "Service in progress" : "Service not started"
    } → ${completedEvent ? "Service completed" : "Service ongoing or pending"}
    `;
}
