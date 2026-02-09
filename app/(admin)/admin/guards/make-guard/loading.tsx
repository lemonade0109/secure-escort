import GlowBackground from "@/components/shared/glow-background";

export default function AdminMakeGuardLoading() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 max-w-3xl px-6 py-8 sm:py-10 mx-auto">
        <div className="mb-4 animate-pulse">
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="mt-3 h-7 w-48 rounded bg-white/10" />
          <div className="mt-2 h-4 w-72 max-w-full rounded bg-white/10" />
        </div>

        <div className="rounded-xl border border-white/10 bg-white/4 p-6 animate-pulse">
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="mt-4 space-y-3">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-10 w-full rounded bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
