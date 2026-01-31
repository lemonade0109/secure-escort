import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRequestEventsByRequestId } from "@/lib/actions/timeline/get-request-event";

function formatTime(d: Date) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return String(d);
  }
}

function prettyType(t: string) {
  return t.replace(/_/g, " ").toLowerCase();
}

export default async function RequestTimeline({
  requestId,
  title = "Timeline",
  showActor = false,
}: {
  requestId: string;
  title?: string;
  showActor?: boolean; // admin can see actor info
}) {
  const events = await getRequestEventsByRequestId(requestId);

  return (
    <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <div className="p-4 border rounded-xl border-white/10 bg-white/3">
            <p className="text-sm text-white/80">No timeline events yet.</p>
            <p className="mt-1 text-xs text-white/60">
              Events will appear as admins and guards update this request.
            </p>
          </div>
        ) : (
          <ol className="space-y-4">
            {events.map((e) => (
              <li key={e.id} className="flex gap-3">
                <div className="pt-1">
                  <div className="size-3 rounded-full border border-gold bg-gold/30 shadow-[0_0_0_6px_rgba(212,160,23,0.08)]" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{e.message}</p>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="border-white/10 bg-white/4 text-white/80 text-[11px]">
                          {prettyType(e.type)}
                        </Badge>
                        <span className="text-xs text-white/60">
                          {formatTime(e.createdAt)}
                        </span>
                      </div>

                      {showActor && (e.actorName || e.actorEmail) ? (
                        <p className="text-xs text-white/60">
                          by{" "}
                          <span className="text-white/80">
                            {e.actorName ?? e.actorEmail}
                          </span>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="w-full h-px mt-4 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
