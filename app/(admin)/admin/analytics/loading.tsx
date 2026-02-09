import GlowBackground from "@/components/shared/glow-background";

export default function AdminAnalyticsLoading() {
  return (
    <main className="min-h-screen bg-[#070a12] text-white relative overflow-hidden">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 px-6 py-8 sm:py-10 mx-auto space-y-6 max-w-7xl">
        <div className="flex justify-between">
          <div className="animate-pulse">
            <div className="h-3 w-32 rounded bg-white/10" />
            <div className="mt-3 h-7 w-56 rounded bg-white/10" />
            <div className="mt-2 h-4 w-64 rounded bg-white/10" />
          </div>
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-white/10" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-white/4 p-4 animate-pulse">
              <div className="h-3 w-28 rounded bg-white/10" />
              <div className="mt-3 h-6 w-20 rounded bg-white/10" />
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/4 p-4 animate-pulse">
          <div className="h-4 w-40 rounded bg-white/10" />
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="h-16 rounded-lg bg-white/10" />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/4 p-4 animate-pulse">
          <div className="h-4 w-40 rounded bg-white/10" />
          <div className="mt-4 space-y-3">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-12 w-full rounded bg-white/10" />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/4 p-4 animate-pulse">
          <div className="h-4 w-44 rounded bg-white/10" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="h-20 rounded bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
