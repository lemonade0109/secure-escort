import GlowBackground from "@/components/shared/glow-background";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db/db";

export const dynamic = "force-dynamic";

export default async function RequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireVerifiedUser();

  const req = await db.request.findUnique({
    where: { id: (await params).id },
  });

  if (!req) {
    return (
      <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
        <GlowBackground intensity="medium" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-10">
          <Card className="border-white/10 bg-white/4 text-white backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Request not found</CardTitle>
            </CardHeader>
            <CardContent className="text-white/70 text-sm">
              The request you&apos;re looking for does not exist.
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-10">
        <Card className="border-white/10 bg-white/4 text-white backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
            <p className="text-sm text-white/70">
              Tracking Code:{" "}
              <span className="text-white">{req.trackingCode}</span>
            </p>
          </CardHeader>
          <CardContent className="text-sm text-white/80 space-y-2">
            <div>
              Type: <span className="text-white">{req.type}</span>
            </div>
            <div>
              Status: <span className="text-white">{req.status}</span>
            </div>
            <pre className="mt-4 rounded-lg border border-white/10 bg-white/3 p-4 text-xs overflow-auto">
              {JSON.stringify(req.details, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
