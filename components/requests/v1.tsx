import GlowBackground from "@/components/shared/glow-background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { RequestDetailsProps, PageProps } from "@/types";
import { getRequestDetailAction } from "@/lib/actions/requests/get-request-detail";
import { notFound } from "next/navigation";
import Link from "next/link";
import CopyButton from "@/components/requests/copy-button";
import { Metadata } from "next";
import Breadcrumbs from "@/components/shared/breadcrumbs";
import StatusPill from "@/components/requests/status-pill";
import {
  getSummary,
  InfoRow,
  requestTypeLabel,
  TimeLineItem,
} from "@/lib/helpers-function";

export const metadata: Metadata = {
  title: "Request Details - Secure Escort",
  description: "View detailed information about a specific service request.",
};

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

function formatTimeFromDetails(details: RequestDetailsProps) {
  const t = details?.time;
  if (!t) return null;
  return String(t);
}

export default async function RequestDetailsPage({ params }: PageProps) {
  const id = (await params).id;
  const requestDetail = await getRequestDetailAction(id);
  if (!requestDetail) return notFound();

  const details = requestDetail.details as RequestDetailsProps;
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

            <StatusPill status={requestDetail.status} />
          </div>

          <div className="px-4 py-2 mx-2.5 border rounded-xl border-white/10 bg-white/3 backdrop-blur-xl text-[10px] text-white/90 max-w-sm">
            <Breadcrumbs
              serviceCode={requestDetail.trackingCode}
              page="requests"
            />
          </div>

          <CardContent className="px-5 pt-0 pb-5">
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
                      label="Pickup"
                      value={details?.pickup as string | undefined}
                    />
                    <InfoRow
                      label="Drop-off"
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
        {/* Details + Notes + Timeline */}
        <div className="grid gap-6 mt-6 lg:grid-cols-3">
          {/* Main Details */}

          {/* Timeline - Placeholder for future implementation */}
          <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Progress</CardTitle>
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
                const currentStep = statusOrder.indexOf(requestDetail.status);
                return steps.map((step, idx) => (
                  <TimeLineItem
                    key={step.key}
                    title={step.title}
                    desc={step.desc}
                    active={idx <= currentStep}
                  />
                ));
              })()}
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
