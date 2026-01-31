import UserMenu from "@/components/dashboard/user-menu";
import StatusPill from "@/components/requests/status-pill";
import GlowBackground from "@/components/shared/glow-background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGuardJobAction } from "@/lib/actions/guard/get-guard-job.";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { readDetail, requestTypeLabel } from "@/lib/helpers-function";
import { formatGuardEta } from "@/lib/utils";
import { Bell } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  searchParams?: Promise<{ tab?: string }>;
};

export default async function GuardJobPage({ searchParams }: Props) {
  const { session } = await requireVerifiedUser();
  const name = session?.user?.name || null;
  const email = session?.user?.email || null;
  const role = session?.user?.role || null;

  const searchParam = await searchParams;
  const tab =
    searchParam?.tab === "completed" || searchParam?.tab === "all"
      ? searchParam.tab
      : "active";

  const res = await getGuardJobAction(tab);
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 px-6 py-10 mx-auto space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-white/60">
              Guard ● Jobs
            </p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
              My Assigned Jobs
            </h1>
            <p className="mt-1 text-sm text-white/70">
              View your assigned requests and track progress.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              className="inline-flex items-center justify-center border rounded-lg size-9 border-white/10 bg-white/3 text-white/80 hover:bg-white/6"
            >
              <Bell className="size-4" />
            </button>

            <UserMenu name={name} email={email} role={role} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 text-sm">
          <Link
            href="/guard/jobs?tab=active"
            className={[
              "rounded-lg border px-3 py-2",
              tab === "active"
                ? "border-gold/40 bg-white/5"
                : "border-white/10 bg-white/3 hover:bg-white/5",
            ].join(" ")}
          >
            Active
          </Link>
          <Link
            href="/guard/jobs?tab=completed"
            className={[
              "rounded-lg border px-3 py-2",
              tab === "completed"
                ? "border-gold/40 bg-white/5"
                : "border-white/10 bg-white/3 hover:bg-white/5",
            ].join(" ")}
          >
            Completed
          </Link>
          <Link
            href="/guard/jobs?tab=all"
            className={[
              "rounded-lg border px-3 py-2",
              tab === "all"
                ? "border-gold/40 bg-white/5"
                : "border-white/10 bg-white/3 hover:bg-white/5",
            ].join(" ")}
          >
            All
          </Link>
        </div>

        <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Job Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {!res.success ? (
              <div className="p-4 text-sm border rounded-xl border-white/10 bg-white/3 text-white/80">
                {res.message}
              </div>
            ) : !res.job || res.job.length === 0 ? (
              <div className="p-4 border rounded-xl border-white/10 bg-white/3 ">
                <p className="text-sm text-white/80">No jobs available.</p>
                <p className="mt-1 text-xs text-white/60">
                  When an admin assigns a request to you, it will appear here.
                </p>
              </div>
            ) : (
              res.job.map((j) => {
                const details = (j.details ?? {}) as Record<string, unknown>;
                const pickup = readDetail(details, "pickup");
                const dropoff = readDetail(details, "dropoff");
                const location = readDetail(details, "location");

                return (
                  <Link
                    key={j.id}
                    href={`/guard/jobs/${j.id}`}
                    className="block p-4 transition border rounded-xl border-white/10 bg-white/3 hover:bg-white/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          {requestTypeLabel(j.type)}
                        </p>
                        <p className="mt-1 text-xs text-white/60">
                          Tracking:{" "}
                          <span className="font-mono">{j.trackingCode}</span>
                        </p>

                        {j.type !== "PERSONAL_SECURITY" && (
                          <p className="mt-2 text-xs truncate text-white/70">
                            {pickup ? `Pickup: ${String(pickup)} ` : "_ "}{" "}
                            {pickup && dropoff ? " • " : ""}{" "}
                            {dropoff ? `Dropoff: ${String(dropoff)} ` : "_"}
                          </p>
                        )}

                        {j.type === "PERSONAL_SECURITY" && (
                          <p className="mt-2 text-xs truncate text-white/70">
                            Location: {String(location)}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-white/50">
                          Customer: {j.user?.name || "_"} (
                          {j.user?.email || "_"})
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <StatusPill status={j.status} />
                        <p className="text-xs text-white/50">
                          {formatGuardEta(j.etaFrom)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
