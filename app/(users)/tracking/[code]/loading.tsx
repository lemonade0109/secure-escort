import GlowBackground from "@/components/shared/glow-background";

export default function TrackingCodeLoading() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 max-w-4xl px-6 py-8 sm:py-12 mx-auto">
        <div className="animate-pulse rounded-xl border border-white/10 bg-white/4 p-4">
          <div className="h-10 w-full rounded bg-white/10" />
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {[...Array(2)].map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-white/3 p-4"
              >
                <div className="h-4 w-40 rounded bg-white/10" />
                <div className="mt-3 h-3 w-full rounded bg-white/10" />
                <div className="mt-2 h-3 w-5/6 rounded bg-white/10" />
                <div className="mt-6 h-24 w-full rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 animate-pulse rounded-xl border border-white/10 bg-white/4 p-4">
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="mt-3 h-3 w-2/3 rounded bg-white/10" />
          <div className="mt-3 h-52 w-full rounded bg-white/10" />
        </div>
      </div>
    </main>
  );
}
