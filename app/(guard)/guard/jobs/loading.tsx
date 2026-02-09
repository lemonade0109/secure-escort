import GlowBackground from "@/components/shared/glow-background";

export default function GuardJobsLoading() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 px-6 py-8 sm:py-10 mx-auto space-y-6 max-w-7xl">
        <div className="flex justify-between">
          <div className="animate-pulse">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="mt-3 h-7 w-48 rounded bg-white/10" />
            <div className="mt-2 h-4 w-64 rounded bg-white/10" />
          </div>
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-white/10" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 animate-pulse">
          <div className="h-9 w-20 rounded-lg bg-white/10" />
          <div className="h-9 w-24 rounded-lg bg-white/10" />
          <div className="h-9 w-16 rounded-lg bg-white/10" />
        </div>

        <div className="rounded-xl border border-white/10 bg-white/4 backdrop-blur-xl p-4">
          <div className="animate-pulse">
            <div className="h-5 w-28 rounded bg-white/10" />
          </div>

          <div className="mt-4 space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-xl border border-white/10 bg-white/3 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="h-4 w-40 rounded bg-white/10" />
                    <div className="mt-2 h-3 w-48 rounded bg-white/10" />
                    <div className="mt-2 h-3 w-72 max-w-full rounded bg-white/10" />
                    <div className="mt-2 h-3 w-56 rounded bg-white/10" />
                  </div>
                  <div className="flex flex-row sm:flex-col items-start justify-between sm:items-end gap-2">
                    <div className="h-6 w-20 rounded-full bg-white/10" />
                    <div className="h-3 w-24 rounded bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
