import GlowBackground from "@/components/shared/glow-background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { RequestDetails, PageProps } from "@/types";
import { getRequestDetailAction } from "@/lib/actions/requests/get-request-detail";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/requests/status-badge";
import CopyButton from "@/components/requests/copy-button";

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

function formatTimeFromDetails(details: RequestDetails) {
  const t = details?.time;
  if (!t) return null;
  return String(t);
}

function requestTypeLabel(type: string) {
  switch (type) {
    case "PERSONAL_SECURITY":
      return "Personal Security";
    case "ESCORT":
      return "Escort Service";
    case "DELIVERY":
      return "Delivery Service";
    default:
      return type;
  }
}

function getSummary(details: RequestDetails, type: string) {
  switch (type) {
    case "ESCORT":
    case "DELIVERY":
      return {
        primary: details.pickup ? `Pickup: ${details.pickup}` : "Pickup",
        secondary: details.dropoff ? `Dropoff: ${details.dropoff}` : "Drop-off",
      };
    case "PERSONAL_SECURITY":
      return {
        primary: details.location
          ? `Location: ${details.location}`
          : "Location",
        secondary: details.durationHours
          ? `Duration: ${details.durationHours} hour(s)`
          : "Duration",
      };
    default:
      return type;
  }
}

export default async function RequestDetailsPage({ params }: PageProps) {
  const id = (await params).id;
  const requestDetail = await getRequestDetailAction(id);
  if (!requestDetail) return notFound();

  const details = requestDetail.details as RequestDetails;
  const time = formatTimeFromDetails(details);
  const summary = getSummary(details, requestDetail.type);

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="strong" />

      <div className="relative z-10 max-w-3xl px-6 py-10 mx-auto">
        <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/3">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-lg"
              >
                <div className="inline-flex items-center justify-center border rounded-lg size-8 border-white/10 bg-white/3">
                  <ShieldCheck className="size-4 text-gold" />
                </div>
              </Link>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/50">
                  Request Details
                </p>
                <h1 className="text-lg font-semibold sm:text-xl">
                  {requestTypeLabel(requestDetail.type)}
                </h1>
              </div>
            </div>

            <StatusBadge status={requestDetail.status} />
          </div>

          <CardContent className="p-5">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Tracking */}
              <div className="p-4 border rounded-xl border-white/10 bg-white/3">
                <p className="text-xs tracking-widest uppercase text-white/50">
                  Tracking Code
                </p>
                <div className="flex items-center justify-between gap-3 mt-2">
                  <p className="font-mono text-sm sm:text-base text-white/90">
                    {requestDetail.trackingCode}
                  </p>
                  <CopyButton value={requestDetail.trackingCode} />
                </div>
                <p className="mt-2 text-xs text-white/60">
                  Share this code to track status updates.
                </p>
              </div>

              {/* When */}
              <div className="p-4 border rounded-xl border-white/10 bg-white/3">
                <p className="text-xs tracking-widest uppercase text-white/50">
                  Scheduled
                </p>
                <p className="mt-2 text-sm text-white/90">
                  {details?.date
                    ? String(details.date)
                    : formatDate(requestDetail.createdAt)}
                </p>
                {time ? (
                  <p className="mt-1 text-xs text-white/90">Time: {time}</p>
                ) : (
                  <p className="mt-1 text-xs text-white/90">Time: -</p>
                )}
              </div>

              {/* Summary */}
              <div className="p-4 border rounded-xl border-white/10 bg-white/3">
                <p className="text-xs tracking-widest uppercase text-white/50">
                  Summary
                </p>
                <p className="mt-2 text-sm text-white/90">
                  {typeof summary === "string" ? summary : summary.primary}
                </p>
                <p className="mt-1 text-sm text-white/90">
                  {typeof summary === "string" ? "" : summary.secondary}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details + Notes + Timeline */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Details */}
          <Card className="text-white lg:col-span-2 border-white/10 bg-white/4 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Request Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-4 border rounded-xl border-white/10 bg-white/3">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoRow
                    label="Request ID"
                    value={requestDetail.id?.slice(0, 10) + "..."}
                    mono
                  />
                  <InfoRow
                    label="Type"
                    value={requestTypeLabel(requestDetail.type)}
                  />
                  <InfoRow label="Status" value={requestDetail.status} />
                  <InfoRow
                    label="Created"
                    value={formatDate(requestDetail.createdAt)}
                  />
                </div>

                <div className="w-full h-px mt-4 bg-linear-to-r from-transparent via-white/15 to-transparent" />

                {/* Type-specific details */}
                <div className="grid gap-4 mt-4 sm:grid-cols-2">
                  {requestDetail.type === "PERSONAL_SECURITY" && (
                    <>
                      <InfoRow
                        label="Location"
                        value={details?.location as string | undefined}
                      />
                      <InfoRow
                        label="Duration (hours)"
                        value={
                          details?.durationHours != null
                            ? String(details.durationHours)
                            : undefined
                        }
                      />
                      <InfoRow
                        label="Date"
                        value={details?.date as string | undefined}
                      />
                      <InfoRow label="Time" value={time} />
                    </>
                  )}

                  {requestDetail.type === "ESCORT" && (
                    <>
                      <InfoRow
                        label="Pickup Location"
                        value={details?.pickup as string | undefined}
                      />
                      <InfoRow
                        label="Drop-off Location"
                        value={details?.dropoff as string | undefined}
                      />
                      <InfoRow
                        label="Date"
                        value={details?.date as string | undefined}
                      />
                      <InfoRow label="Time" value={time} />
                      <InfoRow
                        label="Persons"
                        value={
                          details?.persons != null
                            ? String(details.persons)
                            : undefined
                        }
                      />
                    </>
                  )}

                  {requestDetail.type === "DELIVERY" && (
                    <>
                      <InfoRow
                        label="Pickup Location"
                        value={details?.pickup as string | undefined}
                      />
                      <InfoRow
                        label="Drop-off Location"
                        value={details?.dropoff as string | undefined}
                      />
                      <InfoRow
                        label="Date"
                        value={details?.date as string | undefined}
                      />
                      <InfoRow label="Time" value={time} />
                      <InfoRow
                        label="Item"
                        value={details.itemDescription as string | undefined}
                      />
                      <InfoRow
                        label="Package Value"
                        value={
                          details.estimatedValue != null
                            ? `₦${Number(details.estimatedValue).toLocaleString()}`
                            : "-"
                        }
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="p-4 border rounded-xl border-white/10 bg-white/3">
                <p className="text-sm font-medium">Notes</p>
                <p className="mt-2 text-sm text-white/70">
                  {details?.notes && String(details.notes).trim()
                    ? String(details.notes).trim()
                    : "No additional notes provided."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline - Placeholder for future implementation */}
          <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TimeLineItem
                title="Request created"
                desc="We receive your request and it's queued for assignment."
                active
              />

              <TimeLineItem
                title="Guard Assigned"
                desc="A guard will be assigned and you'll receive updates."
              />
              <TimeLineItem
                title="In Progress"
                desc="Tracking becomes active once service starts."
              />
              <TimeLineItem
                title="Completed"
                desc="Service finished. You'll be able to rate your experience."
              />

              <div className="pt-2 text-xs text-white/60">
                ETA and live tracking will appear when the request is assigned.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | undefined | null;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs tracking-widest uppercase text-white/50">{label}</p>
      <p
        className={`mt-1 text-sm text-white ${mono ? "font-mono" : ""} break-all`}
      >
        {value && String(value).trim().length ? String(value).trim() : "-"}
      </p>
    </div>
  );
}

function TimeLineItem({
  title,
  desc,
  active,
}: {
  title: string;
  desc: string;
  active?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="pt-1">
        <div
          className={[
            "size-3 rounded-full border",
            active
              ? "border-gold bg-gold/40 shadow-[0_0_0_6px_rgba(212,160,23,10)]"
              : "border-white/20 bg-white/5",
          ].join(" ")}
        />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs text-white/60">{desc}</p>
      </div>
    </div>
  );
}
