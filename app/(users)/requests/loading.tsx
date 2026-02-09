import GlowBackground from "@/components/shared/glow-background";

export default function RequestsLoading() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 px-6 py-8 sm:py-10 mx-auto space-y-6 max-w-7xl">
        <div className="animate-pulse">
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="mt-3 h-7 w-44 rounded bg-white/10" />
          <div className="mt-2 h-4 w-96 max-w-full rounded bg-white/10" />
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="h-10 w-40 rounded bg-white/10" />
            <div className="h-10 w-40 rounded bg-white/10" />
          </div>
        </div>

        <div className="animate-pulse rounded-xl border border-white/10 bg-white/4 p-4">
          <div className="h-10 w-full rounded bg-white/10" />
        </div>

        <div className="space-y-4">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse rounded-xl border border-white/10 bg-white/4 p-4"
            >
              <div className="h-4 w-48 rounded bg-white/10" />
              <div className="mt-2 h-3 w-72 max-w-full rounded bg-white/10" />
              <div className="mt-3 h-3 w-40 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
