import { RequestListsProps } from "@/types";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import StatusBadge from "./status-badge";

function normalizeDetails(details: unknown): Record<string, unknown> {
  if (!details) return {};
  if (typeof details === "string") {
    try {
      return JSON.parse(details);
    } catch {
      return {};
    }
  }
  if (typeof details === "object") {
    return details as Record<string, unknown>;
  }
  return {};
}

function typeLabel(type: string) {
  switch (type) {
    case "PERSONAL_SECURITY":
      return "Personal Security";
    case "ESCORT":
      return "Escort";
    case "DELIVERY":
      return "Delivery";
    default:
      return type;
  }
}

function summary(type: string, details: Record<string, unknown>) {
  if (type === "PERSONAL_SECURITY")
    return details.location ? `Location: ${details.location}` : "-";
  if (type === "ESCORT")
    return details.pickup && details.dropoff
      ? `From ${details.pickup} to ${details.dropoff}`
      : "-";
  if (type === "DELIVERY")
    return details.pickup && details.dropoff
      ? `From ${details.pickup} to ${details.dropoff}`
      : "-";
  return "Service Request";
}

const RequestList: React.FC<RequestListsProps> = ({ requests }) => {
  return (
    <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Your Requests</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {requests.length === 0 ? (
          <div className="p-4 border rounded-xl border-white/10 bg-white/3">
            <p className="text-sm text-white/80">No requests found.</p>
            <p className="mt-1 text-xs text-white/60">
              Try adjusting your filters or create a new request..
            </p>
          </div>
        ) : (
          requests.map((request) => {
            const details = normalizeDetails(request.details);

            return (
              <Link
                href={`/request/${request.id}`}
                key={request.id}
                className="block p-4 transition duration-300 border rounded-xl border-white/10 bg-white/3 hover:bg-white/6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">
                      {typeLabel(request.type)}
                    </p>
                    <p className="mt-1 text-xs text-white/70">
                      {summary(request.type, details)}
                    </p>
                    <p className="mt-2 font-mono text-xs text-white/60">
                      {request.trackingCode}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={request.status} />
                    <span className="text-xs text-white/50">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default RequestList;
