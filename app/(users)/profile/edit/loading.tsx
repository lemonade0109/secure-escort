import GlowBackground from "@/components/shared/glow-background";

export default function ProfileEditLoading() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 max-w-4xl px-6 py-8 sm:py-10 mx-auto">
        <div className="animate-pulse">
          <div className="h-3 w-20 rounded bg-white/10" />
          <div className="mt-3 h-7 w-40 rounded bg-white/10" />
          <div className="mt-2 h-4 w-72 max-w-full rounded bg-white/10" />
        </div>

        <div className="mt-6 animate-pulse rounded-xl border border-white/10 bg-white/4 p-6 space-y-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="space-y-2">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-10 w-full rounded bg-white/10" />
            </div>
          ))}
          <div className="h-10 w-full rounded bg-white/10" />
        </div>
      </div>
    </main>
  );
}
