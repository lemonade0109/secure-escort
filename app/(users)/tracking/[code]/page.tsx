import DashboardNav from "@/components/layout/navbar/dashboard-nav";
import StatusPill from "@/components/requests/status-pill";
import GlowBackground from "@/components/shared/glow-background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrackingCodeAction } from "@/lib/actions/tracking/get-tracking-code";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import {
  getSummary,
  requestTypeLabel,
  TimeLineItem,
} from "@/lib/helpers-function";
import { RequestDetailsProps } from "@/types";
import TrackingMap from "@/components/tracking/tracking-map";
import { getLatestCheckpoint } from "@/lib/actions/tracking/get-latest-checkpoint";

function formatEta(d?: Date | string | null) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function TrackingCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const { session } = await requireVerifiedUser();
  const request = await getTrackingCodeAction({ code });
  const latestCheckpoint = request
    ? await getLatestCheckpoint(request.id)
    : null;

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 max-w-4xl px-6 py-8 sm:py-12 mx-auto">
        <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
          <DashboardNav
            email={session?.user?.email}
            name={session?.user?.name}
          />

          {!request ? (
            <Card className="mx-2 text-white border-white/10 bg-white/4 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  Tracking code &quot;{code}&quot; not found.
                  <p className="text-sm sm:text-base text-white/70">
                    Please check the code and try again.
                  </p>
                </CardTitle>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="sm:ml-2 text-white border-white/10 bg-white/4 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-base sm:text-lg">
                      Tracking Code: {request.trackingCode}
                    </CardTitle>
                    <StatusPill status={request.status} />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {(() => {
                    const details = request.details as RequestDetailsProps;
                    const summary = getSummary(details, String(request.type));

                    return (
                      <div className="space-y-3">
                        <div className="p-4 border rounded-xl border-white/10 bg-white/3">
                          <p className="text-xs tracking-widest uppercase text-white/50">
                            Type
                          </p>
                          <p className="mt-1 text-sm text-white">
                            {requestTypeLabel(String(details.type))}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="p-4 border rounded-xl border-white/10 bg-white/3">
                            <p className="text-xs tracking-widest uppercase text-white/50">
                              {requestTypeLabel(String(details.type)) ===
                              "Personal Security"
                                ? "Location"
                                : "Pickup"}
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {typeof summary === "string"
                                ? summary
                                : String(summary?.primary)}
                            </p>
                          </div>

                          <div className="p-4 border rounded-xl border-white/10 bg-white/3">
                            <p className="text-xs tracking-widest uppercase text-white/50">
                              {requestTypeLabel(String(details.type)) ===
                              "Personal Security"
                                ? "Duration"
                                : "Dropoff"}
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {typeof summary === "string"
                                ? ""
                                : String(summary?.secondary)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                          <span className="px-2 py-1 border rounded-full border-white/10 bg-white/3 text-white/70">
                            ETA
                          </span>

                          {request.status === "PENDING" ? (
                            <span className="text-white/60">
                              Pending assignment
                            </span>
                          ) : request.etaFrom || request.etaTo ? (
                            <span className="text-white/80">
                              <span className="font-medium text-white/90">
                                {formatEta(request.etaFrom) || "—"}
                              </span>{" "}
                              <span className="text-white/60">to</span>{" "}
                              <span className="font-medium text-white/90">
                                {formatEta(request.etaTo) || "—"}
                              </span>
                            </span>
                          ) : (
                            <span className="text-white/60">
                              Assigned. ETA coming soon.
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Right: Timeline */}
              <Card className="sm:mr-2 text-white border-white/10 bg-white/4 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="pb-2 text-base sm:text-lg">
                    Progress
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {(() => {
                    const steps = [
                      {
                        key: "PENDING",
                        title: "Request created",
                        desc: "We receive your request and it's queued for assignment.",
                      },
                      {
                        key: "ASSIGNED",
                        title: "Guard Assigned",
                        desc: "A guard will be assigned and you'll receive updates.",
                      },
                      {
                        key: "IN_PROGRESS",
                        title: "In Progress",
                        desc: "Tracking becomes active once service starts.",
                      },
                      {
                        key: "COMPLETED",
                        title: "Completed",
                        desc: "Service finished. You'll be able to rate your experience.",
                      },
                    ];
                    const statusOrder = [
                      "PENDING",
                      "ASSIGNED",
                      "IN_PROGRESS",
                      "COMPLETED",
                    ];
                    const currentStep = statusOrder.indexOf(request.status);
                    return steps.map((step, idx) => (
                      <TimeLineItem
                        key={step.key}
                        title={step.title}
                        desc={step.desc}
                        active={idx <= currentStep}
                      />
                    ));
                  })()}
                </CardContent>
              </Card>
            </div>
          )}
        </Card>

        {latestCheckpoint && (
          <Card className="my-4 text-white border-white/10 bg-white/4 backdrop-blur-xl">
            <CardContent className="py-4 space-y-2">
              <p className="text-xs tracking-widest uppercase text-white/50">
                Latest Update
              </p>

              <p className="text-sm sm:text-base font-medium text-white">
                {latestCheckpoint.label}
              </p>

              {latestCheckpoint.note && (
                <p className="text-xs sm:text-sm text-white/70">
                  {latestCheckpoint.note}
                </p>
              )}

              <p className="text-white/50 text-[11px]">
                {new Date(latestCheckpoint.createdAt).toLocaleString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </CardContent>
          </Card>
        )}
        {request && (
          <div className="mt-4">
            <TrackingMap requestId={request.id} status={request.status} />
          </div>
        )}
      </div>
    </main>
  );
}
