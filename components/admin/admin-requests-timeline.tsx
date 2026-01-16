import React from "react";

type StatusProps =
  | "PENDING"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
const AdminRequestsTimeline: React.FC<{
  requestId: string;
  status: StatusProps;
}> = ({ requestId, status }) => {
  return <div>AdminRequestsTimeline</div>;
};

export default AdminRequestsTimeline;
