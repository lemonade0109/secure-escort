import AvailabilityCard from "@/components/admin/availability-card";
import GlowBackground from "@/components/shared/glow-background";
import NavigationBar from "@/components/shared/navigationBar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getGuardAvailabilityBlocksAction } from "@/lib/actions/guard/get-availability";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";

export default async function GuardAvailabilityPage() {
  const { session } = await requireVerifiedUser();
  const userName = session?.user?.name || "Guard";
  const userEmail = session?.user?.email || "";
  const userRole = session?.user?.role || "USER";
  const data = await getGuardAvailabilityBlocksAction();

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 max-w-5xl px-6 py-10 mx-auto">
        <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/3">
            <CardTitle className="font-normal">
              <span className="text-lg ">Availability Schedule</span>
              <p className="text-xs text-white/60">
                Manage when you are available to work.
              </p>
            </CardTitle>

            <div className="flex items-center gap-2">
              <NavigationBar
                userName={userName || ""}
                userEmail={userEmail || ""}
                role={userRole || ""}
              />
            </div>
          </div>

          <CardContent>{data && <AvailabilityCard data={data} />}</CardContent>
        </Card>
      </div>
    </main>
  );
}
