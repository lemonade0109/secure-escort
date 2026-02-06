import GlowBackground from "@/components/shared/glow-background";
import NavigationBar from "@/components/shared/navigationBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminAnalyticsAction } from "@/lib/actions/admin/analytics/get-admin-analytics";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";

function pct(x: number) {
  return `${Math.round(x * 100)}%`;
}

export default async function AdminAnalyticsPage() {
  const { session } = await requireVerifiedUser();
  const data = await getAdminAnalyticsAction();

  if (!data.ok) {
    return (
      <main className="min-h-screen bg-[#070a12] text-white relative overflow-hidden">
        <GlowBackground intensity="medium" />

        <div className="relative z-10 px-6 py-10 mx-auto max-w-7xl">
          <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>

            <CardContent className="text-white/70">{data.message}</CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070a12] text-white relative overflow-hidden">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 px-6 py-10 mx-auto space-y-6 max-w-7xl">
        <div className="flex justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-white/50">
              Admin ● Analytics
            </p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Operations Overview
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Quick health metrics for Secure Escorts
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <NavigationBar
              userName={session?.user?.name || ""}
              userEmail={session?.user?.email || ""}
            />
          </div>
        </div>

        {/* Overview cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric title="Requests Today" value={data.todayTotal} />
          <Metric title="Active Now" value={data.activeNow} />
          <Metric
            title="Completion Rate (7d)"
            value={pct(data.completionRate7d)}
          />
          <Metric title="Avg Assign Time (7d)" value={data.last7dTotal} />
        </div>

        <div className="grid gap-6 lg:grid">
          {/* Peak hours */}
          <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Peak Hours (Last 7 Days)
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-6 gap-2 text-xs text-white/70">
                {data.peakHours7d.map((h) => (
                  <div
                    key={h.hour}
                    className="p-2 border rounded-lg border-white/10 bg-white/3"
                  >
                    <div className="text-white/60">{h.hour}: 00</div>
                    <div className="mt-1 text-white">{h.count}</div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-white">
                This helps admins schedule guards around demand
              </p>
            </CardContent>
          </Card>

          {/* Top guards */}
          <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Top Guards (Last 7 Days)
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {data.topGuards7d.length ? (
                data.topGuards7d.map((g) => (
                  <div
                    className="p-3 border rounded-xl border-white/10 bg-white/3"
                    key={g.guardId}
                  >
                    <div className="text-sm font-medium">
                      {g.name}{" "}
                      {g.badgeId ? (
                        <span className="font-mono text-xs text-white/60">
                          ({g.badgeId})
                        </span>
                      ) : null}
                    </div>
                    <div className="text-xs break-all text-white/60">
                      {g.email}
                    </div>
                    <div className="mt-2 text-xs text-white/80">
                      Completed:{" "}
                      <span className="text-white">{g.completedCount}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm border rounded-xl border-white/10 bg-white/3 text-white/70">
                  No completed jobs in the last 7 days
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completion time */}
        <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Service Speed (Last 7 Days)
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 border rounded-xl border-white/10 bg-white/3">
              <p className="text-xs tracking-widest uppercase text-white/50">
                Avg completion time
              </p>
              <p className="mt-1 text-lg text-white">
                {data.avgCompleteMins7d === null
                  ? "_"
                  : `${data.avgCompleteMins7d} mins`}
              </p>
              <p className="mt-1 text-xs text-white/60">
                Created to Completed (from timeline events)
              </p>
            </div>
            <div className="p-4 border rounded-xl border-white/10 bg-white/3">
              <p className="text-xs tracking-widest uppercase text-white/50">
                Completed vs total (7d)
              </p>
              <p className="mt-1 text-lg text-white">
                {data.last7dCompleted} / {data.last7dTotal}
              </p>
              <p className="mt-1 text-xs text-white/60">
                Completion rate: {pct(data.completionRate7d)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Metric({ title, value }: { title: string; value: string | number }) {
  return (
    <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs tracking-widest uppercase text-white/50">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
