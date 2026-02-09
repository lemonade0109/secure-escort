import GlowBackground from "@/components/shared/glow-background";

export default function TrackingLoading() {
  return (
    <main className="min-h-screen bg-[#070a12] text-white relative overflow-hidden">
      <GlowBackground intensity="medium" />

      <div className="max-w-3xl px-6 py-8 sm:py-12 mx-auto">
        <div className="animate-pulse rounded-xl border border-white/10 bg-white/4 p-6">
          <div className="h-3 w-20 rounded bg-white/10" />
          <div className="mt-3 h-6 w-40 rounded bg-white/10" />
          <div className="mt-2 h-4 w-72 max-w-full rounded bg-white/10" />

          <div className="mt-6 space-y-3">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="h-10 w-full rounded bg-white/10" />
            <div className="h-10 w-full rounded bg-white/10" />
          </div>
        </div>
      </div>
    </main>
  );
}
