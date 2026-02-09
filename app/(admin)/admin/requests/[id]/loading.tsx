import GlowBackground from "@/components/shared/glow-background";

export default function AdminRequestDetailsLoading() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 px-6 py-8 sm:py-10 mx-auto max-w-7xl">
        <div className="flex justify-between">
          <div className="animate-pulse">
            <div className="h-3 w-32 rounded bg-white/10" />
            <div className="mt-3 h-7 w-48 rounded bg-white/10" />
            <div className="mt-2 h-4 w-56 rounded bg-white/10" />
          </div>
          <div className="flex flex-col items-end gap-4 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-white/10" />
            <div className="hidden sm:flex gap-2">
              <div className="h-6 w-20 rounded-full bg-white/10" />
              <div className="h-6 w-24 rounded-full bg-white/10" />
            </div>
          </div>
        </div>

        <div className="my-6 h-px w-full bg-white/10" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {[...Array(2)].map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-white/4 p-4 animate-pulse"
              >
                <div className="h-4 w-40 rounded bg-white/10" />
                <div className="mt-2 h-3 w-56 rounded bg-white/10" />
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[...Array(6)].map((__, rowIdx) => (
                    <div key={rowIdx}>
                      <div className="h-3 w-20 rounded bg-white/10" />
                      <div className="mt-2 h-4 w-40 rounded bg-white/10" />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-white/10 bg-white/4 p-4 animate-pulse">
              <div className="h-4 w-32 rounded bg-white/10" />
              <div className="mt-4 space-y-3">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="h-3 w-full rounded bg-white/10" />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-white/4 p-4 animate-pulse"
              >
                <div className="h-4 w-36 rounded bg-white/10" />
                <div className="mt-4 space-y-3">
                  <div className="h-9 w-full rounded bg-white/10" />
                  <div className="h-9 w-full rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
