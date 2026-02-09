import GlowBackground from "@/components/shared/glow-background";

export default function AdminAuditLoading() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 px-6 py-8 sm:py-10 mx-auto space-y-6 max-w-7xl">
        <div className="flex justify-between">
          <div className="animate-pulse">
            <div className="h-3 w-32 rounded bg-white/10" />
            <div className="mt-3 h-7 w-48 rounded bg-white/10" />
            <div className="mt-2 h-4 w-80 max-w-full rounded bg-white/10" />
          </div>
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-white/10" />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/4 p-4">
          <div className="animate-pulse">
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="mt-4 h-10 w-full rounded bg-white/10" />
            <div className="mt-4 space-y-3">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="h-10 w-full rounded bg-white/10" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
