import GlowBackground from "@/components/shared/glow-background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusPill from "@/components/requests/status-pill";
import { getRequestDetailAction } from "@/lib/actions/requests/get-request-detail";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { requestTypeLabel, InfoRow, getSummary } from "@/lib/helpers-function";
import { RequestDetailsProps } from "@/types";
import { Separator } from "@/components/ui/separator";
import RequestTimeline from "@/components/shared/request-timeline";
import CopyButton from "@/components/requests/copy-button";
import { formatEtaRange } from "@/lib/utils";
import NavigationBar from "@/components/shared/navigationBar";
import ReviewCard from "@/components/reviews/review-card";

export const metadata: Metadata = {
  title: "Request Details - Secure Escort",
  description: "View detailed information about a specific service request.",
};

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

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
      <GlowBackground intensity="medium" />

      <div className="relative z-10 px-6 py-8 sm:py-10 mx-auto space-y-6 max-w-7xl">
        <div className="flex justify-between">
          <div>
            <Link
              href="/requests"
              className="text-xs tracking-widest uppercase text-white/50"
            >
              Request Details
            </Link>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              {requestTypeLabel(requestDetail.type)}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-white/70">
              Tracking:{" "}
              <span className="font-mono text-white/90">
                {requestDetail.trackingCode}
              </span>
            </p>
          </div>

          <div className="flex items-center  gap-2 sm:mt-5">
            <div className="hidden sm:flex">
              <StatusPill status={requestDetail.status} />
            </div>
            <NavigationBar />
          </div>
        </div>

        <Separator className="my-6 border-white/10" />

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <>
              <Card className="text-white lg:col-span-2 border-white/10 bg-white/4 backdrop-blur-xl">
                <CardContent className="px-5 pt-0 pb-5">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* When */}
                    <div className="p-4 border rounded-xl border-white/10 bg-white/3">
                      <p className="text-xs tracking-widest uppercase text-white/50">
                        Estimated Arrival
                      </p>

                      <p className="mt-4 text-sm text-white/90">
                        {formatEtaRange(
                          requestDetail.etaFrom,
                          requestDetail.etaTo,
                          { prefix: "" },
                        ).replace(/^:\s*/, "")}
                      </p>
                    </div>
                    {/* Summary */}
                    <div className="p-4 border rounded-xl border-white/10 bg-white/3 sm:col-span-2 lg:col-span-2">
                      <p className="text-xs tracking-widest uppercase text-white/50">
                        Summary
                      </p>
                      <p className="mt-2 text-sm text-white/90">
                        {typeof summary === "string"
                          ? summary
                          : summary.primary}
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
                  <CardTitle className="text-base">
                    Request Information
                  </CardTitle>
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
                            value={
                              details.itemDescription as string | undefined
                            }
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
                    <p className="text-sm sm:text-base font-medium">Notes</p>
                    <p className="mt-2 text-sm sm:text-base text-white/70">
                      {details?.notes && String(details.notes).trim()
                        ? String(details.notes).trim()
                        : "No additional notes provided."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {requestDetail.status === "COMPLETED" && (
                <div className="mt-6">
                  <ReviewCard requestId={requestDetail.id} />
                </div>
              )}
            </>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tracking Info</CardTitle>
                <div className="w-full h-px mt-4 bg-linear-to-r from-transparent via-white/15 to-transparent" />
              </CardHeader>

              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="text-xs tracking-widest uppercase text-white/50">
                    Tracking Code
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="mt-1 font-mono text-white">
                      {requestDetail.trackingCode}
                    </p>
                    <CopyButton value={requestDetail.trackingCode} />
                  </div>
                  <p className="mt-2 text-xs text-white/60">
                    Share this code to track status updates.
                  </p>
                </div>

                <Separator className="border-white/10" />

                <div className="p-3 border rounded-lg border-white/10 bg-white/3">
                  <p className="text-xs font-medium text-white/90">
                    What&apos;s Next?
                  </p>
                  <p className="mt-2 text-xs text-white/70">
                    {requestDetail.status === "PENDING" &&
                      "Your request is being reviewed. A guard will be assigned soon."}
                    {requestDetail.status === "ASSIGNED" &&
                      "A guard has been assigned. Service will begin shortly."}
                    {requestDetail.status === "IN_PROGRESS" &&
                      "Your service is currently in progress, go to tracking page to view live location."}
                    {requestDetail.status === "COMPLETED" &&
                      "Service completed. Thank you for using Secure Escort!"}
                    {requestDetail.status === "CANCELLED" &&
                      "This request has been cancelled."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <RequestTimeline requestId={requestDetail.id} title="Progress" />
          </div>
        </div>
      </div>
    </main>
  );
}
