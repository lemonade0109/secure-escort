import GlowBackground from "@/components/shared/glow-background";

export default function RequestLoading() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 max-w-6xl px-6 py-8 sm:py-10 mx-auto">
        <div className="animate-pulse">
          <div className="h-6 w-40 rounded bg-white/10" />
          <div className="mt-3 h-4 w-80 max-w-full rounded bg-white/10" />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse rounded-xl border border-white/10 bg-white/4 p-5"
            >
              <div className="h-4 w-24 rounded bg-white/10" />
              <div className="mt-4 h-6 w-44 rounded bg-white/10" />
              <div className="mt-3 h-3 w-full rounded bg-white/10" />
              <div className="mt-2 h-3 w-5/6 rounded bg-white/10" />
              <div className="mt-5 h-9 w-28 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
