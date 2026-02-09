import GlowBackground from "@/components/shared/glow-background";

export default function AdminGuardDetailsLoading() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 max-w-6xl px-6 py-10 mx-auto space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/3">
            <div className="animate-pulse h-5 w-48 rounded bg-white/10" />
            <div className="flex items-center gap-2 animate-pulse">
              <div className="h-6 w-20 rounded-full bg-white/10" />
              <div className="h-10 w-10 rounded-full bg-white/10" />
            </div>
          </div>

          <div className="p-6 animate-pulse">
            <div className="h-3 w-16 rounded bg-white/10" />
            <div className="mt-3 h-6 w-48 rounded bg-white/10" />
            <div className="mt-2 h-4 w-56 rounded bg-white/10" />

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-10 rounded bg-white/10" />
              ))}
            </div>

            <div className="w-full h-px my-4 bg-white/10" />

            <div className="grid mt-6 lg:grid-cols-3 gap-x-6 gap-y-4">
              <div className="lg:col-span-2 h-40 rounded bg-white/10" />
              <div className="lg:col-span-1 h-40 rounded bg-white/10" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/4 p-4 animate-pulse">
            <div className="h-4 w-40 rounded bg-white/10" />
            <div className="mt-4 space-y-3">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-10 w-full rounded bg-white/10" />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/4 p-4 animate-pulse">
            <div className="h-4 w-40 rounded bg-white/10" />
            <div className="mt-4 space-y-3">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-10 w-full rounded bg-white/10" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
