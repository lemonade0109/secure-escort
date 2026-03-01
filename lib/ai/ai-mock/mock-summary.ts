export function generateMockSummary(data: Record<string, unknown>) {
  const created = new Date(data.createdAt as string).toLocaleString();

  const assigned = data.assignedAt
    ? new Date(data.assignedAt as string).toLocaleString()
    : "N/A";
  const completed = data.completedAt
    ? new Date(data.completedAt as string).toLocaleString()
    : "N/A";
}
