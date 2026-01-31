import GlowBackground from "@/components/shared/glow-background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusPill from "@/components/requests/status-pill";
import { getGuardJobByIdAction } from "@/lib/actions/guard/get-guard-job-by-id";
import { notFound } from "next/navigation";
import { requestTypeLabel, readDetail } from "@/lib/helpers-function";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import UserMenu from "@/components/dashboard/user-menu";
import { Bell } from "lucide-react";
import Link from "next/link";
import { GuardJobActionsCard } from "@/components/guard/guard-job-actions-card";
import RequestTimeline from "@/components/shared/request-timeline";
import { Separator } from "@/components/ui/separator";

type Props = { params: Promise<{ id: string }> };

export default async function GuardJobDetailsPage({ params }: Props) {
  const { session } = await requireVerifiedUser();
  const { id } = await params;
  const job = await getGuardJobByIdAction(id);

  if (!job) return notFound();

  const details = (job.details ?? {}) as Record<string, unknown>;
  console.log(details);

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 max-w-5xl px-6 py-10 mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href="/guard/jobs"
              className="text-xs tracking-widest uppercase text-white/50"
            >
              Guard ● Job Details
            </Link>
            <h1 className="text-2xl font-semibold">
              {requestTypeLabel(job.type)}
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Tracking:{" "}
              <span className="font-mono text-white/90">
                {job.trackingCode}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 mt-5">
            <StatusPill status={job.status} />
            <button
              type="button"
              aria-label="Notifications"
              className="inline-flex items-center justify-center border rounded-lg size-9 border-white/10 bg-white/3 text-white/80 hover:bg-white/6"
            >
              <Bell className="size-4" />
            </button>

            <UserMenu
              name={session?.user?.name || null}
              email={session?.user?.email || null}
              role={session?.user?.role || null}
            />
          </div>
        </div>

        <Separator className="my-6 border-white/10" />
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Customer</CardTitle>
                <div className="w-full h-px mt-4 bg-linear-to-r from-transparent via-white/15 to-transparent" />
              </CardHeader>
              <CardContent className="text-sm text-white/80">
                <p>{job.user?.name ?? "-"}</p>
                <p className="text-white/60">{job.user?.email ?? "-"}</p>
              </CardContent>
            </Card>

            <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Details</CardTitle>
                <div className="w-full h-px mt-4 bg-linear-to-r from-transparent via-white/15 to-transparent" />
              </CardHeader>

              <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs tracking-widest uppercase text-white/50">
                    {job.type === "PERSONAL_SECURITY" ? "Location" : "Pickup"}
                  </p>
                  <p className="mt-1 text-white">
                    {job.type === "PERSONAL_SECURITY"
                      ? readDetail(details, "location")
                      : (readDetail(details, "pickup") ?? "-")}
                  </p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-white/50">
                    {job.type === "PERSONAL_SECURITY" ? "Duration" : "Dropoff"}
                  </p>
                  <p className="mt-1 text-white">
                    {job.type === "PERSONAL_SECURITY"
                      ? readDetail(details, "durationHours")
                      : (readDetail(details, "dropoff") ?? "-")}
                  </p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-white/50">
                    Date
                  </p>
                  <p className="mt-1 text-white">
                    {readDetail(details, "date") ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-white/50">
                    Time
                  </p>
                  <p className="mt-1 text-white">
                    {readDetail(details, "time") ?? "-"}
                  </p>
                </div>

                {details.notes ? (
                  <div className="sm:col-span-2">
                    <p className="text-xs tracking-widest uppercase text-white/50">
                      Notes
                    </p>
                    <p className="mt-1 text-white/80">
                      {String(details.notes)}
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <RequestTimeline requestId={job.id} title="Job Timeline" />
          </div>

          <div className="lg:col-span-2">
            <GuardJobActionsCard
              requestId={job.id}
              currentStatus={job.status}
              etaFrom={job.etaFrom}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
