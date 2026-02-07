import MakeGuardActive from "@/components/admin/make-guard-active";
import GuardRatingCard from "@/components/guard/guard-rating-card";
import GlowBackground from "@/components/shared/glow-background";
import NavigationBar from "@/components/shared/navigationBar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminGuardByIdAction } from "@/lib/actions/admin/get-admin-guard-by-id";
import { getGuardRatingStatsAction } from "@/lib/actions/guard/get-guard-rating-stats";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import {
  InfoRow,
  readDetail,
  requestStatusLabel,
  requestTypeLabel,
} from "@/lib/helpers-function";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function AdminGuardDetailsPage({ params }: Props) {
  const { session } = await requireVerifiedUser();
  const userIsAdmin = isAdmin(session?.user?.email || "");
  if (!userIsAdmin) {
    redirect("/dashboard");
  }

  const { id } = await params;

  const guard = await getAdminGuardByIdAction(id);
  if (!guard) return notFound();
  const stats = await getGuardRatingStatsAction(guard.id);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 max-w-6xl px-6 py-10 mx-auto space-y-6">
        {/* Header */}
        <Card className="overflow-hidden text-white bg-white/4 border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/3">
            <div className="text-xl font-bold">Admin ● Guard Details</div>

            <div className="">
              <div className="flex items-center gap-2">
                {guard.active ? (
                  <Badge className="border border-gold/40 bg-gold/15 text-gold">
                    Active
                  </Badge>
                ) : (
                  <Badge className="border border-white/15 bg-white/5 text-white/70">
                    Inactive
                  </Badge>
                )}
                <div className="flex items-center gap-2 ml-4">
                  <NavigationBar />
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="flex flex-col gap-6 ">
              <div className="">
                <p className="text-xs tracking-widest text-white uppercase">
                  Guard
                </p>
                <h1 className="mt-2 text-2xl font-semibold">
                  {guard.user?.name ?? "No name"}
                </h1>
                <p className="mt-1 text-sm text-white/70">
                  <span className="font-mono text-white/90">
                    {guard.user?.email}
                  </span>
                </p>

                <div className="grid gap-4 mt-5 sm:grid-cols-3">
                  <InfoRow label="Badge ID" value={guard.badgeId || "_"} mono />
                  <InfoRow label="Phone" value={guard.phone || "_"} mono />
                  <InfoRow
                    label="Created"
                    value={new Date(guard.createdAt).toLocaleDateString()}
                    mono
                  />
                </div>

                <div className="w-full h-px my-4 bg-linear-to-r from-transparent via-white/15 to-transparent" />

                <div className="grid mt-6 lg:grid-cols-3 gap-x-6 gap-y-4">
                  <div className="lg:col-span-2">
                    <GuardRatingCard
                      average={stats?.average ?? 0}
                      total={stats?.total ?? 0}
                      reviews={
                        stats?.recent
                          ?.filter((review) => review.comment !== null)
                          .map((review) => ({
                            ...review,
                            comment: review.comment || "",
                            createdAt: review.createdAt.toISOString(),
                            user: {
                              name: review.user?.name || "Anonymous",
                            },
                          })) ?? []
                      }
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <MakeGuardActive active={guard.active} guardId={guard.id} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Requests */}
          <Card className="text-white lg:col-span-2 border-white/10 bg-white/4 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Assigned (Active)</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {guard.activeRequests.length === 0 ? (
                <EmptyBox text="No active requests yet." />
              ) : (
                guard.activeRequests.map((request) => {
                  const details = (request.details ?? {}) as Record<
                    string,
                    unknown
                  >;
                  const pickup = readDetail(details, "pickup");
                  const dropoff = readDetail(details, "dropoff");
                  const location = readDetail(details, "location");

                  return (
                    <RequestRow
                      key={request.id}
                      id={request.id}
                      trackingCode={request.trackingCode}
                      title={`${requestTypeLabel(request.type)} ● ${requestStatusLabel(request.status)}`}
                      subtitle={
                        request.type === "PERSONAL_SECURITY"
                          ? `Location: ${location ?? "_"}`
                          : `Pickup: ${pickup ?? "_"} → Dropoff: ${dropoff ?? "_"}`
                      }
                    />
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Completed Requests */}

          <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recently Completed</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {guard.completedRequests.length === 0 ? (
                <EmptyBox text="No completed requests yet." />
              ) : (
                guard.completedRequests.map((request) => (
                  <RequestRow
                    key={request.id}
                    id={request.id}
                    trackingCode={request.trackingCode}
                    title={`${requestTypeLabel(request.type)} ● COMPLETED`}
                    subtitle={`Completed on ${new Date(
                      request.updatedAt,
                    ).toLocaleDateString()}`}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function EmptyBox({ text }: { text: string }) {
  return (
    <div className="p-4 border rounded-xl border-white/10 bg-white/3">
      <p className="text-sm text-white/80">{text}</p>
      <p className="mt-1 text-xs text-white/60">
        Items will appear here once requests are assigned to this guard
      </p>
    </div>
  );
}

function RequestRow({
  id,
  trackingCode,
  title,
  subtitle,
}: {
  id: string;
  trackingCode: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={`/admin/requests/${id}`}
      className="block p-4 transition border rounded-xl border-white/10 bg-white/3 hover:bg-white/6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-xs text-white/60">{subtitle}</p>
        </div>

        <span className="font-mono text-xs text-white/70">{trackingCode}</span>
      </div>
      <div className="w-full h-px mt-4 bg-linear-to-r from-transparent via-white/15 to-transparent"></div>
    </Link>
  );
}
