import GlowBackground from "@/components/shared/glow-background";

export default function GuardAvailabilityLoading() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 max-w-5xl px-6 py-8 sm:py-10 mx-auto">
        <div className="rounded-xl border border-white/10 bg-white/4 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/3">
            <div className="animate-pulse">
              <div className="h-5 w-44 rounded bg-white/10" />
              <div className="mt-2 h-4 w-64 rounded bg-white/10" />
            </div>
            <div className="flex items-center gap-2 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-white/10" />
            </div>
          </div>

          <div className="p-4">
            <div className="animate-pulse space-y-4">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-white/10 bg-white/3 p-4"
                >
                  <div className="h-4 w-32 rounded bg-white/10" />
                  <div className="mt-2 h-3 w-48 rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
