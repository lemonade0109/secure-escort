import AdminEtaCard from "@/components/admin/admin-eta-card";
import AdminRequestsTimeline from "@/components/admin/admin-requests-timeline";
import { AdminUpdateStatusCard } from "@/components/admin/admin-update-status";
import AssignGuardCard from "@/components/admin/assign-guard-card";
import UserMenu from "@/components/dashboard/user-menu";
import StatusPill from "@/components/requests/status-pill";
import GlowBackground from "@/components/shared/glow-background";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getActiveGuardsAction } from "@/lib/actions/admin/get-active-guards";
import { getAdminRequestByIdAction } from "@/lib/actions/admin/get-admin-requests-id";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { InfoRow, readDetail, requestTypeLabel } from "@/lib/helpers-function";
import { RequestDetailsProps } from "@/types";
import { Bell } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const req = await getAdminRequestByIdAction(id);

  if (!req) {
    return {
      title: "Request Not Found | Admin Dashboard | Secure Escort",
      description: "The requested security escort request could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const typeFormatted = requestTypeLabel(req.type);
  const statusFormatted = req.status.toLowerCase().replace(/_/g, " ");
  const shortId = req.id.slice(0, 8);

  return {
    title: `${typeFormatted} Request #${shortId} | Admin Dashboard | Secure Escort`,
    description: `View and manage ${typeFormatted.toLowerCase()} request. Status: ${statusFormatted}. Tracking code: ${req.trackingCode}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminRequestsDetailsPage({ params }: Props) {
  const { id } = await params;
  const { session } = await requireVerifiedUser();
  const userIsAdmin = isAdmin(session?.user?.email || "");
  if (!userIsAdmin) return notFound();

  const req = await getAdminRequestByIdAction(id);
  if (!req) return notFound();
  const details = (req.details || {}) as RequestDetailsProps;

  const guardsResult = await getActiveGuardsAction();
  const guards = Array.isArray(guardsResult) ? guardsResult : [];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 px-6 py-10 mx-auto max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-white/50">
              Admin ● Requests
            </p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
              {requestTypeLabel(req.type)}
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Tracking Code:{" "}
              <span className="font-mono text-white/90">
                {req.trackingCode}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                aria-label="Notifications"
                className="inline-flex items-center justify-center border rounded-lg size-9 border-white/10 bg-white/3 text-white/80 hover:bg-white/6"
              >
                <Bell className="size-4" />
              </button>
              <UserMenu
                name={session?.user?.name}
                email={session?.user?.email}
              />
            </div>

            <div className="flex items-center gap-2">
              <StatusPill status={req.status} />
              <Badge className="px-3 py-1 text-xs border border-white/10 bg-white/4 text-white/80">
                {requestTypeLabel(req.type)}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="my-6 border-white/10" />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT: main content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Summary */}
            <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base">Request Summary</CardTitle>
                <CardDescription className="text-white/60">
                  Core information for this request.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4 sm:grid-cols-2">
                <InfoRow label="Status" value={req.status} />
                <InfoRow label="Type" value={requestTypeLabel(req.type)} />
                <InfoRow
                  label="Created"
                  value={new Date(req.createdAt).toLocaleString()}
                />
                <InfoRow
                  label="Updated"
                  value={new Date(req.updatedAt).toLocaleString()}
                />
                <InfoRow label="User" value={req.user?.name || "-"} />
                <InfoRow label="Email" value={req.user?.email || "-"} mono />
              </CardContent>
            </Card>

            {/* Details  */}
            <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base">Request Details</CardTitle>
                <CardDescription className="text-white/60">
                  Additional information provided by the user.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4 sm:grid-cols-2">
                {/* Common Details */}
                <InfoRow label="Notes" value={readDetail(details, "notes")} />
                <InfoRow label="Date" value={readDetail(details, "date")} />
                <InfoRow label="Time" value={readDetail(details, "time")} />

                {/* Escort / Delivery Details */}
                {req.type !== "PERSONAL_SECURITY" && (
                  <>
                    <InfoRow
                      label="Pickup"
                      value={readDetail(details, "pickup")}
                    />
                    <InfoRow
                      label="Dropoff"
                      value={readDetail(details, "dropoff")}
                    />
                  </>
                )}

                {/* Escort Details Only */}
                {req.type === "ESCORT" && (
                  <InfoRow
                    label="Persons"
                    value={readDetail(details, "persons")}
                  />
                )}

                {/* Delivery Details Only */}
                {req.type === "DELIVERY" && (
                  <InfoRow
                    label="Item"
                    value={readDetail(details, "itemDescription")}
                  />
                )}

                {/* Personal Security Details Only */}
                {req.type === "PERSONAL_SECURITY" && (
                  <>
                    <InfoRow
                      label="Location"
                      value={readDetail(details, "location")}
                    />
                    <InfoRow
                      label="Duration (hours)"
                      value={readDetail(details, "durationHours")}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            <AdminEtaCard
              requestId={req.id}
              etaFrom={req.etaFrom}
              etaTo={req.etaTo}
            />
            <AdminRequestsTimeline requestId={req.id} />
          </div>

          {/* RIGHT: sidebar */}
          <div className="space-y-6">
            <AssignGuardCard
              requestId={req.id}
              guardOptions={guards}
              defaultGuardId={req.guard?.id}
            />
            <AdminUpdateStatusCard
              requestId={req.id}
              currentStatus={req.status}
            />

            <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base">Oops Notes</CardTitle>
                <CardDescription className="text-white/60">
                  Admin-only operational notes.
                </CardDescription>
              </CardHeader>

              <CardContent className="text-sm text-white/70">
                Assign a guard before moving status to <b>IN_PROGRESS</b>.
                <div className="mt-4 text-xs text-white">
                  Tip: Tracking activates once a guard is assigned and service
                  starts.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
