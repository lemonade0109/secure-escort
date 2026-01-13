import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { RecentRequestProps } from "@/types";
import React from "react";
import StatusPill from "../requests/status-pill";

const RecentRequests: React.FC<{ requests: RecentRequestProps[] }> = (
  props
) => {
  return (
    <Card className="relative overflow-hidden text-white border border-white/10 bg-white/5 backdrop-blur-xl">
      {/* top glow divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />

      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm tracking-widest uppercase text-white/70">
          Recent Requests
        </CardTitle>

        <Button
          asChild
          variant="outline"
          className="text-white border-white/15 bg-white/5 hover:text-white/90 hover:bg-white/10"
        >
          <Link href="/request">New Request</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {props.requests.length === 0 ? (
          <div className="p-5 border rounded-xl border-white/10 bg-white/3">
            <p className="text-sm text-white/80">No requests yet</p>

            <p className="mt-1 text-xs text-white/60">
              Your latest escort or delivery requests will appear here once
              created.
            </p>
          </div>
        ) : (
          props.requests.map((request) => (
            <Link
              key={request.id}
              href={`/request/${request.id}`}
              className="block p-4 transition border rounded-xl border-white/10 bg-white/3 hover:bg-white/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">
                    {request.type === "ESCORT"
                      ? "Escort Service"
                      : request.type === "DELIVERY"
                        ? "Delivery Service"
                        : "Personal Security"}
                    <span className="text-white/70">
                      {" "}
                      • {request.trackingCode}
                    </span>
                  </p>
                  {request.type !== "PERSONAL_SECURITY" && (
                    <p className="mt-1 text-xs text-white/70">
                      From: {request.details?.pickup || "N/A"}, To:{" "}
                      {request.details?.dropoff || "N/A"}
                    </p>
                  )}

                  {request.type === "PERSONAL_SECURITY" && (
                    <p className="mt-1 text-xs text-white/70">
                      Location: {request.details?.location || "N/A"}
                    </p>
                  )}
                </div>

                <StatusPill status={request.status} />
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentRequests;
