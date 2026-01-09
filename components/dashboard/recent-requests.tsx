import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { RecentRequestProps } from "@/types";
import { Badge } from "../ui/badge";

export function statusVariant(status: RecentRequestProps["status"]) {
  switch (status) {
    case "COMPLETED":
      return "secondary";
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
}

const RecentRequests: React.FC<{ requests: RecentRequestProps[] }> = (
  props
) => {
  return (
    <Card
      className="
        relative overflow-hidden
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        text-white
      "
    >
      {/* top glow divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />

      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm uppercase tracking-widest text-white/70">
          Recent Requests
        </CardTitle>

        <Button
          asChild
          variant="outline"
          className="
            border-white/15
            bg-white/5
            text-white
            hover:text-white/90
            hover:bg-white/10
          "
        >
          <Link href="/request">New Request</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {props.requests.length === 0 ? (
          <div
            className="
            rounded-xl
            border border-white/10
            bg-white/3
            p-5
          "
          >
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
              className="block rounded-xl border border-white/10 bg-white/3 p-4 hover:bg-white/5 transition"
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
                      From {request.details?.pickup || "N/A"} to{" "}
                      {request.details?.dropoff || "N/A"}
                    </p>
                  )}

                  {request.type === "PERSONAL_SECURITY" && (
                    <p className="mt-1 text-xs text-white/70">
                      Location: {request.details?.location || "N/A"}
                    </p>
                  )}
                </div>

                <Badge variant={statusVariant(request.status)}>
                  {request.status.replaceAll("_", " ")}
                </Badge>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentRequests;
