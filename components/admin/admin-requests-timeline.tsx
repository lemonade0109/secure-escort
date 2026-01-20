import { getRequestEventsByRequestId } from "@/lib/actions/admin/request-events";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import StatusPill from "../requests/status-pill";

function fmtTime(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
  }).format(d);
}

const AdminRequestsTimeline: React.FC<{
  requestId: string;
}> = async ({ requestId }) => {
  const events = await getRequestEventsByRequestId(requestId);

  return (
    <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Request Timeline</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <div className="p-4 border rounded-xl border-white/10 bg-white/3">
            <p className="text-sm text-white/80">No timelines available.</p>
            <p className="mt-1 text-xs text-white">
              Events will appear when admins assign guard, update status, or add
              notes.
            </p>
          </div>
        ) : (
          <ol className="space-y-4">
            {events.map((event) => {
              const actor =
                event.actor?.name?.trim() || event?.actor?.email || "System";
              return (
                <li key={event.id} className="flex gap-3">
                  <div className="relative pt-1">
                    <div className="border rounded-full size-3 border-gold/40 bg-gold/20" />
                    <div className="absolute left-1.5 top-4 h-full w-px bg-white/10" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill status={event.type} />
                      <span className="text-xs text-white/60">
                        {fmtTime(event.createdAt)}
                      </span>
                      <span className="text-xs text-white/50">●</span>
                      <span className="text-xs text-white/70">{actor}</span>
                    </div>

                    <p className="mt-1 text-white/85">{event.message}</p>

                    {/* Optional: might remove later */}
                    {event.meta && Object.keys(event.meta).length > 0 ? (
                      <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-black/30 p-3 text-[11px] text-white/70">
                        {JSON.stringify(event.meta, null, 2)}
                      </pre>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminRequestsTimeline;
