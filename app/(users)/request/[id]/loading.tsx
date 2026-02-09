import GlowBackground from "@/components/shared/glow-background";

export default function RequestDetailsLoading() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 px-6 py-8 sm:py-10 mx-auto space-y-6 max-w-7xl">
        <div className="animate-pulse">
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="mt-3 h-7 w-56 rounded bg-white/10" />
          <div className="mt-2 h-4 w-64 rounded bg-white/10" />
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            {[...Array(2)].map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-xl border border-white/10 bg-white/4 p-5"
              >
                <div className="h-4 w-32 rounded bg-white/10" />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[...Array(4)].map((__, j) => (
                    <div key={j} className="h-10 rounded bg-white/10" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6 lg:col-span-2">
            {[...Array(2)].map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-xl border border-white/10 bg-white/4 p-5"
              >
                <div className="h-4 w-32 rounded bg-white/10" />
                <div className="mt-4 h-10 w-full rounded bg-white/10" />
                <div className="mt-3 h-24 w-full rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
